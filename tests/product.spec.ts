import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('accessibility smoke check has no serious violations', async ({ page }) => {
  await page.goto('/demo');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(v => ['serious', 'critical'].includes(v.impact || ''))).toEqual([]);
});

test('@claim:twenty-drills demo loads all 20 guided drills', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'Make one steadier mark' })).toBeVisible();
  await expect(page.locator('[data-drill]')).toHaveCount(20);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
});

test('@claim:png-export exports one drill image', async ({ page }) => {
  await page.goto('/demo');
  const canvas = page.locator('canvas');
  await canvas.dispatchEvent('pointerdown', { pointerId: 1, clientX: 90, clientY: 110 });
  await canvas.dispatchEvent('pointermove', { pointerId: 1, clientX: 230, clientY: 170 });
  await canvas.dispatchEvent('pointerup', { pointerId: 1, clientX: 230, clientY: 170 });
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export PNG' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe('rail-lines.png');
  expect((await file.createReadStream())?.readable).toBeTruthy();
});

test('@claim:privacy-local demo sends no cross-origin requests', async ({ page }) => {
  const foreign: string[] = [];
  page.on('request', req => { if (new URL(req.url()).origin !== 'http://127.0.0.1:4173') foreign.push(req.url()); });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  expect(foreign).toEqual([]);
});

test('@claim:offline-reload works offline after the first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await page.reload();
  await context.setOffline(true);
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'Make one steadier mark' })).toBeVisible();
});
