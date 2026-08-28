import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', 'graphify-out/**', 'playwright-report/**', 'test-results/**'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts', 'tests/**/*.ts', '*.ts'],
    languageOptions: { globals: { document: 'readonly', window: 'readonly', location: 'readonly', history: 'readonly', navigator: 'readonly', localStorage: 'readonly', indexedDB: 'readonly', performance: 'readonly', crypto: 'readonly', matchMedia: 'readonly', requestAnimationFrame: 'readonly', setTimeout: 'readonly', Blob: 'readonly', URL: 'readonly', HTMLCanvasElement: 'readonly', CanvasRenderingContext2D: 'readonly', PointerEvent: 'readonly', KeyboardEvent: 'readonly', IDBTransactionMode: 'readonly', IDBObjectStore: 'readonly' } },
  },
  {
    files: ['public/sw.js'],
    languageOptions: { globals: { self: 'readonly', caches: 'readonly', fetch: 'readonly', URL: 'readonly', location: 'readonly' } },
  },
);
