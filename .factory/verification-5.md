# Independent verification 5 — PASS

**Candidate:** `30b2bf9b03fdadf0b9fdf1665ed99f39fe91be91`

**Live URL:** <https://touch-canvas-drills.sociobot.in>

**Verified:** 2026-08-29 UTC

**Artifact:** offline-first PWA

## Decision

**PASS — release accepted.** The live product matches the candidate, completes
the researched touch-drawing job on desktop and mobile, works offline, and
satisfies the supplied claims, demo, accessibility, privacy, security, and
performance contracts. Fresh verification found no defect at any severity.

No product code was changed during verification.

## Mandatory first-read gate

PASS on cold desktop and 390×844 mobile loads.

- What it does: “Practice touch drawing with short drills.”
- For whom: people learning to draw on a phone or tablet who want steadier
  marks without a desktop editor.
- What to click first: **Try it with sample data**. The adjacent explanation is
  “Starts a ready-to-draw sample drill.”
- On mobile the action occupied y=427.44–472.94, wholly inside the first 844px.
- One click opened `/?demo=1` with 20 drills, two marked and replayable sample
  sessions, and “Demo — sample data, nothing is saved.”

The first viewport also states the offline, local-storage, free-core, and $6
one-time-extra facts in plain words.

## Required claim tests

`.factory/claims.json` exists. From a detached clean checkout of the candidate,
`npm ci` completed first. Every listed command then ran separately through the
production demo/test entry point. All 19 claim IDs have exactly one matching
`@claim:` test tag.

| Claim ID | Exact command | Result |
| --- | --- | --- |
| `twenty-drills` | `npm test -- --grep @claim:twenty-drills` | PASS, 1 test |
| `png-export` | `npm test -- --grep @claim:png-export` | PASS, 1 test |
| `privacy-local` | `npm test -- --grep @claim:privacy-local` | PASS, 1 test |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS, 1 test |
| `pwa-install` | `npm test -- --grep @claim:pwa-install` | PASS, 1 test |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | PASS, 1 test |
| `keyboard-drawing` | `npm test -- --grep @claim:keyboard-drawing` | PASS, 1 test |
| `handed-layout` | `npm test -- --grep @claim:handed-layout` | PASS, 1 test |
| `saved-replay` | `npm test -- --grep @claim:saved-replay` | PASS, 1 test |
| `local-progress` | `npm test -- --grep @claim:local-progress` | PASS, 1 test |
| `progress-roundtrip` | `npm test -- --grep @claim:progress-roundtrip` | PASS, 1 test |
| `free-core` | `npm test -- --grep @claim:free-core` | PASS, 1 test |
| `paid-extras` | `npm test -- --grep @claim:paid-extras` | PASS, 1 test |
| `invalid-license-lock` | `npm test -- --grep @claim:invalid-license-lock` | PASS, 1 test |
| `checkout-redirect` | `npm test -- --grep @claim:checkout-redirect` | PASS, 1 test |
| `merchant-refunds` | `npm test -- --grep @claim:merchant-refunds` | PASS, 1 test |
| `license-daily-check` | `npm test -- --grep @claim:license-daily-check` | PASS, 1 test |
| `pressure-independent` | `npm test -- --grep @claim:pressure-independent` | PASS, 1 test |
| `first-mark-timer` | `npm test -- --grep @claim:first-mark-timer` | PASS, 1 test |

A copy review of the live landing, demo, practice, privacy and terms routes,
the manifest, and README found no visitor-facing claim outside this registry.

## Clean-checkout quality gates

- `npm ci`: PASS; 161 packages installed, 0 vulnerabilities.
- `npm run test:all`: PASS — ESLint, TypeScript, 1/1 Vitest test, exact
  production build, and 31/31 Playwright tests.
- Separate exact `npm run build`: PASS; `dist/` produced with root
  `index.html`.
- `npm audit --audit-level=high`: PASS; 0 vulnerabilities.
- Output: JS 29.79 KB raw / 10.93 KB gzip; CSS 9.51 KB raw / 2.86 KB gzip;
  hero WebP 177.28 KB. No font payload is downloaded. All budgets pass.

## Independent end-to-end exercise

- The query demo seeded exactly two sessions, each with two marks, while the
  real storage key remained absent.
- Pointer/touch drawing advanced the timer, enabled replay/save, and produced a
  third saved take. Refresh retained all three and exposed three saved replays.
- PNG export produced `rail-lines.png`, a valid 19,368-byte, 900×675 PNG.
- Progress export produced version-1 JSON with all three sessions and no
  license value.
- Reset restored exactly two bundled samples. **Start for real** opened an
  empty `/practice` and removed the demo key from localStorage and IndexedDB.
- A blank license produced “Paste a license token first.” Invalid JSON, a file
  over 2 MB, and a width beyond the accepted maximum each produced actionable
  errors without deleting saved work.
- Boundary import accepted 500 valid sessions with maximum allowed
  point/time/width values. It rejected 501 sessions and retained the 500.
- Drill 20, **Target rings**, accepted a mobile touch stroke. The 20-second
  timer stopped at `00:00` and announced replay/save without going negative.
- The existing claim suite additionally proves left-handed phone reordering,
  persistence, pressure independence, valid round-trip import, and valid paid
  note/print behavior.

## Accessibility, mobile, keyboard, and motion

- Fresh Playwright Axe runs on `/`, `/?demo=1`, `/demo`, `/practice`,
  `/privacy`, `/terms`, the real 404, and mobile demo found zero serious or
  critical issues; in fact, they found no Axe violations at any impact.
- All successful routes have `lang=en`, route-specific title/description and
  canonical metadata, one h1, one main, and no missing image alternative.
  The unknown route returns a real HTTP 404 with the styled recovery page.
- At 390×844 there was no horizontal overflow. At forced 200% text there was
  still no horizontal loss. Every visible interactive target measured at
  least 44×44 CSS pixels.
- Keyboard-only use reached the canvas in ordinary tab order. The first focus
  target was the visible 139×44 skip link; Enter moved focus to the h1. The
  drawing canvas had a 5px blue focus outline. Space, arrows, Shift+Arrow, and
  Escape drew and cleared marks without a trap.
- Under `prefers-reduced-motion: reduce`, no element retained a non-zero
  animation or transition duration, and replay immediately announced “Replay
  shown without motion.”
- `/opt/fleet/lib/verify-url.sh` passed the live root and query demo with no
  console/page errors, one h1, a main landmark, complete image alternatives,
  and named buttons. Measured loads were 755ms and 724ms.

## Privacy, headers, links, and paid endpoint

- The whole ordinary demo flow—load, sample replay, touch drawing, save,
  refresh, PNG/JSON export, invalid imports, reset, and leaving demo—made only
  same-origin requests. No analytics, CDN, external font, artwork upload,
  console error, or page error was observed.
- Static inspection found only the product origin and the documented Sociobot
  checkout/license origin. No Azure key, model endpoint, tracker, or external
  runtime script is embedded.
- HTML/routes send CSP, HSTS, `X-Content-Type-Options: nosniff`, and
  `Referrer-Policy: strict-origin-when-cross-origin`. CSP allows connections
  only to self and `https://api.sociobot.in`.
- Every internal link returned 200 as appropriate; the intentional unknown
  route returned 404. Checkout returned 303 to an HTTPS
  `checkout.dodopayments.com/session/...` URL.
- A fresh invalid returned license was stripped from the URL and checked once.
  The live 200 invalid verdict immediately left notes disabled and printing
  absent; reload made no second verification request.
- The license verifier returned 200 for requests 1–30 from one client. Request
  31 returned **429** with `Retry-After: 3`. Observed allowance: **30 requests
  per current window**.

## Deployment identity, caching, and PWA

- All 16 public files from the exact candidate build byte-match live,
  including HTML, hashed JS/CSS, hero art, manifest, worker, icons, social
  image, offline page, robots, sitemap, and the styled 404 assets. Local/live
  `index.html` SHA-256 is
  `f8bd3e2f00c914f584f063e5b098108dbfa427f77375f223fabd91e87a3b5953`.
- Shell routes are `no-cache`; hashed JS/CSS are
  `public, max-age=31536000, immutable`; `sw.js` is `no-cache`.
- The manifest uses standalone display, a versioned start URL, matching theme
  colors, and real maskable 192/512 icons. The social image is 1200×630.
- A fresh live install activated `touch-drills-v5`. After only landing setup,
  previously unvisited `/practice` and `/?demo=1` both loaded fully offline,
  including the canvas and two sample sessions.
- The exact-build service-worker regression installed a successor worker,
  showed the update action, activated it after the click, reloaded, and
  replaced the old cache. Fresh installation showed no false update notice.

## Performance

Fresh Lighthouse 12.8.2 mobile on the live query demo completed with no run
warnings: Performance **99**, Accessibility **100**, Best Practices **100**,
SEO **100**; FCP 1.0s, LCP 1.1s, TBT 110ms, CLS 0, Speed Index 1.0s, and TTI
1.2s. Lab navigation does not report INP.

## Conditional checks

The product has no sign-in, first-party backend, library, or CLI surface.
Entra authority, backend concurrency/health/persistence, and consumer-package
checks therefore do not apply. The only server endpoint in product scope is
the Sociobot license verifier, whose rate limit is recorded above.

## Defects by severity

- Release-blocking: none.
- High: none.
- Medium: none.
- Low: none.

## Source note

`.factory/brief.json` is absent at the candidate. The researched brief embedded
in work order `touch-canvas-drills-verify-5` was used as the acceptance source.
Pre-existing unrelated `graphify-out/*` changes in the shared checkout were
not edited or included in this verification.
