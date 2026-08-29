# Independent verification 7 — FAIL

**Candidate:** `05c40f9a2ba513b17186e4ad21d367c0bd87e603`

**Live URL:** <https://touch-canvas-drills.sociobot.in>

**Verified:** 2026-08-29 UTC

**Work order:** `touch-canvas-drills-verify-7`

**Scope:** independent deployed-PWA verification; no product code changed.

## Decision

**FAIL.** The live product matches the candidate and the drawing, demo,
privacy, offline, licensing, accessibility-automation, and performance paths
work. However, the landing page's **Read purchase terms** link has a rendered
target of **180.8 × 20 CSS px** at both 1440px desktop and 390px mobile. Its
20px height violates the supplied non-negotiable **44 × 44 CSS px** touch-target
minimum. This is a medium-severity accessibility defect and release-blocking
acceptance gap for a product whose primary users draw on phones and tablets.

`.factory/brief.json` is absent. The researched brief embedded in the work
order was used as the scope contract.

## Mandatory cold first read

PASS. A fresh live browser context showed, within the first 390 × 844 screen:

- What it does: **“Practice touch drawing with short drills.”**
- For whom: **“For people learning to draw on a phone or tablet who want
  steadier marks without a desktop editor.”**
- What to click first: **Try it with sample data**, followed by **“Starts a
  ready-to-draw sample drill.”**

The primary action was fully visible at `y=427–473` and opened `/?demo=1` in
one click. The result immediately showed the marked Rail lines canvas, all 20
drills, two replayable saved drills, and the persistent **Demo — sample data,
nothing is saved** banner with **Reset demo** and **Start for real**.

## Clean checkout and required claims

Tests ran from the clean detached checkout
`/tmp/touch-canvas-verify-7.cLxLtB` at the exact candidate. `npm ci` installed
161 packages with zero audit vulnerabilities. `.factory/claims.json` exists
and contains 23 claims. Every listed command was run separately and passed:

| Claim | Result |
| --- | --- |
| `twenty-drills` | PASS — 1 selected test |
| `png-export` | PASS — 1 selected test |
| `privacy-local` | PASS — 1 selected test |
| `offline-reload` | PASS — 1 selected test |
| `pwa-install` | PASS — 1 selected test |
| `demo-isolation` | PASS — 1 selected test |
| `keyboard-drawing` | PASS — 1 selected test |
| `handed-layout` | PASS — 1 selected test |
| `saved-replay` | PASS — 1 selected test |
| `local-progress` | PASS — 1 selected test |
| `progress-roundtrip` | PASS — 1 selected test |
| `free-core` | PASS — 1 selected test |
| `paid-extras` | PASS — 1 selected test |
| `invalid-license-lock` | PASS — 1 selected test |
| `checkout-redirect` | PASS — 1 selected test |
| `merchant-refunds` | PASS — 1 selected test |
| `license-daily-check` | PASS — 1 selected test |
| `pressure-independent` | PASS — 1 selected test |
| `first-mark-timer` | PASS — 1 selected test |
| `deployment-policy` | PASS — 1 selected test |
| `no-repository-credentials` | PASS — 1 selected test |
| `paid-checkout-setup` | PASS — 1 selected test |
| `mit-license` | PASS — 1 selected test |

The claims-registry test confirms one discoverable tag per entry. A manual
cross-check of the live landing page and README found no unlisted product
claim.

## Local quality gates and production build

- `npm run test:all`: PASS.
- ESLint: PASS.
- TypeScript: PASS.
- Vitest: **1/1 passed**.
- Playwright: **35/35 passed**.
- `npm run build`: PASS and produced `dist/`.
- Build output: **30.21 KB raw / 11.09 KB gzip JS**, **9.51 KB raw / 2.85
  KB gzip CSS**, no fonts, and **177.28 KB** hero WebP. These pass the 200 KB
  JS, 50 KB CSS, 120 KB font, and 300 KB hero budgets.

## Independent end-to-end exercise

- Fresh demo data used only `demo:touch-canvas-drills:data`; the real key was
  absent. Saving raised the demo count from two to three, Reset demo restored
  two, and Start for real removed the demo record from both localStorage and
  IndexedDB before opening `/practice`.
- The timer remained at `00:20` after 1.2 seconds without input and reached
  `00:19` 1.15 seconds after the first pointer mark.
- A boundary-to-boundary pointer stroke saved, survived reload, and replayed.
- PNG export produced `rail-lines.png`, a valid PNG signature, **900 × 675**
  dimensions, and 37,322 bytes.
- JSON export produced `touch-canvas-drills-progress.json`, version 1 with one
  session and no license field.
- Malformed JSON, a wrong-shape JSON object, and a file one byte over 2 MiB
  each produced a specific recovery message. The saved session count remained
  one after rejection.
- Empty license submission said **Paste a license token first.** Left-handed
  layout set `aria-pressed=true` and remained selected after reload.
- Actual Android-emulated touch drag enabled saving and persisted one drill.
  A real Playwright WebKit touch tap also enabled saving and persisted one
  drill without console or page errors.

## Accessibility and browser health

- Fresh live Axe scans at desktop and 390px covered `/`, `/?demo=1`, `/demo`,
  `/practice`, `/privacy`, `/terms`, and the real 404. There were **zero Axe
  violations at any severity**, including zero serious/critical findings.
- Each route had `lang=en`, a route-specific title, one h1, one main landmark,
  and a correct heading outline. Normal routes had no console or page errors.
  The 404 returned HTTP 404 and only Chromium's expected failed-document
  console message.
- `/opt/fleet/lib/verify-url.sh` passed root (807 ms) and demo (732 ms): no
  errors, one h1/main, alt text present, and no unlabeled buttons.
- Keyboard focus began on the visible **Skip to drills** link. Links, controls,
  and canvas used a 4–5px blue focus outline; no keyboard trap appeared.
  Space/Arrow/Shift+Arrow drew, and Escape reset the controls and announced
  **Marks cleared. Keyboard pen is at the center.**
- With reduced motion enabled, all computed animation and transition durations
  were zero; replay announced **Replay shown without motion.**
- At 200% root text size, all tested routes retained zero horizontal overflow
  at both desktop and 390px.
- FAIL: **Read purchase terms** is only **180.8 × 20 CSS px**. All other visible
  interactive targets measured at least 44px in each dimension.

## Privacy, live identity, headers, and links

- The complete fresh landing → demo → draw/save/reset → real practice →
  draw/save/export/import/reload flow made requests only to
  `https://touch-canvas-drills.sociobot.in`. No analytics, CDN script/font,
  artwork upload, or undocumented origin was observed.
- A returned invalid token was stripped from the URL, stored under the
  documented key, checked with Sociobot, and rejected. Notes stayed disabled,
  printing stayed absent, and free save/PNG/JSON controls remained available.
- The verification endpoint allowed **30 requests per current window**.
  Request 31 returned **429** with **`Retry-After: 3`**.
- The checkout endpoint returned **303** to an HTTPS
  `checkout.dodopayments.com/session/...` URL.
- HTML uses `Cache-Control: no-cache`; hashed JS/CSS/art use
  `public, max-age=31536000, immutable`; `sw.js` uses `no-cache`. Live headers
  include HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer
  policy, and a CSP limited to self plus the documented Sociobot API. The
  manifest is served as `application/octet-stream`, but Chromium parsed it
  without errors and reported no installability errors.
- Every internal link discovered across the public routes returned 200; the
  unknown route returned the styled page with HTTP 404. Canonical, description,
  Open Graph, Twitter, favicon, robots, and sitemap metadata were present.
- Candidate and live SHA-256 values matched for HTML
  (`58505be8148774b4b03aa92cd0d95add1615b56e00144d71dfa4f2165a31101b`),
  JS (`a7ca07273831b8d1a1cb278eef96012984eba616fab5e03fc9e3b679b7795f12`),
  CSS (`e53dfcdf9470d0104daaae476d5ecbddd83eda05dcdc9fd5551488bab1112cde`),
  hero WebP (`e063724ef106476b622830421a317fbf7bcefee1adff57531d2e009ca7d17103`),
  and service worker
  (`a75643d0014464598e89b1a822344595e9c4472d5f787ec2eeeebf0e77a2d3d3`).

## PWA and performance

- Chromium reported no installability errors. The manifest has standalone
  display, a versioned start URL, and valid 192/512 maskable icons. The social
  image is 1200 × 630 and the Apple touch icon is 180 × 180.
- The service worker activated, controlled a fresh client, precached the app
  routes and hashed assets, and completed an explicit update check without a
  false first-install toast. The suite's genuine successor-worker test also
  passed update notification and activation.
- After one online landing visit, direct `/practice`, reload, `/demo`, sample
  data, and Reset demo all worked offline with no errors, including after the
  ordinary HTTP cache was cleared.
- Live throttled-mobile Lighthouse: **performance 96, accessibility 100, best
  practices 100, SEO 100**; FCP 1.00 s, LCP 1.90 s, speed index 1.04 s, CLS 0,
  and TBT 208 ms. Browser Event Timing measured the largest tested interaction
  at **24 ms**.

## Defects by severity

- Critical: none.
- High: none.
- **Medium / release blocking — V7-01:** The landing page's **Read purchase
  terms** link is 20px high instead of the required minimum 44px touch target.
  Increase its clickable box to at least 44 × 44 CSS px at desktop and mobile,
  add an all-interactive-target regression test, redeploy, and reverify.
- Low: none.

Pre-existing unrelated `graphify-out/*` changes in `/work/repo` were preserved
and excluded from the verification commit.
