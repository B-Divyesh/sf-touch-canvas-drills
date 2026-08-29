# Touch Canvas Drills — polish 5 handoff

## Result: PASS

All findings in reviews 1–5 are closed. The repair code is commit
`c1eb8758d22820b3fd73b6b41f0fbffe2c124354`, pushed to `main` and deployed to
<https://touch-canvas-drills.sociobot.in> as Azure Static Web Apps deployment
`354cab45-5100-4377-868e-e01ad579f577` on 2026-08-29 UTC.

## What changed

- Strengthened all seven incomplete round-5 claim tests. They now prove the
  actual paid, drill, PNG, progress, free-use, privacy, and demo-isolation
  outcomes described in `.factory/review-5.md`.
- Added stable dates, counts, and accessible labels to the seven-day progress
  cells so date boundaries and visible counts can be verified.
- Updated every affected `.factory/claims.json` sandbox description to match
  the real observable test.
- Kept the one-click `/?demo=1` sample, persistent banner, Reset, Start for
  real, real/demo storage separation, first-screen copy, routes, titles,
  metadata, focus behavior, 404, legal links, mobile layout, and cassette-zine
  visual identity intact.
- Bumped the product to v1.0.8, PWA cache to `touch-drills-v9`, and manifest
  start URL to `/?v=6`.
- Updated the verb-first, 75-character catalog description and refreshed the
  copy audit. `.factory/polish-5.md` maps every finding ID to its change and
  evidence.

## Verification

From a fresh clone of `c1eb875`:

- `npm ci`: 0 vulnerabilities.
- `npm run test:all`: lint, TypeScript, 1/1 Vitest test, production build, and
  35/35 Playwright tests passed.
- Every one of the 23 exact commands in `.factory/claims.json` ran separately
  and passed. Full output:
  `.factory/evidence/polish-5/clean-clone/verification.log`.
- Production output has `dist/index.html`. Initial JavaScript is 30.57 kB raw /
  11.20 kB gzip; CSS is 9.60 kB raw / 2.87 kB gzip; hero art is 177.28 kB.
- Local mobile Lighthouse on `/?demo=1`: 100 performance, 100 accessibility,
  100 best practices, 100 SEO; LCP 1.1 s, CLS 0, TBT 50 ms.

After deployment:

- The live page references the same `/assets/index-ElHNDllP.js` as the clean
  build.
- 33/33 portable browser tests passed against the live origin. This includes
  every strengthened round-5 claim, all-route Axe, offline, privacy, keyboard,
  mobile, metadata, focus/history, checkout, and 404 UI checks.
- `verify-url.sh` passed on `/`, `/?demo=1`, `/privacy`, `/terms`, and
  `/404.html`: correct title and language, one h1/main, complete image/button
  labels, and zero console errors. A cold unknown URL returned HTTP 404 with
  the shared v1.0.8 shell.
- Live mobile Lighthouse on `/?demo=1`: 100/100/100/100; LCP 1.0 s, CLS 0,
  TBT 50 ms.
- Fresh mobile screenshots were inspected for the landing, populated demo,
  privacy, terms, and 404. The demo shows sample marks before a second action,
  and the first landing action remains above the fold at 390×844.

## Run and verify

```sh
npm ci
npm run test:all
npm test -- --grep @claim:<claim-id>
npm run build
npm run preview
```

Use `/?demo=1` for the isolated verifier path. Deploy the `dist/` directory as
a static site using the work-order configuration.

## Known gaps and next steps

None. No review finding, TODO, stub, or deferred minor item remains. The absent
`.factory/brief.json` noted by earlier reviews is still absent; scope continues
to come from the product contract, design thesis, README, demo document, and
accumulated review history.
