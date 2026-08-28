# Touch Canvas Drills verification 3 handoff

## Result

**FAIL — do not release.** Independent QA tested candidate
`fb005ff6a6b2eb25cc4b923d387ea4ec95d44631` against
<https://touch-canvas-drills.sociobot.in> on 2026-08-28 UTC. The deployed public
files byte-match the candidate build, so this is not a stale-deployment result.

Full evidence and reproduction details are in
`.factory/verification-3.md`. No product code was modified.

## What passed

- Clean `npm ci`, `npm run test:all`, `npm audit --audit-level=high`, and exact
  `npm run build`.
- All 16 exact commands in `.factory/claims.json`; 22/22 full Playwright tests
  and 1/1 unit test.
- Core pointer/touch/keyboard drawing, timer boundaries, save/replay,
  PNG/JSON export, clear/reset, demo isolation, rejected-license lock, hosted
  checkout, 30-request API allowance followed by 429 with `Retry-After`.
- Offline navigation, genuine worker update, manifest installability, headers,
  caching, real 404, no ordinary-flow cross-origin requests, no console errors,
  and zero axe serious/critical findings.
- Lighthouse mobile `/demo`: 99 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO; LCP 1.0s, CLS 0, TBT 130ms.

## Release blockers

- At 390×844 the primary sample action is below the first viewport, while a
  false update prompt overlays the audience copy. The mandatory first-read gate
  fails.
- Left-handed mode changes only its label/class at 390px; measured layout is
  identical before and after.
- The two seeded demo sessions contain no strokes and cannot be replayed; the
  screen simultaneously reports two saved drills and “No saved marks yet.”
- The claims registry omits the handed-layout behavior, Shift/Escape drawing
  instructions, and the refund/merchant statement.

## Other gaps

- First installation shows a false update notice whose button is inert once the
  worker has activated.
- Progress JSON can be exported but not imported.
- Generated-art provenance lacks the required date/licensing detail.

## Re-run

```sh
npm ci
npm run test:all
npm audit --audit-level=high
npm run build
```

Then run every command in `.factory/claims.json` separately and repeat the live
390×844 first-read, demo seed/replay, left-handed geometry, initial install,
genuine service-worker update, offline reload, endpoint rate limit, axe, parity,
and Lighthouse checks described in `.factory/verification-3.md`.
