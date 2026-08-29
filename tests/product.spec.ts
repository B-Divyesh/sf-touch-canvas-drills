import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { execFileSync } from 'node:child_process';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const expectedDrills = [
  { title: 'Rail lines', kind: 'line', cue: 'Keep one steady lane.', seconds: 20 },
  { title: 'Ladder rungs', kind: 'line', cue: 'Cross each rail without rushing.', seconds: 20 },
  { title: 'Corner turns', kind: 'line', cue: 'Stop at each corner, then turn.', seconds: 25 },
  { title: 'Long pulls', kind: 'line', cue: 'Pull from shoulder to fingertip.', seconds: 20 },
  { title: 'Short dashes', kind: 'line', cue: 'Lift cleanly between marks.', seconds: 20 },
  { title: 'Fan out', kind: 'line', cue: 'Start every line from the same point.', seconds: 25 },
  { title: 'S curves', kind: 'curve', cue: 'Let the curve change direction once.', seconds: 25 },
  { title: 'C curves', kind: 'curve', cue: 'Match the open side.', seconds: 20 },
  { title: 'Wave train', kind: 'curve', cue: 'Keep the crests even.', seconds: 25 },
  { title: 'Spiral in', kind: 'curve', cue: 'Tighten slowly toward the center.', seconds: 30 },
  { title: 'Arc stack', kind: 'curve', cue: 'Nest each arc inside the last.', seconds: 25 },
  { title: 'Loop chain', kind: 'curve', cue: 'Meet each loop at one point.', seconds: 25 },
  { title: 'Square loop', kind: 'shape', cue: 'Trace the corners with one pause.', seconds: 20 },
  { title: 'Circle stack', kind: 'shape', cue: 'Close each circle without a bump.', seconds: 25 },
  { title: 'Triangle trio', kind: 'shape', cue: 'Aim each point at the guide.', seconds: 20 },
  { title: 'Oval orbit', kind: 'shape', cue: 'Keep the oval breathing evenly.', seconds: 25 },
  { title: 'Diamond grid', kind: 'shape', cue: 'Cross through the same corners.', seconds: 25 },
  { title: 'Box turn', kind: 'shape', cue: 'Keep opposite sides parallel.', seconds: 20 },
  { title: 'Leaf pair', kind: 'shape', cue: 'Meet the tips, then lift.', seconds: 20 },
  { title: 'Target rings', kind: 'shape', cue: 'Keep each ring centered.', seconds: 30 },
] as const;

async function drawPointerStroke(page: Page) {
  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();
  if (!box) throw new Error('drawing canvas is not visible');
  await page.mouse.move(box.x + 70, box.y + 80);
  await page.mouse.down();
  await page.mouse.move(box.x + 220, box.y + 150, { steps: 5 });
  await page.mouse.up();
}

async function drawSyntheticStroke(page: Page) {
  await page.locator('canvas').evaluate((canvas: HTMLCanvasElement) => {
    canvas.setPointerCapture = () => undefined;
    const rect = canvas.getBoundingClientRect();
    const fire = (type: string, x: number, y: number) => canvas.dispatchEvent(new PointerEvent(type, {
      bubbles: true,
      pointerId: 41,
      pointerType: 'pen',
      pressure: 0.5,
      clientX: rect.left + rect.width * x,
      clientY: rect.top + rect.height * y,
    }));
    fire('pointerdown', 0.2, 0.25);
    fire('pointermove', 0.45, 0.5);
    fire('pointerup', 0.45, 0.5);
  });
}

async function canvasColorPixels(page: Page, color: [number, number, number]) {
  return page.locator('canvas').evaluate((canvas: HTMLCanvasElement, expected) => {
    const pixels = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height).data;
    let count = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      if (
        Math.abs(pixels[index] - expected[0]) < 12 &&
        Math.abs(pixels[index + 1] - expected[1]) < 12 &&
        Math.abs(pixels[index + 2] - expected[2]) < 12 &&
        pixels[index + 3] > 0
      ) count++;
    }
    return count;
  }, color);
}

async function inspectPng(page: Page, path: string) {
  const bytes = await readFile(path);
  expect([...bytes.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  return page.evaluate(async encoded => {
    const binary = atob(encoded);
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    const image = await createImageBitmap(new Blob([bytes], { type: 'image/png' }));
    const output = new OffscreenCanvas(image.width, image.height);
    const context = output.getContext('2d')!;
    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, image.width, image.height).data;
    let coralPixels = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index] === 189 && pixels[index + 1] === 61 && pixels[index + 2] === 53 && pixels[index + 3] > 0) coralPixels++;
    }
    image.close();
    return { width: output.width, height: output.height, coralPixels };
  }, bytes.toString('base64'));
}

type PracticeRecord = {
  sessions: { id: string; drillId: string; date: string; seconds: number; strokes: { color: string; width: number; points: { x: number; y: number; t: number }[] }[] }[];
  leftHanded: boolean;
  notes: Record<string, string>;
};

async function writeRealPracticeRecord(page: Page, record: PracticeRecord) {
  return page.evaluate(async value => {
    const serialized = JSON.stringify(value);
    localStorage.setItem('touch-canvas-drills:data', serialized);
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('touch-canvas-drills', 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains('practice')) request.result.createObjectStore('practice');
      };
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const database = request.result;
        const transaction = database.transaction('practice', 'readwrite');
        transaction.objectStore('practice').put(value, 'touch-canvas-drills:data');
        transaction.oncomplete = () => {
          database.close();
          resolve();
        };
        transaction.onerror = () => reject(transaction.error);
      };
    });
    return serialized;
  }, record);
}

async function expectRealPracticeRecord(page: Page, serialized: string, record: PracticeRecord) {
  expect(await page.evaluate(() => localStorage.getItem('touch-canvas-drills:data'))).toBe(serialized);
  expect(await realPracticeRecord(page)).toEqual(record);
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

async function realPracticeRecord(page: Page) {
  return page.evaluate(() => new Promise<unknown>((resolve, reject) => {
    const request = indexedDB.open('touch-canvas-drills', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains('practice')) {
        database.close();
        resolve(null);
        return;
      }
      const transaction = database.transaction('practice', 'readonly');
      const get = transaction.objectStore('practice').get('touch-canvas-drills:data');
      get.onsuccess = () => {
        database.close();
        resolve(get.result ?? null);
      };
      get.onerror = () => {
        database.close();
        reject(get.error);
      };
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
  await expect(page.locator('#route-updates')).toHaveText('Draw one guided mark');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#route-updates')).toHaveText('Practice touch drawing with short drills');
});

test('landing copy is literal and the sample action enters the isolated query demo in one click', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'How the drills work' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Your practice data stays in this browser' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Optional notes and printable practice sheet' })).toBeVisible();
  await expect(page.getByText('LOCAL PRIVACY')).toBeVisible();
  await expect(page.getByText('Replay it, save the drill, and return tomorrow.')).toBeVisible();
  await expect(page.getByText('Your saved drills live in this browser.')).toBeVisible();
  await expect(page.getByText('Your marks stay on this device')).toBeVisible();
  await expect(page.getByText('All 20 drills are free; extras cost $6 once')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Draw until the timer ends' })).toBeVisible();
  for (const stale of ['PRIVATE BY DESIGN', 'save the session', 'Your sessions live', 'Your strokes stay on this device', 'Free core drills', 'Draw for one timer']) {
    await expect(page.getByText(stale, { exact: false })).toHaveCount(0);
  }
  await expect(page.getByRole('link', { name: 'Try the Rail lines sample' })).toHaveAttribute('href', '/?demo=1');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Rail lines' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Replay saved drill' })).toHaveCount(2);
  expect(await page.evaluate(() => localStorage.getItem('touch-canvas-drills:data'))).toBeNull();
});

test('README and catalog use the reviewed plain wording', async () => {
  const readme = await readFile('README.md', 'utf8');
  expect(readme).toContain('Exports and imports checked progress files for backup or a new device.');
  expect(readme).toContain('It is for people who draw on phones and tablets.');
  expect(readme).toContain('The demo keeps its sample work separate from your own practice.');
  expect(readme).toContain('All 20 drills and both exports are free. A $6 one-time Sociobot license adds\nprivate drill notes and a printable seven-day practice sheet.');
  expect(readme).toContain('Open `/?demo=1` to try sample data that\nnever changes your practice.');
  expect(readme).toContain('replays saved drills.');
  expect(readme).toContain('The build opens each page directly, includes a\nstyled 404 page, and applies browser security settings and safe file caching.');
  expect(readme).toContain('Paid checkout is configured outside this repository. The repository contains\nno credentials.');
  for (const stale of ['It is for Android phones and tablets.', 'validated progress JSON', 'localStorage and IndexedDB', 'free core practice', 'printable week sheet', 'no-save sandbox', 'The emitted `staticwebapp.config.json`', 'The factory registers the paid product']) {
    expect(readme).not.toContain(stale);
  }
  const catalog = (await readFile('.factory/catalog-description.txt', 'utf8')).trim();
  expect(catalog).toMatch(/^Practice\b/);
  expect(catalog.length).toBeLessThanOrEqual(120);
});

test('claims registry has one discoverable test tag for every claim', async () => {
  const claims = JSON.parse(await readFile('.factory/claims.json', 'utf8')) as { id: string; test: string }[];
  const source = await readFile('tests/product.spec.ts', 'utf8');
  expect(new Set(claims.map(claim => claim.id)).size).toBe(claims.length);
  for (const claim of claims) {
    expect(claim.test).toBe(`npm test -- --grep @claim:${claim.id}`);
    expect(source.match(new RegExp(`@claim:${claim.id}(?![a-z0-9-])`, 'g'))).toHaveLength(1);
  }
});

test('static 404 has the shared shell, plain recovery copy, and complete metadata', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page).toHaveTitle('Page not found — Touch Canvas Drills');
  await expect(page.getByText('PAGE NOT FOUND')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'This page does not exist.' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link')).toHaveCount(3);
  await expect(page.getByRole('contentinfo')).toContainText('Touch-drawing practice for phones and tablets.');
  await expect(page.getByRole('contentinfo')).toContainText('Built by Param Factory · v1.0.8');
  await expect(page.getByRole('link', { name: 'Back to the drills' })).toHaveAttribute('href', '/');
  for (const selector of ['meta[name="description"]', 'link[rel="canonical"]', 'link[rel="manifest"]', 'link[rel="icon"]', 'link[rel="apple-touch-icon"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[property="og:image"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]', 'meta[name="twitter:image"]']) {
    await expect(page.locator(selector), selector).toHaveCount(1);
  }
});

test('@claim:twenty-drills all 20 guided drills load their own working exercise', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page.getByRole('heading', { name: 'Draw one guided mark' })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://touch-canvas-drills.sociobot.in/demo');
  await expect(page.locator('[data-drill]')).toHaveCount(20);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();

  expect(new Set(expectedDrills.map(drill => drill.kind))).toEqual(new Set(['line', 'curve', 'shape']));
  for (const [index, drill] of expectedDrills.entries()) {
    await page.locator('[data-drill]').nth(index).click();
    await expect(page.locator('#drill-title')).toHaveText(drill.title);
    await expect(page.locator('.cue')).toHaveText(drill.cue);
    await expect(page.getByLabel('Seconds remaining')).toHaveText(`00:${drill.seconds}`);
    await expect(page.locator('.deck .tape-label')).toHaveText(`${drill.kind} / TIMER RUNS ON FIRST MARK`);
    await expect(page.getByRole('application', { name: `Drawing area for ${drill.title}` })).toBeVisible();
    expect(await canvasColorPixels(page, [139, 181, 201]), `${drill.title} guide pixels`).toBeGreaterThan(25);
    await drawSyntheticStroke(page);
    expect(await canvasColorPixels(page, [189, 61, 53]), `${drill.title} accepted mark pixels`).toBeGreaterThan(25);
    await expect(page.getByRole('button', { name: 'Save this drill' })).toBeEnabled();
  }
});

test('@claim:png-export exports a decodable 900 by 675 PNG containing the drawn mark', async ({ page }, testInfo) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Clear marks' }).click();
  await drawSyntheticStroke(page);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export PNG' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe('rail-lines.png');
  const target = testInfo.outputPath('rail-lines.png');
  await file.saveAs(target);
  const decoded = await inspectPng(page, target);
  expect(decoded.width).toBe(900);
  expect(decoded.height).toBe(675);
  expect(decoded.coralPixels).toBeGreaterThan(100);
});

test('@claim:privacy-local full demo flow sends no artwork or analytics request to any origin', async ({ page }) => {
  const requests: { url: string; method: string; resourceType: string; body: string | null }[] = [];
  page.on('request', request => requests.push({
    url: request.url(),
    method: request.method(),
    resourceType: request.resourceType(),
    body: request.postData(),
  }));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Clear marks' }).click();
  await drawSyntheticStroke(page);
  await page.getByRole('button', { name: 'Save this drill' }).click();
  const pngDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export PNG' }).click();
  await pngDownload;
  const jsonDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export progress JSON' }).click();
  await jsonDownload;
  await page.getByRole('button', { name: 'Reset demo' }).click();
  const productOrigin = new URL(page.url()).origin;
  const foreign = requests.filter(request => new URL(request.url).origin !== productOrigin);
  expect(foreign).toEqual([]);
  expect(requests.length).toBeGreaterThan(0);
  expect(requests.every(request => ['GET', 'HEAD'].includes(request.method))).toBe(true);
  expect(requests.filter(request => request.body !== null)).toEqual([]);
  expect(requests.some(request => request.resourceType === 'script')).toBe(true);
  expect(JSON.stringify(requests)).not.toContain('"points"');
  expect(JSON.stringify(requests)).not.toContain('#bd3d35');
});

test('@claim:clear-browser-data clearing browser data removes local practice data from both stores', async ({ page, context }) => {
  await page.goto('/practice');
  await drawPointerStroke(page);
  await page.getByRole('button', { name: 'Save this drill' }).click();
  await expect(page.getByText('1 saved drill on this device.')).toBeVisible();
  await expect.poll(async () => {
    const saved = await realPracticeRecord(page) as { sessions?: unknown[] } | null;
    return saved?.sessions?.length || 0;
  }).toBe(1);

  const protocol = await context.newCDPSession(page);
  await protocol.send('Storage.clearDataForOrigin', {
    origin: new URL(page.url()).origin,
    storageTypes: 'all',
  });
  await protocol.detach();

  await page.reload();
  expect(await page.evaluate(() => localStorage.getItem('touch-canvas-drills:data'))).toBeNull();
  expect(await realPracticeRecord(page)).toBeNull();
  await expect(page.getByText('No saved drills yet. Save one after you draw.')).toBeVisible();
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
  await expect(page.getByRole('heading', { name: 'Draw one guided mark' })).toBeVisible();
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

test('@claim:demo-isolation demo preserves an existing real record through entry, work, reset, navigation, and exit', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const realSentinel: PracticeRecord = {
    sessions: [{
      id: 'real-sentinel-drill',
      drillId: 'leaf-pair',
      date: '2026-08-20T12:00:00.000Z',
      seconds: 11,
      strokes: [{ color: '#123456', width: 8, points: [{ x: 111, y: 222, t: 0 }, { x: 333, y: 444, t: 500 }] }],
    }],
    leftHanded: true,
    notes: { 'rail-lines': 'REAL NOTE — never replace this with sample work.' },
  };
  const serializedRealSentinel = await writeRealPracticeRecord(page, realSentinel);
  await expectRealPracticeRecord(page, serializedRealSentinel, realSentinel);
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expectRealPracticeRecord(page, serializedRealSentinel, realSentinel);
  const canvas = page.locator('canvas');
  const visibleCanvas = await canvas.boundingBox();
  expect(visibleCanvas).not.toBeNull();
  expect(visibleCanvas!.y).toBeLessThan(844);
  const coralPixels = await canvas.evaluate((element: HTMLCanvasElement) => {
    const pixels = element.getContext('2d')!.getImageData(0, 0, element.width, element.height).data;
    let count = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index] === 189 && pixels[index + 1] === 61 && pixels[index + 2] === 53 && pixels[index + 3] > 0) count++;
    }
    return count;
  });
  expect(coralPixels).toBeGreaterThan(2_000);
  await expect(page.getByRole('button', { name: 'Replay sample marks' })).toBeEnabled();
  await expect.poll(async () => demoRecord(page)).not.toBeNull();
  const samples = await page.evaluate(() => JSON.parse(localStorage.getItem('demo:touch-canvas-drills:data') || '{}').sessions as { strokes: unknown[] }[]);
  expect(samples).toHaveLength(2);
  expect(samples.every(sample => sample.strokes.length > 0)).toBe(true);
  await expect(page.getByRole('button', { name: 'Replay saved drill' })).toHaveCount(2);
  await page.getByRole('button', { name: 'Replay saved drill' }).first().click();
  await expect(page.getByText(/Loaded saved drill: Rail lines|Replay finished/)).toBeVisible();
  await drawPointerStroke(page);
  await page.getByRole('button', { name: 'Save this drill' }).click();
  await expect(page.getByText('3 saved drills on this device.')).toBeVisible();
  await expectRealPracticeRecord(page, serializedRealSentinel, realSentinel);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('heading', { name: 'Rail lines' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Replay sample marks' })).toBeEnabled();
  expect(await canvas.evaluate((element: HTMLCanvasElement) => {
    const pixels = element.getContext('2d')!.getImageData(0, 0, element.width, element.height).data;
    let count = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index] === 189 && pixels[index + 1] === 61 && pixels[index + 2] === 53 && pixels[index + 3] > 0) count++;
    }
    return count;
  })).toBeGreaterThan(2_000);
  await expect(page.getByText('2 saved drills on this device.')).toBeVisible();
  await expect.poll(async () => (await demoRecord(page) as { sessions?: unknown[] } | null)?.sessions?.length).toBe(2);
  await expectRealPracticeRecord(page, serializedRealSentinel, realSentinel);
  await page.getByRole('button', { name: /07 S curves/ }).click();
  await expect(page.getByRole('heading', { name: 'S curves' })).toBeVisible();
  await expectRealPracticeRecord(page, serializedRealSentinel, realSentinel);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/practice$/);
  await expect(page.getByRole('button', { name: 'Save this drill' })).toBeDisabled();
  await expect(page.getByText('1 saved drill on this device.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Left-handed layout' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#note')).toHaveValue(realSentinel.notes['rail-lines']);
  await expectRealPracticeRecord(page, serializedRealSentinel, realSentinel);
  expect(await page.evaluate(() => localStorage.getItem('demo:touch-canvas-drills:data'))).toBeNull();
  expect(await demoRecord(page)).toBeNull();
  await page.goto('/?demo=1');
  await expect.poll(async () => demoRecord(page)).not.toBeNull();
  await expect(page.getByRole('button', { name: 'Replay sample marks' })).toBeEnabled();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Privacy' }).click();
  await expect(page).toHaveURL(/\/privacy$/);
  expect(await page.evaluate(() => localStorage.getItem('demo:touch-canvas-drills:data'))).toBeNull();
  expect(await demoRecord(page)).toBeNull();
  await expectRealPracticeRecord(page, serializedRealSentinel, realSentinel);
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

test('@claim:saved-replay saved drills can be replayed after refresh', async ({ page }) => {
  await page.goto('/practice');
  await drawPointerStroke(page);
  await page.getByRole('button', { name: 'Save this drill' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Replay saved drill' }).click();
  await expect(page.getByText(/Loaded saved drill: Rail lines|Replay finished/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Replay marks' })).toBeEnabled();
});

test('@claim:local-progress calendar shows exactly seven consecutive days and JSON keeps all progress', async ({ page }, testInfo) => {
  await page.goto('/practice');
  const seededDates = await page.evaluate(() => {
    const date = (daysAgo: number) => {
      const value = new Date();
      value.setHours(12, 0, 0, 0);
      value.setDate(value.getDate() - daysAgo);
      return value;
    };
    const dateKey = (value: Date) => [
      value.getFullYear(),
      String(value.getMonth() + 1).padStart(2, '0'),
      String(value.getDate()).padStart(2, '0'),
    ].join('-');
    const point = { x: 100, y: 100, t: 0 };
    const sessions = [0, 6, 8].map(daysAgo => ({
      id: `progress-${daysAgo}`,
      drillId: 'rail-lines',
      date: date(daysAgo).toISOString(),
      seconds: 5,
      strokes: [{ color: '#bd3d35', width: 8, points: [point, { ...point, x: 140, t: 200 }] }],
    }));
    localStorage.setItem('touch-canvas-drills:data', JSON.stringify({ sessions, leftHanded: false, notes: {} }));
    return { today: dateKey(date(0)), sixDaysAgo: dateKey(date(6)), eightDaysAgo: dateKey(date(8)) };
  });
  await page.reload();
  const visibleDays = await page.locator('.day').evaluateAll(elements => elements.map(element => ({
    date: element.getAttribute('data-date'),
    count: Number(element.getAttribute('data-count')),
    label: element.getAttribute('aria-label'),
  })));
  expect(visibleDays).toHaveLength(7);
  expect(visibleDays.map(day => day.date)).toEqual([...visibleDays].map(day => day.date).sort());
  for (let index = 1; index < visibleDays.length; index++) {
    const previous = Date.parse(`${visibleDays[index - 1].date}T12:00:00Z`);
    const current = Date.parse(`${visibleDays[index].date}T12:00:00Z`);
    expect(current - previous).toBe(86_400_000);
  }
  expect(visibleDays.find(day => day.date === seededDates.today)?.count).toBe(1);
  expect(visibleDays.find(day => day.date === seededDates.sixDaysAgo)?.count).toBe(1);
  expect(visibleDays.some(day => day.date === seededDates.eightDaysAgo)).toBe(false);
  expect(visibleDays.every(day => day.label?.includes('saved drill'))).toBe(true);
  await expect(page.getByText('3 saved drills on this device.')).toBeVisible();
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export progress JSON' }).click();
  const download = await pending;
  const target = testInfo.outputPath('progress.json');
  await download.saveAs(target);
  const exported = JSON.parse(await readFile(target, 'utf8')) as { sessions: { drillId: string; date: string }[] };
  expect(exported.sessions).toHaveLength(3);
  expect(exported.sessions.every(session => session.drillId === 'rail-lines')).toBe(true);
  expect(exported.sessions.some(session => session.date.startsWith(seededDates.eightDaysAgo))).toBe(true);
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
  await expect(page.getByRole('button', { name: 'Replay saved drill' })).toHaveCount(1);
  await page.locator('#progress-import').setInputFiles({
    name: 'unsafe.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"sessions":[{"id":"bad","drillId":"not-a-drill"}]}'),
  });
  await expect(page.getByText('Session 1 has invalid progress data.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Replay saved drill' })).toHaveCount(1);
});

test('@claim:free-core an unlicensed visitor completes a later drill, replay, PNG, and JSON export', async ({ page }, testInfo) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/practice');
  expect(await page.evaluate(() => localStorage.getItem('sb_license:touch-canvas-drills'))).toBeNull();
  await expect(page.locator('#note')).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Print practice week' })).toHaveCount(0);
  await expect(page.locator('[data-drill]')).toHaveCount(20);
  await page.getByRole('button', { name: /20 Target rings/ }).click();
  await expect(page.locator('#drill-title')).toHaveText('Target rings');
  await drawSyntheticStroke(page);
  await page.getByRole('button', { name: 'Save this drill' }).click();
  await expect(page.getByText('1 saved drill on this device.')).toBeVisible();
  await page.getByRole('button', { name: 'Replay saved drill' }).click();
  await expect(page.getByText(/Loaded saved drill: Target rings|Replay finished/)).toBeVisible();

  const pngPending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export PNG' }).click();
  const png = await pngPending;
  expect(png.suggestedFilename()).toBe('target-rings.png');
  const pngPath = testInfo.outputPath('free-target-rings.png');
  await png.saveAs(pngPath);
  const decoded = await inspectPng(page, pngPath);
  expect(decoded).toMatchObject({ width: 900, height: 675 });
  expect(decoded.coralPixels).toBeGreaterThan(100);

  const jsonPending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export progress JSON' }).click();
  const json = await jsonPending;
  const jsonPath = testInfo.outputPath('free-progress.json');
  await json.saveAs(jsonPath);
  const progress = JSON.parse(await readFile(jsonPath, 'utf8')) as { sessions: { drillId: string }[]; license?: string };
  expect(progress.sessions).toHaveLength(1);
  expect(progress.sessions[0].drillId).toBe('target-rings');
  expect(progress.license).toBeUndefined();
  expect(requests.filter(url => /\/checkout|\/verify\?license=/.test(url))).toEqual([]);
  await expect(page.locator('#note')).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Print practice week' })).toHaveCount(0);
});

test('@claim:paid-extras authoritative $6 one-time checkout adds persistent local notes and a seven-day print sheet', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.getByText('$6', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Buy the extras' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/touch-canvas-drills/checkout');
  const checkout = await request.get('https://api.sociobot.in/api/v1/products/touch-canvas-drills/checkout', { maxRedirects: 0 });
  expect(checkout.status()).toBe(303);
  const checkoutLocation = checkout.headers().location;
  if (!checkoutLocation) throw new Error('Sociobot checkout did not provide a hosted checkout location');
  const hostedCheckout = await request.get(checkoutLocation);
  expect(hostedCheckout.ok()).toBe(true);
  const normalizedCheckout = (await hostedCheckout.text()).replace(/\\"/g, '"');
  const productStart = normalizedCheckout.indexOf('"name":"Touch Canvas Drills"');
  expect(productStart).toBeGreaterThan(-1);
  const productMetadata = normalizedCheckout.slice(productStart, productStart + 2_000);
  expect(productMetadata).toContain('"is_recurring":false');
  expect(productMetadata).toContain('"price":{"type":"one_time_price","price":600,"currency":"USD"');

  const verificationRequests: { method: string; body: string | null }[] = [];
  page.on('request', item => {
    if (item.url().includes('/verify?license=')) verificationRequests.push({ method: item.method(), body: item.postData() });
  });
  await page.route('https://api.sociobot.in/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{"valid":true,"reason":"ok"}' }));
  const verification = page.waitForResponse(item => item.url().includes('/verify?license='));
  await page.goto('/practice?license=fixture-license');
  await verification;
  await expect(page).toHaveURL(/\/practice$/);
  await expect(page.locator('#note')).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Print practice week' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('sb_license:touch-canvas-drills'))).toBe('fixture-license');
  const uniqueNote = 'Keep the second rail level with the blue guide.';
  await page.locator('#note').fill(uniqueNote);
  await page.getByRole('button', { name: 'Save note' }).click();
  await expect(page.locator('.status')).toHaveText('Note saved on this device.');
  await expect.poll(async () => (await realPracticeRecord(page) as { notes?: Record<string, string> } | null)?.notes?.['rail-lines']).toBe(uniqueNote);
  expect(await page.evaluate(() => localStorage.getItem('demo:touch-canvas-drills:data'))).toBeNull();
  await page.reload();
  await expect(page.locator('#note')).toHaveValue(uniqueNote);
  expect(verificationRequests).toEqual([{ method: 'GET', body: null }]);

  await page.evaluate(() => {
    const data = JSON.parse(localStorage.getItem('touch-canvas-drills:data') || '{}');
    const date = (daysAgo: number) => {
      const value = new Date();
      value.setHours(12, 0, 0, 0);
      value.setDate(value.getDate() - daysAgo);
      return value.toISOString();
    };
    const stroke = { color: '#bd3d35', width: 8, points: [{ x: 100, y: 100, t: 0 }, { x: 180, y: 140, t: 200 }] };
    data.sessions = [0, 3, 6, 8].map(daysAgo => ({ id: `paid-${daysAgo}`, drillId: 'rail-lines', date: date(daysAgo), seconds: 5, strokes: [stroke] }));
    localStorage.setItem('touch-canvas-drills:data', JSON.stringify(data));
  });
  await page.reload();
  await expect(page.locator('#note')).toHaveValue(uniqueNote);
  await expect(page.locator('.day')).toHaveCount(7);
  await expect(page.locator('.day.done')).toHaveCount(3);
  await page.emulateMedia({ media: 'print' });
  await expect(page.getByRole('heading', { name: 'Last seven days' })).toBeVisible();
  await expect(page.locator('.calendar .day:visible')).toHaveCount(7);
  await expect(page.locator('.settings')).toBeHidden();
  await page.emulateMedia({ media: 'screen' });
  await page.evaluate(() => { window.print = () => { document.body.dataset.printed = 'true'; }; });
  await page.getByRole('button', { name: 'Print practice week' }).click();
  await expect(page.locator('body')).toHaveAttribute('data-printed', 'true');
});

test("@claim:checkout-redirect payment opens Sociobot's hosted Dodo checkout", async ({ page, request }) => {
  await page.goto('/terms');
  await expect(page.getByText("Payment opens Sociobot's hosted checkout.")).toBeVisible();
  const response = await request.get('https://api.sociobot.in/api/v1/products/touch-canvas-drills/checkout', { maxRedirects: 0 });
  expect(response.status()).toBe(303);
  const location = new URL(response.headers().location);
  expect(location.protocol).toBe('https:');
  expect(location.hostname).toBe('checkout.dodopayments.com');
  expect(location.pathname).toMatch(/^\/session\/cks_/);
});

test('@claim:paid-checkout-setup checkout leaves the product for Sociobot hosted Dodo payment', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Buy the extras' })).toHaveAttribute(
    'href',
    'https://api.sociobot.in/api/v1/products/touch-canvas-drills/checkout',
  );
  const response = await request.get('https://api.sociobot.in/api/v1/products/touch-canvas-drills/checkout', { maxRedirects: 0 });
  expect(response.status()).toBe(303);
  expect(new URL(response.headers().location).hostname).toBe('checkout.dodopayments.com');
});

test('@claim:mit-license README links the complete MIT license', async () => {
  const [readme, license] = await Promise.all([readFile('README.md', 'utf8'), readFile('LICENSE', 'utf8')]);
  expect(readme).toContain('[LICENSE](LICENSE)');
  expect(license).toContain('Permission is hereby granted, free of charge, to any person obtaining a copy');
  expect(license).toContain('THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND');
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

test('every visible interactive target is at least 44px on desktop and 390px mobile', async ({ page }) => {
  const routes = ['/', '/?demo=1', '/demo', '/practice', '/privacy', '/terms', '/404.html'];
  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 390, height: 844 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    for (const route of routes) {
      await page.goto(route);
      const undersized = await page
        .locator('a[href], button, input:not([type="hidden"]), textarea, select, [role="button"], [tabindex]:not([tabindex="-1"])')
        .evaluateAll(elements => elements
          .filter(element => {
            const style = getComputedStyle(element);
            return style.display !== 'none' && style.visibility !== 'hidden' && element.getClientRects().length > 0;
          })
          .map(element => {
            const box = element.getBoundingClientRect();
            const label = element.getAttribute('aria-label') || element.textContent?.trim() || element.getAttribute('name') || element.id || element.tagName;
            return { label, width: box.width, height: box.height };
          })
          .filter(target => target.width < 44 || target.height < 44));
      expect(undersized, `${viewport.name} ${route} interactive targets smaller than 44px`).toEqual([]);
    }
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
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
    await writeFile(workerPath, original.replace("touch-drills-v9", "touch-drills-v9-regression"));
    await page.evaluate(async () => (await navigator.serviceWorker.getRegistration())?.update());
    await expect(page.getByText('A newer drill tape is ready.')).toBeVisible({ timeout: 15_000 });
    await Promise.all([
      page.waitForEvent('load'),
      page.getByRole('button', { name: 'Update app' }).click(),
    ]);
    await page.waitForFunction(() => navigator.serviceWorker.controller?.scriptURL.endsWith('/sw.js'));
    await expect.poll(() => page.evaluate(() => caches.keys()), { timeout: 15_000 }).toContain('touch-drills-v9-regression');
  } finally {
    await writeFile(workerPath, original);
  }
});

test('@claim:deployment-policy built policy ships routes, CSP, immutable assets, and a real 404', async ({ page, request }) => {
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

test('@claim:no-repository-credentials tracked source and build output contain no credentials', async () => {
  const textExtensions = new Set(['.css', '.html', '.js', '.json', '.md', '.svg', '.ts', '.txt', '.xml', '.yaml', '.yml']);
  const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
  const built: string[] = [];
  async function collect(directory: string) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await collect(path);
      else built.push(path);
    }
  }
  await collect('dist');
  const files = [...new Set([...tracked, ...built])].filter(path => textExtensions.has(extname(path)));
  const patterns = [
    new RegExp(['(?:sbk|sk-proj|ghp|github_pat)', '_[A-Za-z0-9_-]{16,}'].join(''), 'g'),
    new RegExp(['(?:AZURE_OPENAI_API_KEY|FACTORY_SOCIOBOT_KEY|CLIENT_SECRET)', '\\s*[=:]\\s*["\\\']?[A-Za-z0-9+/=_-]{16,}'].join(''), 'gi'),
    new RegExp(['-----BEGIN ', '(?:RSA |EC |OPENSSH )?PRIVATE KEY-----'].join(''), 'g'),
  ];
  const findings: string[] = [];
  for (const file of files) {
    const content = await readFile(file, 'utf8');
    if (patterns.some(pattern => { pattern.lastIndex = 0; return pattern.test(content); })) findings.push(file);
  }
  expect(findings, 'credential-like values found').toEqual([]);
});
