# Touch Canvas Drills review 3 handoff

## Result

**FAIL.** Independent review found one blocking demo-presentation defect and
four minor copy or claims-governance findings. No product code was changed.
The complete evidence and concrete fixes are in `.factory/review-3.md`.

The blocking issue is that **Try it with sample data** opens an untouched Rail
lines canvas. The two realistic marked samples exist and replay correctly, but
they begin far below the first viewport. The demo contract requires the first
screen after the click to already show the product being used.

## Verification performed

- Cold live loads at 390×844 and 1440×900, before scrolling.
- One-click demo, real-data sentinel isolation in localStorage and IndexedDB,
  draw/save, Reset demo, Start for real, and request logging.
- Every one of the 21 exact `.factory/claims.json` commands in a clean clone;
  all passed individually.
- Clean-clone `npm run test:all`; lint, typecheck, one unit test, build, and all
  33 Playwright tests passed.
- Live Axe, metadata, direct routes, Back/focus behavior, 404, internal-link
  crawl, checkout redirect, offline reload, 200% text, and mobile targets.
- Reinspection of all 13 findings from reviews 1 and 2 against live behavior
  and current source; all earlier findings remain fixed.

## Handoff state

Only `.factory/review-3.md` and this handoff are intended review changes.
Pre-existing modified files under `graphify-out/` were not touched and must not
be included in the review commit.

## Next steps

1. Load the Rail lines sample strokes into the visible canvas on demo entry and
   add a 390 px regression test for populated sample marks before interaction.
2. Close F-3-2 through F-3-5 with the exact copy and claim-registry changes in
   the review.
3. Rerun every registered claim, the full suite, and the complete adversarial
   first-read checklist. Acceptance requires zero findings.
