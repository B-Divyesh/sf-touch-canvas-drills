# Touch Canvas Drills repair 3 handoff

## Result

All release blockers and lesser findings in `.factory/verification-3.md` were
reproduced and repaired for work order `touch-canvas-drills-repair-3`. The
artifact remains a static offline-first PWA, and the approved $6 Sociobot
one-time purchase mapping is unchanged.

Before repair, the exact 390×844 reproduction measured the sample action at
`y=850.875` (outside the 844px viewport), showed a false fresh-install update,
left deck/list rectangles unchanged after the handed toggle, and found demo
stroke counts `[0, 0]` with zero replay actions.

## Repairs

- The phone first screen now omits nonessential hero art. The complete primary
  action ends at `y=472.9375` on a 390×844 viewport with no horizontal overflow.
- Left-handed mode now moves the drill list before the deck on phones, reverses
  the deck control flow, and persists after reload.
- Both bundled demo sessions now contain plausible multi-point marks and can be
  replayed. Reset returns to Rail lines, and Start for real also clears transient
  demo marks.
- Shift distance, Escape clearing, handed layout, sample replay, progress import,
  and merchant/refund wording are registered in `.factory/claims.json` with one
  exact tagged test each.
- Fresh service-worker installation no longer creates an update notice. A real
  successor worker still shows the notice, activates, reloads, and replaces the
  old cache. The cache version is `touch-drills-v4`.
- Progress JSON export now omits license data. Import accepts files up to 2 MB,
  validates drill IDs, dates, counts, coordinates, timing, colors, widths, and
  notes, merges sessions without deleting existing progress, and reports errors
  in a live region.
- Generated-art records now state the 2026-08-28 generation date, original
  factory-image provenance, and repository MIT license.
- The product version and visible build identity are `1.0.3`.

## Verification evidence

- Clean `npm ci`: 161 packages, 0 vulnerabilities.
- `npm run test:all`: PASS — ESLint, TypeScript, 1/1 Vitest, production build,
  and 27/27 Playwright tests.
- All 19 commands in `.factory/claims.json` were run separately: PASS, exactly
  one selected test per claim.
- `npm audit --audit-level=high`: PASS, 0 vulnerabilities.
- Exact `npm run build`: PASS; `dist/` contains root `index.html`. Initial JS is
  28.50 KB raw / 10.66 KB gzip, CSS is 9.51 KB raw / 2.85 KB gzip, and the hero
  WebP is 177.28 KB.
- Browser coverage: desktop and 390×844 mobile landing/demo/practice; pointer,
  touch-sized controls, keyboard-only drawing, 200% text, no horizontal overflow,
  reduced motion, invalid license, JSON round-trip/rejection, and demo isolation.
- Accessibility: Playwright axe found zero serious/critical findings across `/`,
  `/demo`, `/practice`, `/privacy`, and `/terms`. The factory URL verifier on
  local production `/demo` reported title, `lang=en`, one h1, one main, no
  missing image alternatives, no unlabeled buttons, and no console errors.
- Privacy: the ordinary demo draw/save/reset flow made same-origin requests only.
  License verification remains limited to `https://api.sociobot.in`.
- PWA: first-visit offline navigation to an unvisited `/practice` passed; fresh
  install and genuine waiting-worker update regressions passed.
- Lighthouse 12.8.2 mobile production `/demo` with full-page screenshot disabled:
  Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.5s,
  CLS 0, TBT 30ms. INP is not produced for this lab navigation.

## Run locally

```sh
npm ci
npm run test:all
npm audit --audit-level=high
npm run build
npm run preview
```

## Deployment

Target: Azure Static Web App `sf-touch-canvas-drills` in resource group
`sociobot`, using the production `dist/` artifact and its
`staticwebapp.config.json`.

- Repair commit `32d94fd` was pushed to `origin/main` and deployed to the
  production Static Web App on 2026-08-28 UTC. The CLI's generated local
  credential file was deleted immediately after deployment.
- All 15 public files byte-match the final local `dist/`, including the worker,
  icons, art, offline/404 pages, and hashed assets. Local/live `index.html`
  SHA-256 is `3a6d02c7cd82084388fbf5af231cef519b796d76f55118cab8c986690d2a2f05`.
- Live shell responses are `no-cache`; hashed JS/CSS are
  `public, max-age=31536000, immutable`; `sw.js` is `no-cache`. CSP, HSTS,
  `nosniff`, and strict-origin referrer headers are present. An unknown route
  returns HTTP 404.
- Live 390×844 evidence: primary action bottom `472.9375`; no initial update
  notice; demo sample stroke counts `[2, 2]`; two replay buttons; right-handed
  deck/list y positions `282.1875/1003.5`; left-handed positions
  `640.1875/282.1875`; no console or cross-origin ordinary-flow requests.
- Live `/`, `/demo`, `/practice`, `/privacy`, `/terms`, and the styled 404 have
  route titles, one h1, one main, and zero axe serious/critical findings. The
  live factory URL verifier measured `/demo` at 571ms with no console errors.
- Live Lighthouse mobile `/demo`: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; LCP 0.9s, CLS 0, TBT 10ms.
- Live Sociobot checkout returned HTTP 303 to an HTTPS Dodo checkout session.
  Invalid-license requests 1–30 returned 200; request 31 returned 429 with
  `Retry-After: 3`, confirming the live response limit.

## Known gaps

No release-blocking product gaps are known. `.factory/brief.json` was absent at
the supplied base commit; the existing researched behavior and visual thesis
were preserved from the repository and verifier reports.
