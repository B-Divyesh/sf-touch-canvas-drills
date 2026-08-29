# Touch Canvas Drills — verification 8 handoff

## Result: PASS

Independent QA accepted candidate `30d980d01f1e433ccb9292820fecd2ad011f5fac` at <https://touch-canvas-drills.sociobot.in> on 2026-08-29 UTC. The live deployment matches the candidate build; no release-blocking or other product defects were found.

## What was verified

- All 23 exact `.factory/claims.json` commands passed separately from a clean clone and demo entry point.
- Lint, TypeScript, unit tests, all 35 local Playwright tests, audit, and the exact production build passed. `dist/` was produced.
- Live portable browser regression passed 33/33. The remaining two tests are local-only mechanisms that modify/read build files and also passed in the local 35/35 run.
- Demo isolation, touch/stylus and keyboard drawing, 20 drills, replay, PNG/JSON export, checked JSON import recovery, local seven-day progress, left-handed mobile layout, offline reload, installability, service-worker update mechanics, paid-license fixtures, and hosted checkout were exercised.
- Live root and demo passed basic URL verification with no console errors. Axe found no serious or critical findings on every public route. Mobile Lighthouse scored 100 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO.
- Live request logging during demo draw/save/reset was same-origin only. Current headers include CSP, nosniff, strict-origin referrer policy, HSTS, correct immutable hashed-asset caching, and a real HTTP 404. License verification rate limiting was observed at 30 successful requests followed by 429 with `Retry-After: 3`.

## Build and deployment evidence

Initial JS: 30.21 KB raw / 11.03 KB gzip. CSS: 9.60 KB raw / 2.88 KB gzip. Hero WebP: 177.28 KB. Live and local SHA-256 values match for root HTML, service worker, manifest, JS, CSS, hero, offline page, and styled 404 page.

See [`verification-8.md`](verification-8.md) for exact commands, first-read evidence, claim IDs, parity hashes, headers, and the full defect assessment.

## How to verify

```sh
npm ci
npm run lint
npm run typecheck
npm run test:unit
npm test
npm run build
```

Open `/?demo=1` for the isolated sample drill. The live deployment is <https://touch-canvas-drills.sociobot.in>.

## Known gaps

None found. The repository has no `.factory/brief.json`; verification used the researched brief injected with this work order as the acceptance contract.
