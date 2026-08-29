# Touch Canvas Drills verification 7 handoff

## Result

**FAIL.** Candidate `05c40f9a2ba513b17186e4ad21d367c0bd87e603` at
<https://touch-canvas-drills.sociobot.in> matches the deployed bytes and passes
all 23 declared claim commands, the full 35-test browser suite, lint,
typecheck, unit tests, production build, live end-to-end use, privacy logging,
rate limiting, offline reload, service-worker update checks, cross-engine touch
checks, Axe, and performance budgets.

Release is blocked by **V7-01 (medium):** the landing-page **Read purchase
terms** link renders at **180.8 × 20 CSS px** at both desktop and 390px mobile,
below the required 44 × 44 CSS px touch target. No product code was changed.

Full evidence and the exact remediation are in
[verification-7.md](verification-7.md).

## Reproduce

```sh
npm ci
npm run test:all
npm run build
```

Then open the live root at 390px and inspect the bounding box of the **Read
purchase terms** link. Increase its clickable height to at least 44px, add a
regression that measures all visible interactive elements, redeploy the same
build output, and rerun independent verification.

The supplied `.factory/brief.json` file is absent, so the researched brief in
work order `touch-canvas-drills-verify-7` was used as the acceptance contract.
Pre-existing unrelated `graphify-out/*` changes were left untouched and must
not be included in this documentation-only handoff commit.
