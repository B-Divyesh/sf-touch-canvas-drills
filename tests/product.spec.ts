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

test('every product route and the update notice have no serious or critical axe violations', async ({ page }) => {
  for (const route of ['/', '/demo', '/practice', '/privacy', '/terms']) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter(v => ['serious', 'critical'].includes(v.impact || '')), route).toEqual([]);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
  }
  await page.goto('/');
  await page.locator('#app-updates').evaluate(region => {
    region.innerHTML = '<div class="update-toast"><span>A newer drill tape is ready.</span><button>Update app</button></div>';
  });
  const updateResults = await new AxeBuilder({ page }).analyze();
  expect(updateResults.violations.find(violation => violation.id === 'region')).toBeUndefined();
});

test('@claim:twenty-drills demo loads all 20 guided drills', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'Make one steadier mark' })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://touch-canvas-drills.sociobot.in/demo');
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

test('@claim:pwa-install app shell provides an installable manifest and service worker', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(async () => Boolean(await navigator.serviceWorker.ready));
  const manifest = await page.evaluate(async () => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
    if (!link) return null;
    return fetch(link.href).then(response => response.json());
  }) as { display?: string; start_url?: string; icons?: { sizes: string; purpose?: string }[] } | null;
  expect(manifest?.display).toBe('standalone');
  expect(manifest?.start_url).toMatch(/^\/\?v=/);
  expect(manifest?.icons?.some(icon => icon.sizes === '192x192' && icon.purpose?.includes('maskable'))).toBe(true);
  expect(manifest?.icons?.some(icon => icon.sizes === '512x512' && icon.purpose?.includes('maskable'))).toBe(true);
  expect(await page.evaluate(() => navigator.serviceWorker.getRegistrations().then(items => items.length))).toBeGreaterThan(0);
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
  const verification = page.waitForResponse(item => item.url().includes('/verify?license='));
  await page.goto('/practice?license=fixture-license');
  await verification;
  await expect(page).toHaveURL(/\/practice$/);
  await expect(page.locator('#note')).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Print practice week' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('sb_license:touch-canvas-drills'))).toBe('fixture-license');
  await page.evaluate(() => { window.print = () => { document.body.dataset.printed = 'true'; }; });
  await page.getByRole('button', { name: 'Print practice week' }).click();
  await expect(page.locator('body')).toHaveAttribute('data-printed', 'true');
});

test('@claim:checkout-redirect live Sociobot checkout redirects to Dodo Live', async ({ request }) => {
  const response = await request.get('https://api.sociobot.in/api/v1/products/touch-canvas-drills/checkout', { maxRedirects: 0 });
  expect(response.status()).toBe(303);
  const location = new URL(response.headers().location);
  expect(location.protocol).toBe('https:');
  expect(location.hostname).toBe('checkout.dodopayments.com');
  expect(location.pathname).toMatch(/^\/session\/cks_/);
});

test('@claim:invalid-license-lock invalid returned license locks all paid controls as soon as verification rejects it', async ({ page }) => {
  await page.route('https://api.sociobot.in/**', async route => {
    await new Promise(resolve => setTimeout(resolve, 100));
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"valid":false,"reason":"invalid","expires_at":null}' });
  });
  const response = page.waitForResponse(item => item.url().includes('/verify?license='));
  await page.goto('/practice?license=definitely-invalid-regression');
  await expect(page).toHaveURL(/\/practice$/);
  await expect(page.locator('#note')).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Save note' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Print practice week' })).toHaveCount(0);
  await response;
  await expect(page.getByText('License no longer active. Free drills still work.')).toBeVisible();
  await expect(page.locator('#note')).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Save note' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Print practice week' })).toHaveCount(0);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('touch-canvas-drills:data') || '{}').licenseValid)).toBe(false);
});

test('@claim:license-daily-check cached licenses are checked at most once each day', async ({ page }) => {
  let checks = 0;
  await page.route('https://api.sociobot.in/**', route => {
    checks++;
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"valid":true,"reason":"ok"}' });
  });
  await page.goto('/practice');
  await page.evaluate(() => {
    localStorage.setItem('sb_license:touch-canvas-drills', 'cached-license');
    localStorage.setItem('touch-canvas-drills:data', JSON.stringify({
      sessions: [], leftHanded: false, notes: {}, license: 'cached-license',
      licenseValid: true, licenseChecked: Date.now(),
    }));
  });
  await page.reload();
  await expect(page.getByRole('button', { name: 'Print practice week' })).toBeVisible();
  await page.waitForTimeout(200);
  expect(checks).toBe(0);
  await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('touch-canvas-drills:data') || '{}');
    saved.licenseChecked = Date.now() - 86_400_001;
    localStorage.setItem('touch-canvas-drills:data', JSON.stringify(saved));
  });
  const verification = page.waitForResponse(item => item.url().includes('/verify?license='));
  await page.reload();
  await verification;
  expect(checks).toBe(1);
  await page.reload();
  await page.waitForTimeout(200);
  expect(checks).toBe(1);
});

test('@claim:pressure-independent pointer pressure does not change the saved mark width', async ({ page }) => {
  await page.goto('/practice');
  await page.locator('canvas').evaluate((canvas: HTMLCanvasElement) => {
    canvas.setPointerCapture = () => undefined;
    const rect = canvas.getBoundingClientRect();
    const fire = (type: string, x: number, y: number, pressure: number, pointerId: number) => {
      canvas.dispatchEvent(new PointerEvent(type, {
        bubbles: true, pointerId, pointerType: 'pen', pressure,
        clientX: rect.left + x, clientY: rect.top + y,
      }));
    };
    fire('pointerdown', 50, 60, 0.1, 1);
    fire('pointermove', 100, 90, 0.1, 1);
    fire('pointerup', 100, 90, 0.1, 1);
    fire('pointerdown', 130, 120, 0.9, 2);
    fire('pointermove', 180, 150, 0.9, 2);
    fire('pointerup', 180, 150, 0.9, 2);
  });
  await page.getByRole('button', { name: 'Save this drill' }).click();
  const widths = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('touch-canvas-drills:data') || '{}');
    return saved.sessions[0].strokes.map((stroke: { width: number }) => stroke.width);
  });
  expect(widths).toEqual([8, 8]);
});

test('@claim:first-mark-timer timer stays ready until the first mark', async ({ page }) => {
  await page.goto('/practice');
  const clock = page.getByLabel('Seconds remaining');
  await expect(clock).toHaveText('00:20');
  await page.waitForTimeout(1100);
  await expect(clock).toHaveText('00:20');
  await page.locator('canvas').evaluate((canvas: HTMLCanvasElement) => {
    canvas.setPointerCapture = () => undefined;
    const rect = canvas.getBoundingClientRect();
    canvas.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true, pointerId: 1, pointerType: 'pen', pressure: 0.5,
      clientX: rect.left + 50, clientY: rect.top + 50,
    }));
  });
  await expect.poll(async () => Number((await clock.textContent())?.slice(-2)), { timeout: 5000 }).toBeLessThan(20);
});

test('Clear marks restores empty controls and announces the reset', async ({ page }) => {
  await page.goto('/practice');
  await drawPointerStroke(page);
  await expect(page.getByRole('button', { name: 'Replay marks' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Save this drill' })).toBeEnabled();
  await page.getByRole('button', { name: 'Clear marks' }).click();
  await expect(page.getByRole('button', { name: 'Replay marks' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Save this drill' })).toBeDisabled();
  await expect(page.locator('.status')).toHaveText('Marks cleared. Try the guide again.');
});

test('reduced-motion replay gives visible live-region feedback', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/practice');
  await drawPointerStroke(page);
  await page.getByRole('button', { name: 'Replay marks' }).click();
  await expect(page.locator('.status')).toHaveText('Replay shown without motion.');
  await expect(page.locator('.status')).toHaveAttribute('aria-live', 'polite');
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
