# Touch Canvas Drills polish 3 handoff

## Result

**PASS.** Release repair commit `a34386d4c8034e6b786c909ee2141a1e7c12c22e`
is pushed to `main` and deployed to
<https://touch-canvas-drills.sociobot.in> as deployment
`d418c81f-c7b5-4e57-b2a6-3cf8790be4c7`.

The demo now opens with the bundled Rail lines marks visibly drawn on the
first canvas. It remains fully isolated: Reset restores the same marked sample,
and Start for real discards only demo data. The footer no longer promises a
learning outcome. README deployment and license statements are plain, split,
registered claims with tagged tests. The product keeps its cassette-zine
identity, PWA/offline class, local-first data model, real routes, legal pages,
and static deployment configuration.

## Run and verify

```sh
npm ci
npm run test:all
npm run preview
```

Open `/?demo=1` for the isolated sample. `npm run build` writes the static PWA
to `dist/` with `index.html` at its root.

## Exact verification evidence

- Clean clone: `/tmp/touch-canvas-drills-polish-3.Nu91wt/clone`.
  `npm ci` completed with 0 vulnerabilities. `npm run test:all` passed lint,
  typecheck, 1 Vitest test, build, and **35 Playwright tests**.
- All **23** exact tests named in `.factory/claims.json` passed separately in
  that clean clone. The new `demo-isolation`, `paid-checkout-setup`, and
  `mit-license` entries each select exactly one tagged test.
- Local mobile Lighthouse: performance 99, accessibility 100, best practices
  100, SEO 100; LCP 986 ms, CLS 0, TBT 97 ms. Live mobile Lighthouse:
  performance 100, accessibility 100, best practices 100, SEO 100; LCP 903
  ms, CLS 0, TBT 0 ms.
- Live `verify-url.sh` reports have no console errors and pass title, language,
  h1/main, image-alt, and button-label checks on [root](evidence/polish-3/live/root/verify.json)
  and [query demo](evidence/polish-3/live/demo/verify.json).
- Live cold-check evidence in [live-check.json](evidence/polish-3/live/live-check.json):
  all six product routes returned 200; unknown route returned 404; route
  metadata, focus/back behavior, offline deep-link navigation, and demo
  localStorage isolation passed. The landing action at 390px showed the canvas
  at y=544 with 9,780 coral sample pixels; Reset restored 9,780. Live Axe
  found zero violations on all public screens and static 404.
- [link-crawl.json](evidence/polish-3/live/link-crawl.json) records 200 for
  every internal product/legal link. Response headers include CSP, HSTS,
  `nosniff`, and strict referrer policy. The 404 route is real HTTP 404.
- Initial build assets: 11.09 kB gzip JS, 2.85 kB gzip CSS, 177.28 kB local
  hero image. The PWA manifest start URL and service-worker cache were bumped
  to version 4/v7 for this release.

## Documentation and scope

`.factory/polish-3.md` maps all F-1, F-2, and F-3 findings to their exact
changes, tests, screenshots, and live checks. `.factory/claims.json`,
`.factory/demo.md`, `.factory/copy-audit.md`, README, catalog description,
privacy page, and terms page are current.

No known product gaps remain. `.factory/brief.json` was not present in this
checkout; scope was therefore checked against the shipped README, visual
thesis, demo contract, and cumulative review records.
