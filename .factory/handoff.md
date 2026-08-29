# Touch Canvas Drills repair 4 handoff

## Result

**PASS — V7-01 is repaired and deployed.** This repair addresses the sole
release-blocking finding in independent verifier report
[`verification-7.md`](verification-7.md) for candidate
`05c40f9a2ba513b17186e4ad21d367c0bd87e603`.

Repair commit: `e9fe371` (`fix: meet touch target minimum`), pushed to
`origin/main` and deployed on 2026-08-29 UTC as Azure Static Web Apps deployment
`7bfbfe3c-a9e2-4da6-a288-bdeb676027ee`.

## What changed

V7-01's root cause was an inline landing-page **Read purchase terms** anchor.
It inherited normal link line height and measured 180.8 × 20 CSS px at desktop
and 390px mobile.

- Added a pricing-link rule that makes that existing terms link an inline-flex
  control with a 44 × 44 CSS px minimum target, without changing its label,
  route, payment flow, visual system, or the free/paid feature boundary.
- Replaced the narrow header/demo/footer check with a regression that scans
  every visible link, button, form control, role-button, and keyboard-operable
  widget across `/`, `/?demo=1`, `/demo`, `/practice`, `/privacy`, `/terms`,
  and `/404.html` at 1440px desktop and 390 × 844 mobile. Any target below 44px
  in either dimension fails the test.

Exact local measurement after the repair: **180.796875 × 44 CSS px** at both
1440px desktop and 390px mobile. The full target regression passed.

## Verification

From a clean dependency install in `/work/repo`:

```sh
npm ci
npm run test:all
npm audit --audit-level=high
npm run build
```

- `npm ci`: 161 packages installed; 0 audit vulnerabilities.
- `npm run test:all`: PASS — ESLint, TypeScript, 1/1 Vitest test, production
  build, and **35/35 Playwright tests**.
- Each of the **23** exact commands in `.factory/claims.json` was run
  separately; all passed, with one selected test per claim.
- `npm audit --audit-level=high`: PASS — 0 vulnerabilities.
- Final build: JS 30.21 KB raw / 11.09 KB gzip; CSS 9.60 KB raw / 2.87 KB gzip;
  hero WebP 177.28 KB. `dist/index.html` is at the output root.
- Factory URL verification on local production root: HTTP 200, 545ms load, no
  console errors, `lang=en`, one h1, one main, complete image alternatives, and
  labeled buttons.
- Local mobile Lighthouse on `/?demo=1` (Lighthouse 12.8.2, full-page
  screenshot disabled): Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 904ms, LCP 1504ms, CLS 0, TBT 27ms.
- Full browser coverage includes desktop and 390px mobile, keyboard drawing,
  reduced motion, 200% text, touch targets, privacy request logging, demo
  isolation, offline reload, PWA install, genuine successor-worker update,
  exports/import validation, licensing, and checkout behavior. Playwright Axe
  found no serious or critical violations across all public routes.

## Deployment and live verification

The existing static PWA deployment class was retained. The final `dist/` was
uploaded with its existing `staticwebapp.config.json`; no product behavior,
DNS target, billing setup, or paid-product mapping changed.

- `/opt/fleet/lib/verify-url.sh` passed live root (773ms) and live demo (746ms),
  with no console errors and complete title/language/landmark/alternative-text
  checks.
- A live Playwright run passed 6/6: full-route Axe, the complete desktop/mobile
  target scan, and the `privacy-local`, `offline-reload`, `pwa-install`, and
  `keyboard-drawing` claims.
- Live and local SHA-256 values match for `index.html`
  (`fae588d73a6a92c6f44fed2188ce1a176781c1013722a7e953159ec483212520`),
  JS (`a7ca07273831b8d1a1cb278eef96012984eba616fab5e03fc9e3b679b7795f12`),
  CSS (`4e66a1c3473438ca5af73ad56af1d361a459c94f8dc12a137da0eb6b83da3373`),
  hero WebP (`e063724ef106476b622830421a317fbf7bcefee1adff57531d2e009ca7d17103`),
  and service worker (`4e8c3d876369f64705cd30bcfee6b9c1b600486cbaa511c4c52a718745d07de3`).
- Live root sends `Cache-Control: no-cache`, the configured self-only CSP,
  `nosniff`, strict-origin referrer policy, and HSTS. Hashed assets are
  immutable; `sw.js` is `no-cache`; an unknown route returns HTTP 404.
- The public Sociobot checkout endpoint returned HTTP 303 to HTTPS hosted Dodo
  checkout, preserving the existing payment path.

## Known gaps

None. `.factory/brief.json` remains absent, as noted by the verifier; the
researched scope embedded in the work order and all previously passing behavior
were preserved. Pre-existing unrelated `graphify-out/*` working-tree changes
were left untouched and excluded from both repair commits.
