# Touch Canvas Drills — polish 4 handoff

## Result: PASS

Repair source commit: `388cd5e` (`fix: close review four findings`). It was
pushed to `main` and deployed as Static Web Apps deployment
`be6b2242-d0cc-448e-b702-cb4a2c2e4e` on 2026-08-29 UTC.

## What changed

- Removed the unprovable merchant/refund promise and its copy-only claim. The
  terms page now says only what the product proves: Sociobot-hosted checkout
  and immediate locking of notes and printing after a rejected or revoked
  license.
- Added `clear-browser-data` to `.factory/claims.json`. Its Playwright claim
  test saves a real drill, confirms both localStorage and IndexedDB records,
  clears the entire origin through Chrome's storage protocol, reloads, and
  confirms both records are gone.
- Rewrote the Android-only README sentence for all people who draw on phones
  and tablets. Rewrote the first-screen facts to name all 20 free drills and
  use `mark` consistently. Rewrote the second how-it-works step as **Draw
  until the timer ends**.
- Retained and rechecked the isolated `?demo=1` Rail lines sample, visible
  coral marks, persistent banner, reset, and discard-on-exit behavior.
- Bumped the visible app build to v1.0.7, the manifest start version to 5, and
  the service-worker cache to `touch-drills-v8`.
- Updated the catalog description to: “Practice touch drawing with 20 offline
  drills for phones and tablets.”

## Verification

- Clean clone: `/tmp/touch-canvas-drills-polish-4.MbRXb0` cloned `main` at
  `388cd5e`; `npm ci` reported 0 vulnerabilities.
- Clean clone quality suite passed: ESLint, TypeScript, Vitest (1 unit test),
  production build, and all 35 Playwright browser tests. The Playwright result
  is `{"status":"passed","failedTests":[]}`.
- Every exact command registered by all 23 current `.factory/claims.json`
  entries was run separately in that clean clone; each selected exactly one
  passing `@claim:<id>` test. This includes `clear-browser-data`, demo
  isolation, offline deep-link reload, payment redirect, revoked-license
  locking, and the credential scan.
- Local `verify-url.sh` reports 200, a title, `lang=en`, exactly one h1 and
  main, complete image alt text, labelled buttons, and no console errors on
  `/`, `?demo=1`, `/privacy`, `/terms`, and `/404.html`. Reports and
  screenshots are in `evidence/polish-4/local/`.
- Local Lighthouse on `?demo=1`: performance 100, accessibility 100, best
  practices 100, SEO 100; LCP 1.5 s, CLS 0, TBT 30 ms. Initial JavaScript is
  11.10 kB gzip, CSS is 2.87 kB gzip, and the hero is 177.28 kB.
- Cold live checks passed after deployment. `verify-url.sh` found no console
  errors on `/`, `?demo=1`, `/privacy`, `/terms`, and `/404.html`; an unknown
  URL returned HTTP 404. The targeted live Playwright regression run passed
  13/13 tests for routes/metadata/focus, literal copy, 404, privacy, clear
  browser data, demo isolation, offline reload, checkout, and 390 px layout.
  Evidence is in `evidence/polish-4/live/`.
- Live Lighthouse on `?demo=1`: performance 100, accessibility 100, best
  practices 100, SEO 100; LCP 1.0 s, CLS 0, TBT 30 ms.

## How to run and verify

```sh
npm ci
npm run test:all
npm run preview
```

Open `/?demo=1` for the one-click sandbox. The first canvas already contains
the Rail lines sample. **Reset demo** restores only sample data; **Start for
real** deletes the demo namespace and opens an empty real practice pad.

## Known gaps

None. The product intentionally makes no merchant/refund assertion because no
authoritative public endpoint was available to test it. Payment and license
behavior are instead stated and tested only to the observable extent above.
