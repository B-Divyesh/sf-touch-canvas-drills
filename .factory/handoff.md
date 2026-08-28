# Touch Canvas Drills repair handoff

## Result

Release blockers from verifier report commit
`89af889bd89e722575b9adc63c8f022ab92d4bd0` are repaired in version 1.0.2.
The product remains a static, offline-first PWA with the original cassette-era
zine design and the same free and paid feature boundaries.

Before code changes, the controller reproduction against the deployed
candidate confirmed both relevant states:

- The newly registered checkout returned HTTP 303 to an HTTPS
  `checkout.dodopayments.com/session/cks_…` Dodo Live URL.
- `/practice?license=definitely-invalid-controller-repro` received
  `{"valid":false,"reason":"invalid"}` but left the note enabled and the
  Save note and Print practice week controls present.

## Repairs

- A returned token is stored and stripped from the URL, but it remains locked
  until verification succeeds. Invalid verification now rerenders the locked
  note and print state immediately. A cached valid verdict remains available
  offline and is refreshed at most once per day.
- The purchase-terms link now uses ink text on yellow. Axe passes the landing
  page and every other product route with no serious or critical violations.
- Clear marks now disables Save this drill and Replay marks and announces the
  empty state.
- Reduced-motion replay now writes its completion message into the polite live
  region.
- The service-worker update notice is inserted into a named application-update
  landmark. The skip link has an explicit 44px minimum target.
- Cross-origin license verification bypasses the service-worker asset cache.
  Same-origin app routes and hashed assets retain their prior offline policy.
- The claims registry now covers installability, live checkout redirect,
  invalid-license lockout, daily license caching, pressure independence, and
  first-mark timer behavior. Each entry has one tagged browser test.
- The worker cache and manifest start URL were versioned for the update.

## Verification evidence

Run from `/work/repo`:

```sh
npm ci
npm run test:all
npm audit --audit-level=high
npm run build
```

Results on 2026-08-28 UTC:

- Clean install: 161 packages, 0 vulnerabilities.
- Lint and TypeScript: pass.
- Vitest: 1/1 pass.
- Playwright: 22/22 pass in Chromium 1.58.2.
- All 16 exact commands in `.factory/claims.json`: pass independently, one
  selected test each.
- Production output: JS 24.49 KB raw / 9.24 KB gzip; CSS 9.16 KB raw / 2.77
  KB gzip; hero WebP 177.28 KB. `dist/index.html` and the Azure Static Web Apps
  policy are present.
- Desktop and 390×844 browser coverage: drawing, save/replay, clear/reset,
  pointer pressure, timer, JSON/PNG export, demo isolation, paid-state changes,
  200% text, touch targets, and no horizontal overflow pass.
- Keyboard coverage: skip link, drill selection, canvas drawing, save, and
  visible focus pass.
- Accessibility: Playwright axe checks `/`, `/demo`, `/practice`, `/privacy`,
  `/terms`, and the update notice; no serious or critical violations.
- PWA: manifest/service-worker registration, landing-only offline navigation to
  uncached `/practice`, cache update behavior, and separate demo storage pass.
- Privacy: the complete ordinary demo flow makes same-origin requests only.
  License requests go only to `https://api.sociobot.in`.
- Local `verify-url.sh` on `/demo`: HTTP 200, 535ms measured load, zero console
  errors, `lang=en`, one h1, one main, complete image alternatives and button
  names.
- Lighthouse 12.8.2 mobile, with its unstable full-page screenshot collector
  disabled: Performance 100, Accessibility 100, Best Practices 100, SEO 100;
  LCP 1.5s, CLS 0, TBT 20ms, Speed Index 0.9s.

## Deployment and live checks

Deployment and post-deploy identity checks are recorded here after the repair
commit is uploaded.

## Known gaps

None. The pre-existing modified `graphify-out` analysis files are unrelated and
were intentionally excluded from the repair commits.
