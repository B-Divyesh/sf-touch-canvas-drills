import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

async function drawPointerStroke(page: Page) {
  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();
  if (!box) throw new Error('drawing canvas is not visible');
  await page.mouse.move(box.x + 70, box.y + 80);
  await page.mouse.down();
  await page.mouse.move(box.x + 220, box.y + 150, { steps: 5 });
  await page.mouse.up();
}

async function demoRecord(page: Page) {
  return page.evaluate(() => new Promise<unknown>((resolve, reject) => {
    const request = indexedDB.open('touch-canvas-drills', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const database = request.result;
      const transaction = database.transaction('practice', 'readonly');
      const get = transaction.objectStore('practice').get('demo:touch-canvas-drills:data');
      get.onsuccess = () => {
        database.close();
        resolve(get.result ?? null);
      };
      get.onerror = () => reject(get.error);
    };
  }));
}

async function guidePixelsNear(page: Page, x: number, y: number) {
  return page.locator('canvas').evaluate((canvas: HTMLCanvasElement, point) => {
    const context = canvas.getContext('2d')!;
    const pixels = context.getImageData(point.x - 12, point.y - 12, 24, 24).data;
    let matches = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      if (Math.abs(pixels[index] - 139) < 12 && Math.abs(pixels[index + 1] - 181) < 12 && Math.abs(pixels[index + 2] - 201) < 12) matches++;
    }
    return matches;
  }, { x, y });
}

test('accessibility smoke check has no serious or critical violations', async ({ page }) => {
  await page.goto('/demo');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(v => ['serious', 'critical'].includes(v.impact || ''))).toEqual([]);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('main')).toHaveCount(1);
});

test('@claim:twenty-drills demo loads all 20 guided drills', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'Make one steadier mark' })).toBeVisible();
  await expect(page.locator('[data-drill]')).toHaveCount(20);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
});

test('@claim:png-export exports one drill image', async ({ page }) => {
  await page.goto('/demo');
  await drawPointerStroke(page);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export PNG' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe('rail-lines.png');
  expect((await file.createReadStream())?.readable).toBeTruthy();
});

test('@claim:privacy-local demo sends no cross-origin requests', async ({ page }) => {
  const foreign: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') foreign.push(request.url());
  });
  await page.goto('/demo');
  await drawPointerStroke(page);
  await page.getByRole('button', { name: 'Save this drill' }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  expect(foreign).toEqual([]);
});

test('@claim:offline-reload opens practice offline after only the landing visit', async ({ page, context }) => {
  await page.goto('/');
  await page.waitForFunction(async () => {
    await navigator.serviceWorker.ready;
    return navigator.serviceWorker.controller !== null;
  });
  await page.reload();
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.goto('/practice');
  await expect(page.getByRole('heading', { name: 'Make one steadier mark' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'You are offline.' })).toHaveCount(0);
});

test('@claim:demo-isolation reset reseeds and Start for real removes demo data from both stores', async ({ page }) => {
  await page.goto('/demo');
  await expect.poll(async () => demoRecord(page)).not.toBeNull();
  await drawPointerStroke(page);
  await page.getByRole('button', { name: 'Save this drill' }).click();
  await expect(page.getByText('3 saved drills on this device.')).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('2 saved drills on this device.')).toBeVisible();
  await expect.poll(async () => (await demoRecord(page) as { sessions?: unknown[] } | null)?.sessions?.length).toBe(2);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/practice$/);
  expect(await page.evaluate(() => localStorage.getItem('demo:touch-canvas-drills:data'))).toBeNull();
  expect(await demoRecord(page)).toBeNull();
});

test('@claim:keyboard-drawing keyboard-only users can draw and save', async ({ page }) => {
  await page.goto('/practice');
  const canvas = page.getByRole('application', { name: /Drawing area for Rail lines/ });
  for (let index = 0; index < 30 && !(await canvas.evaluate(element => element === document.activeElement)); index++) await page.keyboard.press('Tab');
  await expect(canvas).toBeFocused();
  await page.keyboard.press('Space');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Shift+ArrowDown');
  await page.keyboard.press('Space');
  await expect(page.getByRole('button', { name: 'Save this drill' })).toBeEnabled();
  await page.getByRole('button', { name: 'Save this drill' }).click();
  await expect(page.getByText('1 saved drill on this device.')).toBeVisible();
});

test('@claim:saved-replay saved marks can be replayed after refresh', async ({ page }) => {
  await page.goto('/practice');
  await drawPointerStroke(page);
  await page.getByRole('button', { name: 'Save this drill' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Replay saved marks' }).click();
  await expect(page.getByText(/Loaded saved Rail lines marks|Replay finished/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Replay marks' })).toBeEnabled();
});

test('@claim:local-progress seven-day progress and JSON export contain the saved drill', async ({ page }, testInfo) => {
  await page.goto('/practice');
  await drawPointerStroke(page);
  await page.getByRole('button', { name: 'Save this drill' }).click();
  await expect(page.getByText('1 saved drill on this device.')).toBeVisible();
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export progress JSON' }).click();
  const download = await pending;
  const target = testInfo.outputPath('progress.json');
  await download.saveAs(target);
  const exported = JSON.parse(await readFile(target, 'utf8')) as { sessions: { drillId: string }[] };
  expect(exported.sessions).toHaveLength(1);
  expect(exported.sessions[0].drillId).toBe('rail-lines');
});

test('@claim:free-core core drills, saving, and exports need no license', async ({ page }) => {
  await page.goto('/practice');
  await expect(page.locator('#note')).toBeDisabled();
  await expect(page.locator('[data-drill]')).toHaveCount(20);
  await drawPointerStroke(page);
  await expect(page.getByRole('button', { name: 'Save this drill' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Export PNG' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Export progress JSON' })).toBeEnabled();
});

test('@claim:paid-extras the $6 checkout and valid license expose notes and print', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('$6', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Buy the extras' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/touch-canvas-drills/checkout');
  await page.route('https://api.sociobot.in/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{"valid":true,"reason":"ok"}' }));
  await page.goto('/practice?license=fixture-license');
  await expect(page).toHaveURL(/\/practice$/);
  await expect(page.locator('#note')).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Print practice week' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('sb_license:touch-canvas-drills'))).toBe('fixture-license');
  await page.evaluate(() => { window.print = () => { document.body.dataset.printed = 'true'; }; });
  await page.getByRole('button', { name: 'Print practice week' }).click();
  await expect(page.locator('body')).toHaveAttribute('data-printed', 'true');
});

test('triangle, diamond, and leaf drills render their named guides', async ({ page }) => {
  await page.goto('/practice');
  await page.getByRole('button', { name: /15 Triangle trio/ }).click();
  expect(await guidePixelsNear(page, 198, 135)).toBeGreaterThan(0);
  expect(await guidePixelsNear(page, 81, 473)).toBeGreaterThan(0);
  await page.getByRole('button', { name: /17 Diamond grid/ }).click();
  expect(await guidePixelsNear(page, 225, 122)).toBeGreaterThan(0);
  expect(await guidePixelsNear(page, 135, 216)).toBeGreaterThan(0);
  await page.getByRole('button', { name: /19 Leaf pair/ }).click();
  expect(await guidePixelsNear(page, 108, 338)).toBeGreaterThan(0);
  expect(await guidePixelsNear(page, 792, 338)).toBeGreaterThan(0);
});

test('390px navigation, demo, and footer touch targets are at least 44px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  const sizes = await page.locator('.topbar a, .demo-bar button, .footer a').evaluateAll(elements => elements.map(element => {
    const box = element.getBoundingClientRect();
    return { label: element.textContent?.trim(), width: box.width, height: box.height };
  }));
  expect(sizes.length).toBeGreaterThan(0);
  for (const size of sizes) {
    expect.soft(size.width, `${size.label} width`).toBeGreaterThanOrEqual(44);
    expect.soft(size.height, `${size.label} height`).toBeGreaterThanOrEqual(44);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test('built deployment policy ships CSP, immutable hashed assets, and a real 404 override', async ({ page, request }) => {
  const response = await request.get('/staticwebapp.config.json');
  expect(response.ok()).toBeTruthy();
  const policy = await response.json() as {
    routes: { route: string; rewrite?: string; headers?: Record<string, string> }[];
    navigationFallback?: unknown;
    responseOverrides: Record<string, { rewrite: string }>;
    globalHeaders: Record<string, string>;
  };
  expect(policy.navigationFallback).toBeUndefined();
  expect(policy.responseOverrides['404'].rewrite).toBe('/404.html');
  expect(policy.globalHeaders['Content-Security-Policy']).toContain("default-src 'self'");
  expect(policy.routes.find(route => route.route === '/assets/*')?.headers?.['Cache-Control']).toContain('immutable');
  for (const route of ['/practice', '/demo', '/privacy', '/terms']) expect(policy.routes.find(item => item.route === route)?.rewrite).toBe('/index.html');
  await page.goto('/');
  const assetUrls = await page.locator('script[src], link[rel="stylesheet"]').evaluateAll(elements => elements.map(element => element.getAttribute('src') || element.getAttribute('href')));
  expect(assetUrls.filter(Boolean).every(url => /\/assets\/[^/]+-[A-Za-z0-9_-]+\.(js|css)$/.test(url!))).toBeTruthy();
});
