# Independent verification 9 — PASS

**Candidate:** `00490b4399a98a8309c033680973b7813a380943`

**Live URL:** <https://touch-canvas-drills.sociobot.in>

**Verified:** 2026-08-29 UTC

**Work order:** `touch-canvas-drills-verify-9`

**Artifact:** offline-first PWA

## Decision

**PASS — release accepted.** The live deployment byte-matches the candidate,
the researched touch-drawing job works end to end, all mandatory claim tests
pass from a clean detached clone, and fresh live checks found no defect at any
severity. No product code was changed during verification.

`.factory/brief.json` is absent. The researched brief embedded in the work
order was used as the acceptance contract.

## Mandatory first-read gate

PASS on cold desktop and 390 x 844 mobile loads.

- What it does: **Practice touch drawing with short drills.**
- For whom: people learning to draw on a phone or tablet who want steadier
  marks without a desktop editor.
- What to click first: **Try it with sample data**, immediately followed by
  **Starts a ready-to-draw sample drill.**
- On mobile, the headline, audience sentence, action, action explanation, and
  all three offline/privacy/price facts end at y=677, within the 844px first
  viewport. The primary action occupies y=427–473.
- One click opens `/?demo=1` with visible Rail lines sample marks, all 20
  drills, two replayable saved drills, and the persistent **Demo — sample
  data, nothing is saved** banner with **Reset demo** and **Start for real**.

## Required claims — 23/23 PASS

A fresh local clone was detached at the exact candidate; `git status --porcelain`
returned no entries. After `npm ci`, every `test` command in
`.factory/claims.json` was run separately through the production build and
demo entry point. Each command selected one passing test.

| Claim ID | Exact command | Result |
| --- | --- | --- |
| `twenty-drills` | `npm test -- --grep @claim:twenty-drills` | PASS |
| `png-export` | `npm test -- --grep @claim:png-export` | PASS |
| `privacy-local` | `npm test -- --grep @claim:privacy-local` | PASS |
| `clear-browser-data` | `npm test -- --grep @claim:clear-browser-data` | PASS |
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
| `license-daily-check` | `npm test -- --grep @claim:license-daily-check` | PASS |
| `pressure-independent` | `npm test -- --grep @claim:pressure-independent` | PASS |
| `first-mark-timer` | `npm test -- --grep @claim:first-mark-timer` | PASS |
| `deployment-policy` | `npm test -- --grep @claim:deployment-policy` | PASS |
| `no-repository-credentials` | `npm test -- --grep @claim:no-repository-credentials` | PASS |
| `paid-checkout-setup` | `npm test -- --grep @claim:paid-checkout-setup` | PASS |
| `mit-license` | `npm test -- --grep @claim:mit-license` | PASS |

The registry has one unique `@claim:<id>` test per entry. A manual cross-check
of the live landing/legal copy and README found no unlisted public claim.

## Clean-clone quality gates

- `npm ci`: PASS — 161 packages installed; zero audit vulnerabilities.
- `npm run test:all`: PASS — ESLint, TypeScript, 1/1 Vitest test, exact
  production build, and 35/35 Playwright tests.
- `npm audit --audit-level=high`: PASS — zero vulnerabilities.
- `npm run build`: PASS; `dist/` was produced.
- Build payload: JS 30.23 KB raw / 11.10 KB gzip; CSS 9.60 KB raw / 2.87 KB
  gzip; hero WebP 177.28 KB; no downloaded fonts. All supplied static/PWA
  budgets pass.

## Candidate/deployment identity

The live public build matches the clean candidate byte for byte:

| File | SHA-256 | Result |
| --- | --- | --- |
| `index.html` | `fb27cfd3e81c16e171a638a2d7744302ba0ef527794b1d70649322b5e820f617` | MATCH |
| `sw.js` | `1f4a3e275d99b8459d258c84e0c3502ac56647634262520d924c4533a38fa284` | MATCH |
| `manifest.webmanifest` | `fd80dec2338c7145d5348fedfd5fb88d7c88be42aad5fd16607ee775f89216cb` | MATCH |
| `404.html` | `4d9f3a08d7eaffaff441ab64ba3743a81cf006ff0c224e71707bbb0a5c450ff2` | MATCH |
| `offline.html` | `6a8939f0e54c0cd9756bd6ab9ad14a574950222467a017aaffe6938873882295` | MATCH |
| hashed JS | `08edba83019c34d24f7f545c89db30383a2f547af7ab249ebf03e0c0e7c03b95` | MATCH |
| hashed CSS | `4e66a1c3473438ca5af73ad56af1d361a459c94f8dc12a137da0eb6b83da3373` | MATCH |
| hero WebP | `e063724ef106476b622830421a317fbf7bcefee1adff57531d2e009ca7d17103` | MATCH |

This is the candidate deployment, not a stale or deployment-only variant.

## Live end-to-end and recovery checks

The portable Playwright suite passed **33/33** tests against the live origin.
The two excluded tests intentionally mutate/read the local build: the genuine
successor-service-worker simulation and the built deployment-policy test.
Both passed in the full clean local 35/35 run.

Fresh independent checks also confirmed:

- Demo drawing, save, replay, PNG export, progress JSON export/import, seven-day
  progress, reset, and start-for-real work. The downloads were
  `rail-lines.png` and `touch-canvas-drills-progress.json`.
- Demo save raised the sample count from two to three; reset restored two.
  Leaving demo removed its key from both localStorage and IndexedDB and opened
  an empty `/practice` namespace.
- The 20-second timer remained at `00:20` while untouched, started on the
  first mark, reached `00:00`, and announced the replay/save recovery. Drill
  20, Target rings, started at the 30-second upper boundary.
- A malformed JSON file, an invalid-session file, and a 2,000,001-byte file
  produced specific errors. The existing saved drill remained after all three
  rejections. Empty license input said **Paste a license token first.**
- Low- and high-pressure pointer strokes stored the same width. Left-handed
  layout reordered mobile controls and survived reload. Clear disabled stale
  replay/save actions. A rejected license kept notes and printing locked.
- A coarse-pointer Android touch drag saved one seven-point stroke. A WebKit
  26 mobile touch tap also enabled Save and persisted one touch stroke with no
  console/page error, covering Safari-style pointer delivery.
- No obviously useful brief-implied feature is missing: the PWA includes the
  20 drills, replay, progress calendar, handed layout, image export, and local
  backup/restore. AI would not improve this deliberately offline practice job.

## Accessibility and browser health

- Fresh Axe scans at desktop and 390px covered `/`, `/?demo=1`, `/demo`,
  `/practice`, `/privacy`, `/terms`, and a real unknown-route 404. Axe found
  **zero violations at any severity** on every route.
- Each route has `lang=en`, a route-specific title, exactly one h1, exactly one
  main, complete image alternatives, and no horizontal overflow.
- The supplied `verify-url.sh` passed the live root (750 ms) and demo (692 ms)
  with no console/page errors, missing alt text, or unlabelled buttons.
- Keyboard-only use reached the skip link first, moved focus to the h1, then
  reached all drill choices, the canvas, and Save. Space/Arrows/Shift drew,
  Enter saved, and Escape cleared. Focus outlines measured 4px on controls and
  5px on the canvas.
- Every visible interactive target on all routes was at least 44 x 44 CSS px
  at desktop and 390px. Text at 200% introduced no horizontal loss.
- With reduced motion, no element had a non-zero animation or transition.
  Replay completed immediately and announced **Replay shown without motion**
  through a polite live region.

## Privacy, endpoints, headers, and caching

- The complete demo draw/save/PNG/JSON/reset/start-real flow made three network
  requests: the document, hashed JS, and hashed CSS. All were same-origin.
  There was no analytics, CDN, font, account, artwork-upload, or other external
  request and no console/page error.
- Sociobot is contacted only by explicit checkout/license flows. Checkout
  returned HTTP 303 to an HTTPS `checkout.dodopayments.com/session/...` URL.
- Fresh invalid-license requests returned 200 for requests 1–30. Request 31
  returned **429** with `Retry-After: 2` and `X-RateLimit-After: 2`. Observed
  allowance: **30 requests per current window**.
- Root and app routes return `Cache-Control: no-cache`; hashed assets return
  `public, max-age=31536000, immutable`; `sw.js` returns `no-cache`; an unknown
  route returns HTTP 404 with the styled recovery page.
- Live responses include HSTS, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and a CSP limited to self
  plus the documented Sociobot license origin.

## PWA and offline behavior

- The standalone manifest has a versioned start URL and 192/512 maskable
  icons. The live service worker controls the app with cache
  `touch-drills-v8`.
- From a fresh context that visited only `/`, previously unvisited `/practice`
  opened offline with **Draw one guided mark**, HTTP 200, and no error.
- `registration.update()` completed with the current worker active and no
  stale waiting worker. The clean local successor-worker test changed the
  cache revision, showed the in-app update notice, activated on **Update app**,
  reloaded, and replaced the old cache.

## Performance

- Fresh Lighthouse mobile root: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 0.9 s, LCP 1.8 s, CLS 0, TBT 0 ms.
- Fresh Lighthouse mobile demo: Performance 92, Accessibility 100, Best
  Practices 100, SEO 100; FCP 1.0 s, LCP 1.1 s, CLS 0, TBT 350 ms.
- Under 4x CPU throttling, 30 mobile layout-toggle interactions had a 77.4 ms
  p98 event-to-next-frame time, below the 200 ms interaction budget.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.
- Informational product defects: none.

This is a static PWA, not a library, CLI, or sign-in product. Consumer-package,
backend persistence/concurrency, health identity, and Microsoft Entra checks
are not applicable. The only server-side product integration is the verified
Sociobot checkout/license endpoint above.
