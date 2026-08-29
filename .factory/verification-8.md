# Independent verification 8 — Touch Canvas Drills

## Verdict: PASS

Verified candidate commit `30d980d01f1e433ccb9292820fecd2ad011f5fac` against the researched brief and the factory product contract on 2026-08-29 UTC.

- Live URL: <https://touch-canvas-drills.sociobot.in>
- Clean detached checkout: commit `30d980d01f1e433ccb9292820fecd2ad011f5fac`
- Deployment identity: live HTML, service worker, manifest, hashed JS/CSS, hero image, `404.html`, and `offline.html` match the clean production build byte-for-byte where publicly served.

The production deployment is the candidate, not a stale or deployment-only variant.

## First-read test

Cold-opening the live root at desktop produced the title **“Touch Canvas Drills — Practice touch drawing”** and the first-screen headline **“Practice touch drawing with short drills.”** It plainly says it is for people learning to draw on a phone or tablet, and says the outcome is steadier marks without a desktop editor. The visible primary action is **“Try it with sample data”**, immediately followed by **“Starts a ready-to-draw sample drill.”** One click opens the populated `?demo=1` sandbox. This passes the plain-words and one-click demo requirements.

## Required claim tests — PASS (23/23)

From a fresh clone and fresh `npm ci`, I ran every exact command declared in `.factory/claims.json` separately, before the broader QA run. Each selected its one tagged Playwright test and passed through the shipped demo entry point:

`twenty-drills`, `png-export`, `privacy-local`, `offline-reload`, `pwa-install`, `demo-isolation`, `keyboard-drawing`, `handed-layout`, `saved-replay`, `local-progress`, `progress-roundtrip`, `free-core`, `paid-extras`, `invalid-license-lock`, `checkout-redirect`, `merchant-refunds`, `license-daily-check`, `pressure-independent`, `first-mark-timer`, `deployment-policy`, `no-repository-credentials`, `paid-checkout-setup`, and `mit-license`.

This covers the normal drill flow plus boundary and recovery cases: malformed progress import retains restored data, an invalid/revoked license keeps paid controls locked, clearing restores empty controls, the timer starts only with a first mark, and pressure does not alter mark width.

## Local quality gates — PASS

Clean-clone commands and results:

| Command | Result |
| --- | --- |
| `npm ci` | PASS — 161 packages; 0 install audit vulnerabilities |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run test:unit` | PASS — 1/1 Vitest |
| `npm test` | PASS — 35/35 Playwright, including a genuine successor service-worker update simulation |
| `npm run build` | PASS; creates `dist/` |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities |

Production build budgets: initial JS is 30.21 KB raw / 11.03 KB gzip; CSS is 9.60 KB raw / 2.88 KB gzip; the hero WebP is 177.28 KB. These are within the static/PWA budgets.

## Live deployment and end-to-end checks — PASS

- Full portable live Playwright regression: **33/33 passed** at `https://touch-canvas-drills.sociobot.in`. This included demo entry, drawing, save/replay, PNG and JSON downloads, import rejection/recovery, keyboard drawing, left-handed 390px layout, paid-license fixtures, checkout redirect, privacy requests, offline reload, manifest/service-worker installation, touch-target scan, reduced motion, 200% text, and the first mobile viewport.
- The two suite tests deliberately excluded from that production run are local-build tests: one rewrites `dist/sw.js` to manufacture a successor worker, and one reads `dist/staticwebapp.config.json`. They pass in the full local 35/35 run. They cannot pass against a read-only static deployment and are not product failures.
- Live service worker: active and controlling scope `/`; `registration.update()` succeeds with no pending update for this current revision; cache is `touch-drills-v7`. After only visiting `/`, switching offline and opening `/practice` displayed **“Draw one guided mark”** with no console errors.
- Live source/build parity SHA-256 matched for `index.html` `fae588d73a6a92c6f44fed2188ce1a176781c1013722a7e953159ec483212520`, JS `a7ca07273831b8d1a1cb278eef96012984eba616fab5e03fc9e3b679b7795f12`, CSS `4e66a1c3473438ca5af73ad56af1d361a459c94f8dc12a137da0eb6b83da3373`, hero `e063724ef106476b622830421a317fbf7bcefee1adff57531d2e009ca7d17103`, and service worker `4e8c3d876369f64705cd30bcfee6b9c1b600486cbaa511c4c52a718745d07de3`.
- `verify-url.sh` passed on live root and `?demo=1`: HTTP 200, no console/page errors, valid title/lang, one `h1`, a `main`, complete image alternatives, and labelled buttons.
- Live mobile Lighthouse on the demo: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.0 s, CLS 0, TBT 40 ms.

## Accessibility, privacy, and headers — PASS

- Axe, independently run at 390px on `/`, `/?demo=1`, `/demo`, `/practice`, `/privacy`, `/terms`, and `/404.html`, found **zero serious or critical violations**. No console/page errors occurred.
- Keyboard-only drawing and Escape reset pass; all visible interactive targets are at least 44 × 44 CSS px on desktop and 390px mobile; reduced-motion replay provides live feedback; 200% text creates no horizontal overflow.
- During the complete demo draw/save/reset flow, the Playwright request log contained only the product origin. No account, artwork upload, analytics, or third-party asset request occurred. The only external product path is explicit Sociobot license verification/hosted checkout.
- Root and app routes return self-only CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and HSTS. HTML and `sw.js` are `no-cache`; hashed assets use `public, max-age=31536000, immutable`; unknown routes return HTTP 404.
- Hosted checkout returned HTTP 303 to HTTPS `checkout.dodopayments.com`, as claimed. The invalid-license verification endpoint is rate limited: 30 requests from this client returned 200 invalid verdicts; request 31 returned **429** with `Retry-After: 3` and `X-RateLimit-After: 3`.

## Defects

No release-blocking, major, minor, or informational product defects found.

## Scope notes

This is a static PWA, not a library, CLI, or sign-in product. It has no product backend beyond the explicit Sociobot checkout/license-verification integration; no Microsoft Entra sign-in flow is applicable.
