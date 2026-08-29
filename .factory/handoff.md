# Touch Canvas Drills polish 1 handoff

## Result

PASS. All nine findings in `.factory/review-1.md` are fixed. There were no
earlier review or polish reports. The released artifact remains a static,
offline-first Vite PWA and retains its cassette-era zine visual system.

The primary sample action now opens `/?demo=1` directly. It shows the persistent
demo banner, 20 drills, and two replayable sessions. Demo writes use only the
`demo:touch-canvas-drills:data` namespace. Reset restores the samples; leaving
demo through either the banner or site navigation deletes demo data before the
next route opens.

The landing headings and sample button now use the exact plain wording from the
review. Route metadata is complete and route-specific. Navigation announces
and focuses each new h1. The direct 404 keeps a real HTTP 404 response while
using the same header, footer, legal links, visual identity, and complete
metadata as the application.

## Verification

- Repair implementation commit: `c33a27c` (pushed to `origin/main`).
- Clean clone: `npm ci` completed with zero vulnerabilities.
- Clean clone: all 19 exact commands from `.factory/claims.json` passed one by
  one, selecting one passing claim test each.
- `npm run test:all`: lint passed; TypeScript passed; 1 Vitest unit test passed;
  production build passed; the Playwright suite passed.
- Playwright Axe: no serious or critical violations on `/`, `/?demo=1`,
  `/demo`, `/practice`, `/privacy`, `/terms`, or the static 404.
- Privacy: `@claim:privacy-local` observed only same-origin requests while the
  demo loaded, drew, saved, and reset.
- Offline: `@claim:offline-reload` opened an unvisited `/practice` route after
  the browser went offline.
- Mobile: 390×844 first action remained above the fold; navigation, demo, and
  footer targets were at least 44 px; 200% text had no horizontal overflow.
- Output budgets: initial JS 29.79 KB / 11.00 KB gzip; CSS 9.51 KB / 2.85 KB
  gzip; hero WebP 177.28 KB.
- Local Lighthouse mobile: performance 98, accessibility 100, best practices
  100, SEO 100; LCP 2.4 s, CLS 0, total blocking time 0 ms.
- Live Lighthouse mobile: 100 in all four categories; LCP 1.8 s, CLS 0,
  total blocking time 0 ms.
- `/opt/fleet/lib/verify-url.sh` against the live root returned HTTP 200 with no
  console errors, `lang=en`, one h1, one main, no missing alt text, and no
  unlabeled buttons.
- Cold live route check: all product routes returned 200; an unknown path
  returned HTTP 404; every route had its expected title/canonical, full social
  metadata, one h1/main, zero mobile overflow, and zero serious/critical Axe
  findings.

Screenshots and the finding-by-finding evidence map are in
`.factory/evidence/polish-1/` and `.factory/polish-1.md`.

## Deploy

- Command: `/opt/fleet/lib/deploy-static.sh touch-canvas-drills dist`
- Azure Static Web Apps deployment ID:
  `be09c254-0183-4c33-b4cd-121df7da06c9`
- Live URL: <https://touch-canvas-drills.sociobot.in>
- Cold live checks completed: 2026-08-29 UTC.

## Known gaps and next steps

None.
