import { defineConfig } from 'vite';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

function injectPrecacheManifest() {
  return {
    name: 'inject-precache-manifest',
    apply: 'build' as const,
    async closeBundle() {
      const assetNames = (await readdir('dist/assets')).map(name => `/assets/${name}`);
      const workerPath = join('dist', 'sw.js');
      const worker = await readFile(workerPath, 'utf8');
      await writeFile(workerPath, worker.replace('const GENERATED_ASSETS = [];', `const GENERATED_ASSETS = ${JSON.stringify(assetNames)};`));
    },
  };
}

export default defineConfig({
  plugins: [injectPrecacheManifest()],
  build: {
    target: 'es2022', outDir: 'dist', assetsInlineLimit: 0,
  },
  test: { environment: 'node', include: ['tests/**/*.test.ts'] }
});
