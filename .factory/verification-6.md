# Independent verification 6 — PASS

**Candidate:** `a381b2431edff7a65d7c7091da613374de861249`  
**Live URL:** <https://touch-canvas-drills.sociobot.in>  
**Verified:** 2026-08-29 UTC  
**Scope:** independent deployed PWA verification; no product code changed.

## Decision

**PASS.** The deployed product byte-matches the candidate's shipped HTML, JS,
CSS, and hero asset, passes every declared claim test and local quality gate,
and completes the researched job: short offline touch-drawing practice on a
phone or tablet. No release-blocking, high, medium, or low defects were found.

`.factory/brief.json` is absent, so the researched brief supplied in work order
`touch-canvas-drills-verify-6` was the acceptance contract.

## Mandatory cold first read

PASS. A new browser context opening the live root saw, in the first screen:

- **What it does:** “Practice touch drawing with short drills.”
- **For whom:** “For people learning to draw on a phone or tablet who want
  steadier marks without a desktop editor.”
- **What to click first:** **Try it with sample data**, with the adjacent
  explanation “Starts a ready-to-draw sample drill.”

The action opens `/?demo=1` in one click. The live demo immediately provides
20 drills, two replayable marked sample drills, and the persistent “Demo —
sample data, nothing is saved” banner with Reset demo and Start for real.

## Required claims: clean install, every declared command

`npm ci` completed from the candidate checkout (161 packages; 0 audit
vulnerabilities). `.factory/claims.json` exists and has 21 IDs. Each exact
declared `npm test -- --grep @claim:<id>` command was executed separately;
each selected one passing Playwright test through the production demo entry
point.

| Claim ID | Result |
| --- | --- |
| `twenty-drills` | PASS — 1 test |
| `png-export` | PASS — 1 test |
| `privacy-local` | PASS — 1 test |
| `offline-reload` | PASS — 1 test |
| `pwa-install` | PASS — 1 test |
| `demo-isolation` | PASS — 1 test |
| `keyboard-drawing` | PASS — 1 test |
| `handed-layout` | PASS — 1 test |
| `saved-replay` | PASS — 1 test |
| `local-progress` | PASS — 1 test |
| `progress-roundtrip` | PASS — 1 test |
| `free-core` | PASS — 1 test |
| `paid-extras` | PASS — 1 test |
| `invalid-license-lock` | PASS — 1 test |
| `checkout-redirect` | PASS — 1 test |
| `merchant-refunds` | PASS — 1 test |
| `license-daily-check` | PASS — 1 test |
| `pressure-independent` | PASS — 1 test |
| `first-mark-timer` | PASS — 1 test |
| `deployment-policy` | PASS — 1 test |
| `no-repository-credentials` | PASS — 1 test |

The full quality suite then passed: `npm run lint`, `npm run typecheck`,
`npm run test:unit` (1/1), and `npm test` (33/33 Playwright tests, including
the exact production build). `npm run build` repeatedly produced `dist/`.

## Independent end-to-end exercise

- In a fresh live demo, two sample saved drills were present and replayed.
  Reset restored the bundled two-sample state; Start for real discarded the
  `demo:touch-canvas-drills:data` key and opened real practice.
- A pointer stroke on Rail lines started its timer and enabled save. Saving,
  refresh, and saved replay all worked. PNG download was `rail-lines.png`;
  JSON download was `touch-canvas-drills-progress.json`.
- A malformed JSON import displayed “This file is not valid JSON. Choose a
  progress export from this app.” and retained prior saved work. The authored
  claim test also passes valid export/import/replay and invalid-data retention.
- Keyboard-only drawing worked with Space, Arrow, Shift+Arrow, and Escape;
  Escape announced “Marks cleared. Keyboard pen is at the center.”
- At 390×844, there was no horizontal overflow. The 225.6×45.5px handedness
  control rearranged the drill list/deck and persisted after reload.
- With `prefers-reduced-motion: reduce`, replay announced “Replay shown
  without motion”; the computed page had zero non-zero animation/transition
  durations.

## Accessibility and browser health

- Fresh live Axe scans of `/`, `/?demo=1`, `/practice`, `/privacy`, `/terms`,
  and the real `/missing-path` 404 found **zero serious or critical** issues.
  Every route had one h1 and one main. The expected 404 navigation logged its
  own failed resource; normal routes had no console or page errors.
- Keyboard focus began with the visible Skip to drills link (4px blue outline)
  and reached the canvas without a trap (5px blue outline).
- `/opt/fleet/lib/verify-url.sh` passed the root and query demo. Evidence is
  in `.factory/evidence/verification-6/`: root loaded in 613 ms and demo in
  588 ms, with no errors, `lang=en`, a title, one h1, main, and no image
  missing alt text or unlabeled buttons.

## Privacy, endpoint, headers, caching, and deployment identity

- Cold-live request logging observed only the product origin for the normal
  landing/demo practice flow; no analytics, CDN script/font, upload, or other
  third-party request occurred. The `privacy-local` sandbox claim also passed.
  Sociobot is the explicitly documented exception only when a license is
  added/checked.
- The live checkout endpoint returned **303** to an HTTPS
  `checkout.dodopayments.com/session/...` URL.
- Fresh sequential invalid-license requests to the Sociobot verification
  endpoint returned 200 for requests **1–30**. Request **31** returned
  **429** with `Retry-After: 3`; observed allowance: **30 requests per
  current window**.
- Root and routes send `Cache-Control: no-cache`; the hashed JS sends
  `public, max-age=31536000, immutable`; `sw.js` is no-cache. Response headers
  include HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer
  policy, and a CSP restricting connections to self and
  `https://api.sociobot.in`.
- Candidate/live SHA-256 matches were observed for `index.html`
  (`56b033…17fe`), JS (`78904b…fee01`), CSS (`e53dfc…12cde`), and hero WebP
  (`e06372…17103`).

## PWA and performance budgets

- The live manifest declares standalone display, versioned start URL, and
  maskable 192/512 icons. A fresh registration controlled the page; explicit
  `registration.update()` completed with the active `sw.js` worker.
- After landing setup, `/practice` opened and reloaded offline with the drawing
  canvas present and no errors. The full suite's service-worker regression
  also passed the successor-worker update/activation case.
- Build output is 29.79 KB JS raw / 10.97 KB gzip, 9.51 KB CSS raw / 2.85 KB
  gzip, and 177.28 KB hero WebP: within the supplied static-PWA budgets.

## Defects by severity

- Release-blocking: none.
- High: none.
- Medium: none.
- Low: none.

Pre-existing unrelated `graphify-out/*` worktree changes were not edited or
included in this verification.
