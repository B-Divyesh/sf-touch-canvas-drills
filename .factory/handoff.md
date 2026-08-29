# Touch Canvas Drills — review 5 handoff

## Result: FAIL

Adversarial review 5 was completed against source
`d238a6ed8cd6b231930358e74ce9c54884f497a8` and the live deployment at
<https://touch-canvas-drills.sociobot.in> on 2026-08-29 UTC. Product code was
not changed. The full report is `.factory/review-5.md`.

## What was done

- Repeated the cold first-read at 390×844 and 1440×900.
- Extracted and counted every landing/README copy unit.
- Exercised the one-click demo with visible sample marks, Reset, Start for
  real, a real-data sentinel in localStorage and IndexedDB, and a complete
  request log.
- Ran all 23 exact `.factory/claims.json` commands separately after `npm ci`
  in a clean clone.
- Ran `npm run test:all` in that clone: lint, typecheck, 1 unit test, build,
  and 35 Playwright tests passed.
- Rechecked all 24 earlier finding IDs in live behavior and current source.
- Checked route metadata, a real 404, internal links, history/focus, Axe,
  offline behavior, visual identity, and missed leverage.
- Confirmed the live JavaScript SHA-256 equals the clean build artifact.

## Findings left

Seven high-severity claim-proof gaps remain: `paid-extras`, `twenty-drills`,
`png-export`, `local-progress`, `free-core`, `privacy-local`, and
`demo-isolation` have passing commands but incomplete assertions. The deployed
product behavior checked in this round is sound; the registered tests do not
fully protect the promises from regression.

## How to reproduce

```sh
npm ci
npm run test:all
npm test -- --grep @claim:<claim-id>
PLAYWRIGHT_BASE_URL=https://touch-canvas-drills.sociobot.in npx playwright test --grep 'routes set complete metadata|every product route'
```

Open `/?demo=1` at 390×844. The two coral Rail lines marks should be visible
in the first viewport. Seed both `touch-canvas-drills:data` stores before demo
entry to verify that Reset and Start for real preserve real work.

## Repository state

Only `.factory/review-5.md` and this handoff are intended for the review
commit. Four pre-existing modified `graphify-out` files were left untouched.
