# Touch Canvas Drills — review 4 handoff

## Result: FAIL

Adversarial review 4 evaluated candidate
`3f13c9864d6d4bc5fa9c7f04dc482aea77bab2ce` and the matching live deployment
at <https://touch-canvas-drills.sociobot.in> on 2026-08-29 UTC. Six findings
remain in [review-4.md](review-4.md): one high-severity claim-proof gap and five
minor copy or claims-governance gaps. No product code was modified.

## What was done

- Opened the live site cold at 390×844 and 1440×900 and recorded the first-read
  answers before scrolling.
- Audited every landing and README copy unit with word counts, terminology,
  heading, action-label, jargon, and claims checks.
- Exercised the one-click demo, visible sample marks, reset, exit, localStorage
  and IndexedDB isolation, a real-data sentinel, request logging, and offline
  behavior.
- Ran all 23 exact claim commands separately from a clean clone. Every command
  passed; F-4-1 documents that the passing merchant/refund test only asserts
  its own copy and does not prove the legal claim.
- Rechecked all 18 findings from reviews 1–3 against live behavior and source.
  All remain fixed.
- Checked direct routes, history/focus, titles, metadata, real 404 behavior,
  internal links, checkout redirect, response headers, candidate/live hashes,
  mobile targets, keyboard use, reduced motion, and Axe.

Evidence is under `.factory/evidence/review-4/live/`.

## How to verify

```sh
npm ci
npm run test:all
```

Run each command in `.factory/claims.json` separately from a clean clone. Open
`/?demo=1` at 390×844 to confirm that the first viewport already contains the
coral Rail lines sample, then reset and leave the demo while checking both
browser storage namespaces.

## Known gaps

- F-4-1: the merchant/refund claim lacks independent observable proof.
- F-4-2: browser-data deletion is an unlisted privacy claim.
- F-4-3: Android compatibility is asserted without a registered platform test.
- F-4-4: “core drills” is undefined first-screen pricing copy.
- F-4-5: user drawings switch between “marks” and “strokes.”
- F-4-6: “Draw for one timer” is not a clear standalone heading.

Pre-existing modifications under `graphify-out/` were not changed or included
in the review work.
