# Independent verification — FAIL

**Candidate:** `64397278d69c6397bc9cf073443c35869b43ead5`  
**Live URL:** https://touch-canvas-drills.sociobot.in  
**Verified:** 2026-08-28

The deployed files byte-match the candidate build (`index.html`, `assets/app.js`,
`assets/index.css`, `sw.js`, and `manifest.webmanifest` all had matching
SHA-256 values). This is therefore a candidate/deployment-contract failure,
not a stale deployment.

## Decision

**FAIL — do not release.** The offline promise is false in the ordinary
first-visit path, demo data is retained after leaving demo mode, keyboard-only
users cannot perform the core drawing action, required mobile touch targets
are undersized, and the live deployment omits the configured security and
caching policy.

## First-read result

Cold-load text on `/` says: “Practice touch drawing with short drills,” names
people learning on a phone or tablet, and leads with **Try it with sample
data** (“Starts a ready-to-draw sample drill.”). This passes the plain-words
and one-click demo gate. `/demo` loads a ready-to-draw Rail lines sample with
the persistent demo banner.

## Required claim tests (fresh install, demo entry point)

`npm ci` completed successfully. All commands declared in
`.factory/claims.json` passed locally:

| Claim | Exact command | Result |
| --- | --- | --- |
| 20 guided drills | `npm test -- --grep @claim:twenty-drills` | PASS (1 test) |
| PNG export | `npm test -- --grep @claim:png-export` | PASS (1 test) |
| strokes stay local | `npm test -- --grep @claim:privacy-local` | PASS (1 test) |
| offline reload | `npm test -- --grep @claim:offline-reload` | PASS (1 test) |

The last test is insufficient: it reloads online before setting offline,
which dynamically caches `/demo`. The ordinary first-visit sequence below
does not work and contradicts the public claim.

## Local quality gates

- `npm run test:unit`: PASS (1/1).
- `npm test`: PASS (5/5).
- `npm run build`: PASS; `dist/` generated.
- No separate lint/type-check command exists; the build runs `tsc -b`.
- Built initial JS is 7.91 KB gzip and CSS 2.60 KB gzip; hero WebP is 177 KB.
- Live console/page-error capture during landing, demo, draw, save, reset, and
  export: no errors.
- Axe on live `/demo`: no serious or critical findings (one moderate `region`
  finding). Lighthouse mobile run produced Performance 97 and Accessibility
  100, LCP 1.04 s, CLS 0, TBT 185 ms; Lighthouse then reported a
  `TARGET_CRASHED` full-page-screenshot runtime error, so those scores are
  informative rather than a clean Lighthouse completion.

## End-to-end evidence

On desktop `/demo`, drawing a pointer stroke enabled Replay and Save; saving
raised the calendar from two seeded sessions to three; `Export PNG` downloaded
`rail-lines.png`; Reset returned the sample calendar to two sessions; blank
license submission said “Paste a license token first.” The privacy request log
through demo reset contained only same-origin document, JS, and CSS requests.

On a 390px viewport there was no horizontal overflow (390px scroll/client
width) and the visible focus ring was a 4px `rgb(7, 93, 140)` outline. Drill
selection is keyboard-operable. The core drawing surface is not.

The live product-unlock verification endpoint answered 200 for the first 30
sequential invalid-license requests, then request 31 answered **429** with
`Retry-After: 4` (and `X-RateLimit-After: 4`). Observed allowance: 30 requests
per current window.

All internal landing links returned 200. The third-party checkout link was not
followed because doing so starts a purchase flow.

## Release-blocking defects

### H1 — “Works offline after the first visit” is false for the normal path

Reproduction on the live candidate in a fresh browser context:

1. Open `/` online and wait until the service worker controls the page.
2. Reload once online (to eliminate activation timing).
3. Set the browser offline and navigate to `/practice`.

Expected: the practice pad, because this is the product reached from the
landing page after the first visit. Actual: status 200 but the offline fallback
renders `<h1>You are offline.</h1>`. The worker precaches `/` but neither
`/practice` nor `/demo`; it caches routes only after an extra online visit.
This directly contradicts the landing/README offline claim and fails the PWA
acceptance path. The exact declared test passes only because it first reloads
`/demo` online, thereby warming that route.

### H1 — Demo data is not discarded on “Start for real”

`Start for real` removes only localStorage. After using it, localStorage has no
demo key, but IndexedDB database `touch-canvas-drills`, store `practice`, still
contains `demo:touch-canvas-drills:data` and its two sample sessions. This
contradicts both the persistent banner (“nothing is saved”) and `.factory/demo.md`
(“discarded when you leave demo mode”), and fails the separate-sandbox contract.

### H1 — Keyboard-only users cannot draw

The core `<canvas>` has `role="img"` and no tabindex. Tab order moves directly
from drill 20 to Clear marks/Export PNG; it never reaches the drawing surface.
There is no alternate keyboard stroke input. Thus a keyboard-only user can
select drills but cannot perform the real job-to-be-done or save/replay a new
mark, contrary to the accessibility acceptance contract.

### H1 — Security/caching deployment configuration is not shipped

`staticwebapp.config.json` is present at repository root but absent from
`dist/` after the exact build. Correspondingly, every live route and asset has
no `Content-Security-Policy`; `assets/app.js`, CSS, and the service worker use
`Cache-Control: public, must-revalidate, max-age=30`, not the required
long-lived immutable caching for hashed assets. The intended header config is
therefore not applied to the deploy. This is fresh live evidence, not merely a
source inspection.

### H1 — Mobile touch targets fail the 44px baseline

At 390px, measured controls include the header wordmark 93x24, Demo 42x20,
Practice 60x20, Privacy 54x20, Reset demo 105x32, Start for real 114x32,
footer Privacy 52x16, and Terms 42x16. These are primary navigation and demo
controls, not decorative content. The product targets Android touch learners,
so this is a material accessibility/usability failure.

## Other defects

### M1 — Saved strokes have no replay UI

The product persists session strokes, but the calendar only shows counts.
Replay operates only on the in-memory current stroke; after refresh/tab close
there is no way to select or replay a saved session. This does not deliver the
brief’s “simple stroke replay” as a durable practice feature.

### M2 — Several named shape drills render the generic circular guide

`triangle-trio`, `diamond-grid`, and `leaf-pair` use guide values not handled
by `drawGuide`; they fall into its generic circle branch. The label and cue
therefore describe a different exercise from the guide the learner sees.

### M3 — Required claims registry is incomplete

Visitor-reliant landing and README claims such as “Free core drills; $6
one-time extras,” paid notes/printable sheet, seven-day calendar, replay, and
the no-account/no-upload statement have no corresponding claim entry/test in
`.factory/claims.json`. The claims contract requires every such claim to be
listed and proven in the demo sandbox.

### M4 — Deep unknown routes return HTTP 200

`/not-a-real-route` visually renders the SPA’s not-found screen but responds
200 with `index.html`, not the specified real 404 response/status. The
repository’s `public/404.html` and static-host override are not active in the
deployed artifact.

## Recommended repair and re-verification

1. Precache or navigation-fallback `/practice` and `/demo` from the first
   service-worker install; add a test that starts at `/`, goes offline, then
   opens `/practice` without an online route warm-up.
2. Delete the demo IndexedDB key/store data on Reset/Start for real; test both
   storage layers from a fresh demo context.
3. Provide a usable keyboard drawing mechanism (or an equivalent accessible
   input flow) and meet all 44x44 mobile target sizes.
4. Ship the host config with `dist/` (or configure deployment equivalently),
   enforce CSP and immutable cache headers, and prove live headers.
5. Add replay of saved sessions, correct the shape guides, and add sandbox
   tests for every visitor-facing claim.
