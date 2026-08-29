import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile, writeFile } from 'node:fs/promises';

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

test('every product route, direct 404, and update notice have no serious or critical axe violations', async ({ page }) => {
  for (const route of ['/', '/?demo=1', '/demo', '/practice', '/privacy', '/terms', '/404.html']) {
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

test('routes set complete metadata and history navigation restores heading focus', async ({ page }) => {
  const routes = [
    { path: '/', title: 'Touch Canvas Drills — Practice touch drawing', canonical: '/' },
    { path: '/?demo=1', title: 'Demo — Touch Canvas Drills', canonical: '/demo' },
    { path: '/demo', title: 'Demo — Touch Canvas Drills', canonical: '/demo' },
    { path: '/practice', title: 'Practice — Touch Canvas Drills', canonical: '/practice' },
    { path: '/privacy', title: 'Privacy — Touch Canvas Drills', canonical: '/privacy' },
    { path: '/terms', title: 'Terms — Touch Canvas Drills', canonical: '/terms' },
  ];
  for (const route of routes) {
    await page.goto(route.path);
    await expect(page).toHaveTitle(route.title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://touch-canvas-drills.sociobot.in${route.canonical}`);
    for (const selector of ['meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[property="og:image"]', 'meta[property="og:url"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]', 'meta[name="twitter:image"]']) {
      await expect(page.locator(selector), `${route.path} ${selector}`).toHaveAttribute('content', /\S/);
    }
  }

  await page.goto('/');
  await page.getByRole('link', { name: 'Practice', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#route-updates')).toHaveText('Make one steadier mark');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#route-updates')).toHaveText('Practice touch drawing with short drills');
});

test('landing copy is literal and the sample action enters the isolated query demo in one click', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'How the drills work' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Your practice data stays in this browser' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Optional notes and printable practice sheet' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try the Rail lines sample' })).toHaveAttribute('href', '/?demo=1');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Rail lines' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Replay saved marks' })).toHaveCount(2);
  expect(await page.evaluate(() => localStorage.getItem('touch-canvas-drills:data'))).toBeNull();
});

test('static 404 has the shared shell, plain recovery copy, and complete metadata', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page).toHaveTitle('Page not found — Touch Canvas Drills');
  await expect(page.getByText('PAGE NOT FOUND')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'This page does not exist.' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link')).toHaveCount(3);
  await expect(page.getByRole('contentinfo')).toContainText('Small touch drills for steadier drawing.');
  await expect(page.getByRole('contentinfo')).toContainText('Built by Param Factory · v1.0.4');
  await expect(page.getByRole('link', { name: 'Back to the drills' })).toHaveAttribute('href', '/');
  for (const selector of ['meta[name="description"]', 'link[rel="canonical"]', 'link[rel="manifest"]', 'link[rel="icon"]', 'link[rel="apple-touch-icon"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[property="og:image"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]', 'meta[name="twitter:image"]']) {
    await expect(page.locator(selector), selector).toHaveCount(1);
  }
});

test('@claim:twenty-drills demo loads all 20 guided drills', async ({ page }) => {
  await page.goto('/?demo=1');
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
  await page.goto('/?demo=1');
  await expect.poll(async () => demoRecord(page)).not.toBeNull();
  const samples = await page.evaluate(() => JSON.parse(localStorage.getItem('demo:touch-canvas-drills:data') || '{}').sessions as { strokes: unknown[] }[]);
  expect(samples).toHaveLength(2);
  expect(samples.every(sample => sample.strokes.length > 0)).toBe(true);
  await expect(page.getByRole('button', { name: 'Replay saved marks' })).toHaveCount(2);
  await page.getByRole('button', { name: 'Replay saved marks' }).first().click();
  await expect(page.getByText(/Loaded saved Rail lines marks|Replay finished/)).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('heading', { name: 'Rail lines' })).toBeVisible();
  await drawPointerStroke(page);
  await page.getByRole('button', { name: 'Save this drill' }).click();
  await expect(page.getByText('3 saved drills on this device.')).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('2 saved drills on this device.')).toBeVisible();
  await expect.poll(async () => (await demoRecord(page) as { sessions?: unknown[] } | null)?.sessions?.length).toBe(2);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/practice$/);
  await expect(page.getByRole('button', { name: 'Save this drill' })).toBeDisabled();
  expect(await page.evaluate(() => localStorage.getItem('demo:touch-canvas-drills:data'))).toBeNull();
  expect(await demoRecord(page)).toBeNull();
  await page.goto('/?demo=1');
  await expect.poll(async () => demoRecord(page)).not.toBeNull();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Privacy' }).click();
  await expect(page).toHaveURL(/\/privacy$/);
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
  const points = await page.evaluate(() => JSON.parse(localStorage.getItem('touch-canvas-drills:data') || '{}').sessions[0].strokes[0].points as { x: number; y: number }[]);
  expect(points[1].x - points[0].x).toBe(12);
  expect(points[2].y - points[1].y).toBe(32);
  await canvas.focus();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Save this drill' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Replay marks' })).toBeDisabled();
  await expect(page.locator('.status')).toHaveText('Marks cleared. Keyboard pen is at the center.');
});

test('@claim:handed-layout left-handed mode rearranges and persists the phone controls', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/practice');
  const beforeDeck = await page.locator('.deck').boundingBox();
  const beforeList = await page.locator('.drill-list').boundingBox();
  expect(beforeDeck).not.toBeNull();
  expect(beforeList).not.toBeNull();
  expect(beforeDeck!.y).toBeLessThan(beforeList!.y);
  await page.getByRole('button', { name: 'Right-handed layout' }).click();
  const afterDeck = await page.locator('.deck').boundingBox();
  const afterList = await page.locator('.drill-list').boundingBox();
  expect(afterList!.y).toBeLessThan(afterDeck!.y);
  expect(afterDeck!.y).not.toBe(beforeDeck!.y);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Left-handed layout' })).toHaveAttribute('aria-pressed', 'true');
  expect((await page.locator('.drill-list').boundingBox())!.y).toBeLessThan((await page.locator('.deck').boundingBox())!.y);
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
  expect((exported as { license?: string }).license).toBeUndefined();
});

test('@claim:progress-roundtrip validated JSON import restores progress without deleting existing data', async ({ page }, testInfo) => {
  await page.goto('/practice');
  await drawPointerStroke(page);
  await page.getByRole('button', { name: 'Save this drill' }).click();
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export progress JSON' }).click();
  const download = await pending;
  const target = testInfo.outputPath('roundtrip-progress.json');
  await download.saveAs(target);
  await page.evaluate(() => localStorage.removeItem('touch-canvas-drills:data'));
  await page.reload();
  await expect(page.getByText('No saved drills yet. Save one after you draw.')).toBeVisible();
  await page.locator('#progress-import').setInputFiles(target);
  await expect(page.getByText('Imported 1 saved drill. Existing progress was kept.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Replay saved marks' })).toHaveCount(1);
  await page.locator('#progress-import').setInputFiles({
    name: 'unsafe.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"sessions":[{"id":"bad","drillId":"not-a-drill"}]}'),
  });
  await expect(page.getByText('Session 1 has invalid progress data.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Replay saved marks' })).toHaveCount(1);
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
  const terms = await request.get('/terms');
  expect(await terms.text()).toContain('<div id="app"></div>');
  const response = await request.get('https://api.sociobot.in/api/v1/products/touch-canvas-drills/checkout', { maxRedirects: 0 });
  expect(response.status()).toBe(303);
  const location = new URL(response.headers().location);
  expect(location.protocol).toBe('https:');
  expect(location.hostname).toBe('checkout.dodopayments.com');
  expect(location.pathname).toMatch(/^\/session\/cks_/);
});

test('@claim:merchant-refunds terms identify Sociobot as merchant of record for refunds', async ({ page }) => {
  await page.goto('/terms');
  await expect(page.getByText('Checkout, refunds, and license revocation are handled by Sociobot, the merchant of record.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Privacy' }).first()).toHaveAttribute('href', '/privacy');
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

test('390px first screen shows the complete sample action and no false first-install update', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const action = page.getByRole('link', { name: 'Try it with sample data' });
  const box = await action.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(844);
  await page.waitForFunction(async () => Boolean((await navigator.serviceWorker.ready).active));
  await page.waitForTimeout(1200);
  await expect(page.locator('.update-toast')).toHaveCount(0);
  await expect(page.locator('#app-updates')).toHaveText('');
});

test('a genuine service-worker revision offers and applies an update', async ({ page }) => {
  const workerPath = 'dist/sw.js';
  const original = await readFile(workerPath, 'utf8');
  try {
    await page.goto('/');
    await page.waitForFunction(async () => {
      await navigator.serviceWorker.ready;
      return navigator.serviceWorker.controller !== null;
    });
    await page.reload();
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    await writeFile(workerPath, original.replace("touch-drills-v5", "touch-drills-v5-regression"));
    await page.evaluate(async () => (await navigator.serviceWorker.getRegistration())?.update());
    await expect(page.getByText('A newer drill tape is ready.')).toBeVisible({ timeout: 15_000 });
    await Promise.all([
      page.waitForEvent('load'),
      page.getByRole('button', { name: 'Update app' }).click(),
    ]);
    await page.waitForFunction(() => navigator.serviceWorker.controller?.scriptURL.endsWith('/sw.js'));
    await expect.poll(() => page.evaluate(() => caches.keys()), { timeout: 15_000 }).toContain('touch-drills-v5-regression');
  } finally {
    await writeFile(workerPath, original);
  }
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
