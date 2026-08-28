# Touch Canvas Drills handoff

## Delivered

- Vite + TypeScript installable PWA in `dist/`, with a hand-written service
  worker, manifest, offline fallback, update notice, and local-only storage.
- Twenty timed line, curve, and shape drills with touch/pointer drawing,
  clear, replay, a left-handed layout, per-drill PNG export, JSON progress
  export, and a seven-day local progress calendar.
- `/demo` is an isolated sample-data sandbox; it has its own
  `demo:touch-canvas-drills:` storage namespace, reset control, and a clear
  path to real practice.
- A $6 one-time Sociobot checkout link, return-token storage, daily license
  verification, restore field, and optional paid notes/printable practice week.
- `/privacy`, `/terms`, `/404`, metadata, sitemap, robots file, security
  headers, plain-language copy audit, claims registry, and product docs.
- Original generated cassette-zine hero art at `assets/src/cassette-drill.webp`
  (177 KB). The source PNG and prompt sidecar are retained as provenance.

## Verification

Ran on 2026-08-28:

- `npm run build` — passed; `dist/index.html` is at the deploy root.
- `npm run test:unit` — 1/1 passed.
- `npm test` — 5/5 passed: 20 drills, PNG export, no cross-origin demo
  requests, offline reload after first visit, and axe serious/critical scan.
- Lighthouse mobile-style run against `/demo`: Performance **100**,
  Accessibility **100**, LCP **1.5 s**, CLS **0**.
- Production bundles: JavaScript 7.75 KB gzip, CSS 2.60 KB gzip, hero WebP
  177 KB. Console smoke check found no errors; mobile 390px drill view was
  visually inspected.

## Known gaps / next steps

- Practice state is mirrored into IndexedDB and uses a small local-storage key
  for synchronous first paint. Both stores stay on-device; JSON export remains
  the ownership path.
- The factory must register the Sociobot product before the checkout and live
  verification endpoints can return production licenses. No product IDs or
  secrets are embedded here.
- The paid printable week sheet uses the browser print dialog and print CSS;
  a future version could offer a designed PDF export.
