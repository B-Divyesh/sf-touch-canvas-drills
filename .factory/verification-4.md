# Independent verification 4 — PASS

**Candidate:** `10c3d4e01cee33e939ccc1dec7e2988ab451d6e5`

**Live URL:** <https://touch-canvas-drills.sociobot.in>

**Verified:** 2026-08-28 UTC

**Artifact:** offline-first PWA

## Decision

**PASS — release accepted.** The candidate satisfies the researched brief and
the supplied factory contract. The live deployment matches the candidate's
public build, all required claim tests pass, the one-click demo works and is
isolated, and fresh live checks found no release-blocking or lower-severity
product defect.

No product code was changed during this verification.

## First-read gate

PASS on cold desktop and 390×844 mobile loads.

- What it does: “Practice touch drawing with short drills.”
- For whom: people learning on a phone or tablet who want steadier marks
  without a desktop editor.
- What to click first: **Try it with sample data**, immediately followed by
  “Starts a ready-to-draw sample drill.”
- The first viewport also shows the offline, local-data, and price facts.
- At 390×844, the primary action occupied y=427.44–472.94, entirely within the
  first viewport. One click opened the populated `/demo` practice pad.

## Required claim tests

`.factory/claims.json` exists. After `npm ci`, every listed command ran
separately from the production demo/test entry point and selected one passing
test. The 19 IDs and 19 `@claim:` tags are in one-to-one correspondence.

| Claim ID | Exact command | Result |
| --- | --- | --- |
| `twenty-drills` | `npm test -- --grep @claim:twenty-drills` | PASS |
| `png-export` | `npm test -- --grep @claim:png-export` | PASS |
| `privacy-local` | `npm test -- --grep @claim:privacy-local` | PASS |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS |
| `pwa-install` | `npm test -- --grep @claim:pwa-install` | PASS |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | PASS |
| `keyboard-drawing` | `npm test -- --grep @claim:keyboard-drawing` | PASS |
| `handed-layout` | `npm test -- --grep @claim:handed-layout` | PASS |
| `saved-replay` | `npm test -- --grep @claim:saved-replay` | PASS |
| `local-progress` | `npm test -- --grep @claim:local-progress` | PASS |
| `progress-roundtrip` | `npm test -- --grep @claim:progress-roundtrip` | PASS |
| `free-core` | `npm test -- --grep @claim:free-core` | PASS |
| `paid-extras` | `npm test -- --grep @claim:paid-extras` | PASS |
| `invalid-license-lock` | `npm test -- --grep @claim:invalid-license-lock` | PASS |
| `checkout-redirect` | `npm test -- --grep @claim:checkout-redirect` | PASS |
| `merchant-refunds` | `npm test -- --grep @claim:merchant-refunds` | PASS |
| `license-daily-check` | `npm test -- --grep @claim:license-daily-check` | PASS |
| `pressure-independent` | `npm test -- --grep @claim:pressure-independent` | PASS |
| `first-mark-timer` | `npm test -- --grep @claim:first-mark-timer` | PASS |

A cross-check of landing, app, privacy, terms, and README copy found no
visitor-facing claim outside this registry.

## Clean-checkout quality gates

- `npm ci`: PASS; 161 packages installed, 0 vulnerabilities.
- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm run test:unit`: PASS; 1/1 Vitest test.
- `npm test`: PASS; exact production build plus 27/27 Playwright tests.
- `npm audit --audit-level=high`: PASS; 0 vulnerabilities.
- Exact `npm run build`: PASS; `dist/` produced with root `index.html`.
- Output: JS 28.50 KB raw / 10.66 KB gzip; CSS 9.51 KB raw / 2.85 KB
  gzip; hero WebP 177.28 KB. The JS, CSS, font, and image budgets pass.

## Independent end-to-end results

PASS unless marked otherwise; no item failed.

- `/demo` starts with 20 drills, two realistic saved sessions containing
  marks, two replay actions, and the persistent sample-data banner.
- Pointer and mobile touch marks start the timer and enable replay/save. A
  saved mark increased demo progress from two sessions to three.
- Export downloaded the active **S curves** drill as `s-curves.png`; the file
  was a valid 900×675 PNG. Progress JSON contained all three sessions and no
  license value.
- Refresh retained real progress, and saved marks replayed after refresh.
- Reset restored exactly the two samples in localStorage and IndexedDB. Start
  for real deleted both demo records and opened an empty `/practice` space.
- Malformed JSON and a file larger than 2 MB produced actionable errors and
  did not remove existing progress.
- Boundary coverage: 500 valid sessions imported; 501 was rejected while all
  500 remained. Maximum validated point/width/time values were accepted. The
  20-second timer stopped at `00:00`, announced replay/save, and saved a
  20-second result without going negative.
- Blank license input announced “Paste a license token first.” Authored tests
  also covered returned valid and invalid tokens, immediate paid-control
  locking, URL stripping, note/print access, and one-check-per-day caching.
- There is no sign-in, product backend, library, or CLI surface. Entra,
  consumer-package, backend concurrency, health, and backend persistence
  checks therefore do not apply.

## Mobile, keyboard, accessibility, and motion

- At 390×844, the page had no horizontal overflow. Forced 200% text also had
  no horizontal loss.
- Measured header, demo, and footer targets were all at least 44×44px.
- Left-handed mode moved the drill list above the deck and persisted after
  reload; right-handed mode kept the deck first.
- Keyboard-only use reached the canvas through ordinary Tab order. Space,
  Arrows, Shift+Arrows, Escape, save, refresh, and replay all worked. The
  canvas focus ring was a visible 5px blue outline; no trap was observed.
- With reduced motion, CSS animation and transition durations were 0s and
  replay completed immediately with polite live-region feedback.
- Playwright axe found zero serious or critical findings on live `/`, `/demo`,
  `/practice`, `/privacy`, and `/terms`; it found zero on mobile `/demo` too.
  The runs in fact returned no axe violations at any impact level.
- All product routes had `lang=en`, route-specific titles, one h1, one main,
  and no missing image alternatives. History navigation moved focus to the
  new h1. The styled unknown route returned HTTP 404.
- `/opt/fleet/lib/verify-url.sh` on live `/demo`: HTTP 200, 774ms measured
  load, no console errors, one h1, main present, no missing image alternatives,
  and no unlabeled buttons.

## Privacy, headers, and paid endpoint

- The full ordinary demo flow—load, replay, draw, save, export, invalid import,
  reset, and Start for real—made same-origin requests only. No analytics, CDN,
  external font, artwork upload, console error, or page error was observed.
- Static inspection found only the documented product origin and Sociobot
  checkout/license origin. No Azure key or endpoint is embedded.
- Live HTML/routes send CSP, HSTS, `nosniff`, and strict-origin referrer
  headers. The CSP limits connections to self and `https://api.sociobot.in`.
- Checkout returned HTTP 303 to an HTTPS
  `checkout.dodopayments.com/session/...` URL.
- The license verifier returned 200 for sequential requests 1–30 from one
  client. Request 31 returned **429** with `Retry-After: 3`. Observed allowance:
  **30 requests per current window**.

## Deployment identity, caching, and PWA

- All 15 public files from the candidate's exact `dist/` build byte-match live:
  HTML, hashed JS/CSS, art, icons, manifest, worker, offline/404 pages, robots,
  sitemap, and social image. Local/live `index.html` SHA-256 is
  `3a6d02c7cd82084388fbf5af231cef519b796d76f55118cab8c986690d2a2f05`.
- `staticwebapp.config.json` is correctly consumed by Azure rather than served;
  its live header, rewrite, cache, and 404 effects were checked directly.
- Shell routes are `no-cache`; hashed JS/CSS are
  `public, max-age=31536000, immutable`; `sw.js` is `no-cache`.
- Manifest metadata, standalone display, maskable 192/512 icons, active worker,
  and installable start URL pass.
- From a fresh live context, visiting only `/`, allowing worker control, and
  going offline opened previously unvisited `/practice`. Offline `/?v=2`
  also opened the app rather than the fallback.
- The exact-build successor-worker regression passed: a genuine waiting worker
  offered **Update app**, activated after the click, reloaded, and replaced the
  old cache. A first install showed no false update notice.

## Performance

Fresh Lighthouse 12.8.2 mobile audit on live `/demo`, with the full-page
screenshot audit disabled: Performance **98**, Accessibility **100**, Best
Practices **100**, SEO **100**; FCP 1.2s, LCP 1.2s, TBT 140ms, CLS 0, Speed
Index 1.3s, and no run warnings. INP is not produced for a lab navigation.

## Defects by severity

- Release-blocking: none.
- High: none.
- Medium: none.
- Low: none.

## Source note

`.factory/brief.json` is absent at the tested commit. The researched brief
embedded in work order `touch-canvas-drills-verify-4` was used as the acceptance
source. Existing unrelated `graphify-out/*` workspace changes were not edited
or included in the verification commit.
