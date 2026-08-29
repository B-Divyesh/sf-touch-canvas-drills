# Independent verification 10 — PASS

**Candidate:** `765e70bf348a5cab44ab3bf987b4774808299a00`
**Live URL:** <https://touch-canvas-drills.sociobot.in>
**Verified:** 2026-08-29 UTC
**Work order:** `touch-canvas-drills-verify-10`
**Artifact:** offline-first PWA

## Decision

**PASS — release accepted.** A clean detached checkout of the exact candidate
passed every declared claim, all available local quality gates, and fresh
independent live checks. The public app byte-matches the candidate build. No
product code was changed during verification.

`.factory/brief.json` is absent; the researched brief in the work order was
used as the acceptance contract.

## First-read gate

PASS on a cold live load. The first screen plainly says:

- It does: **Practice touch drawing with short drills.**
- It is for: people learning to draw on a phone or tablet who want steadier
  marks without a desktop editor.
- First action: **Try it with sample data**, followed immediately by
  **Starts a ready-to-draw sample drill.**

The first screen also gives the three concrete facts: works offline after the
first visit, marks stay on this device, and all 20 drills are free while extras
cost $6 once. One click opens the isolated `?demo=1` Rail lines sample.

## Required claims — 23/23 PASS

From a fresh detached checkout at the candidate, `npm ci` installed 161
packages with zero audit vulnerabilities. Every exact `test` command in
`.factory/claims.json` was run separately; each selected one passing
Playwright test through the production build and demo entry point.

| Claim ID | Result |
| --- | --- |
| `twenty-drills` | PASS |
| `png-export` | PASS |
| `privacy-local` | PASS |
| `clear-browser-data` | PASS |
| `offline-reload` | PASS |
| `pwa-install` | PASS |
| `demo-isolation` | PASS |
| `keyboard-drawing` | PASS |
| `handed-layout` | PASS |
| `saved-replay` | PASS |
| `local-progress` | PASS |
| `progress-roundtrip` | PASS |
| `free-core` | PASS |
| `paid-extras` | PASS |
| `invalid-license-lock` | PASS |
| `checkout-redirect` | PASS |
| `license-daily-check` | PASS |
| `pressure-independent` | PASS |
| `first-mark-timer` | PASS |
| `deployment-policy` | PASS |
| `no-repository-credentials` | PASS |
| `paid-checkout-setup` | PASS |
| `mit-license` | PASS |

The registry has one tagged test per claim. A fresh read of the landing,
privacy, terms, and README found no unregistered visitor-facing claim.

## Local quality gates

- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm run test:unit`: PASS, 1/1 Vitest test.
- `npm test`: PASS, 35/35 Playwright tests.
- `npm run test:all`: PASS (the preceding lint, type check, unit, exact build,
  and 35-test browser suite all completed successfully).
- `npm run build`: PASS and produced `dist/`.
- `npm audit --audit-level=high`: PASS, zero vulnerabilities.
- Output budget: JavaScript 30.57 kB raw / 11.20 kB gzip; CSS 9.60 kB raw /
  2.87 kB gzip; the hero WebP is 177.28 kB. No external fonts or scripts load.

## Live identity, product behavior, and PWA

Fresh SHA-256 comparisons matched the clean candidate for the root document,
service worker, manifest, 404/offline pages, hashed JS/CSS, and hero image.
The live JS hash is
`a8a53225e455ba2a11cb1b112c15ee5776d6bc353d9d18126bed5d80ed846151`;
the CSS hash is
`4e66a1c3473438ca5af73ad56af1d361a459c94f8dc12a137da0eb6b83da3373`.

- Desktop and 390px mobile demo checks showed a populated Rail lines canvas,
  20 selectable drills, two replayable samples, Reset demo, and Start for
  real. All checked buttons were at least 44px high.
- A keyboard Tab sequence reached the skip link, navigation, demo controls,
  and every inspected drill button. The claim suite independently exercised
  Space/Arrow/Shift drawing, Escape clearing, persistence, and left-handed
  mobile layout.
- A real invalid license token was rejected by the live Sociobot endpoint.
  The URL was cleaned, private notes and printing remained locked, and the app
  displayed **License no longer active. Free drills still work.**
- From a clean context that first visited `/`, an offline navigation to the
  previously unvisited `/practice` loaded **Draw one guided mark** under an
  active service worker with no offline error. The local suite also passed the
  successor-worker update prompt test.

## Accessibility, privacy, headers, and performance

- `/opt/fleet/lib/verify-url.sh` passed against `/`, `?demo=1`, `/privacy`,
  and `/terms`: each returned 200 with a title, `lang=en`, one h1, main
  landmark, complete image alternatives, labelled buttons, and zero
  console/page errors.
- Fresh Axe scans on desktop and 390px demo found **zero serious or critical
  violations**. The full local browser suite covers all routes, the styled
  404, focus/history behavior, touch targets, and reduced motion.
- A complete live demo request log contained only same-origin GET requests for
  the document, hashed JS, and CSS. There was no analytics, upload, account,
  or third-party font/script request. The only external origin in CSP is the
  documented Sociobot license endpoint, used only by explicit license/checkout
  flows.
- Live root/app routes use `no-cache`; hashed assets use
  `public, max-age=31536000, immutable`; `sw.js` uses `no-cache`; an unknown
  route returns the styled page with HTTP 404. Responses include HSTS, nosniff,
  strict-origin referrer policy, and a restrictive CSP.
- Lighthouse mobile root result: Performance 99, Accessibility 100, LCP
  1.78s, CLS 0, TBT 0ms. (The Chromium process logged a post-audit tab crash,
  but the completed report and all browser checks are valid.)

## Endpoint allowance

The only server-side product integration is Sociobot checkout/license
verification. Checkout returned HTTP 303 to an HTTPS
`checkout.dodopayments.com/session/...` URL. A single client made invalid
verification calls: requests 1–31 returned 200 and request 32 returned 429.
A repeat limit response included `Retry-After: 0` and `X-RateLimit-After: 0`.
Observed allowance: 31 requests in the current burst window; rate limiting is
enforced.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

Not applicable: consumer package/CLI installation, backend persistence or
concurrency, sign-in/Entra tenant verification. This is a static local-first
PWA with no sign-in and no product backend.
