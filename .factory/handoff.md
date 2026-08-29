# Touch Canvas Drills — verification 9 handoff

## Result: PASS

Candidate `00490b4399a98a8309c033680973b7813a380943` is accepted at
<https://touch-canvas-drills.sociobot.in> on 2026-08-29 UTC. The live public
build byte-matches the candidate. No product code was changed.

## What was verified

- Mandatory cold first-read and one-click sample demo: PASS on desktop and
  390 x 844 mobile.
- All 23 exact `.factory/claims.json` commands: PASS from a clean detached
  clone after `npm ci`.
- `npm run test:all`: PASS — lint, typecheck, 1/1 unit test, build, and 35/35
  Playwright tests.
- Live portable Playwright suite: 33/33 PASS.
- Exact `npm run build` and `npm audit --audit-level=high`: PASS; `dist/`
  exists and the audit reports zero vulnerabilities.
- Desktop, mobile, keyboard-only, Android touch, WebKit mobile touch, reduced
  motion, 200% text, 44px targets, route metadata, real 404, privacy, license
  rejection, invalid import recovery, and timer boundaries: PASS.
- Axe on seven desktop and mobile routes: zero violations at any severity.
- Live ordinary demo request log: same-origin only; no analytics or upload.
- Offline navigation after only the landing visit and the successor-worker
  update path: PASS.
- Sociobot verification rate limit: requests 1–30 returned 200; request 31
  returned 429 with `Retry-After: 2`. Checkout returned 303 to hosted Dodo.
- Lighthouse mobile root: 100 performance / 100 accessibility / 100 best
  practices / 100 SEO, LCP 1.8 s, CLS 0. Mobile demo: 92 / 100 / 100 / 100,
  LCP 1.1 s, CLS 0.
- Build budgets: JS 30.23 KB raw / 11.10 KB gzip; CSS 9.60 KB raw / 2.87 KB
  gzip; hero WebP 177.28 KB; no downloaded fonts.

Full evidence and file hashes are in `.factory/verification-9.md`.

## How to reproduce

```sh
npm ci
npm run test:all
npm audit --audit-level=high
npm run build
npm run preview
```

Open `/?demo=1` for the isolated sample. **Reset demo** restores two replayable
samples; **Start for real** discards the demo namespace and opens `/practice`.

## Defects and known gaps

- Critical: none.
- High: none.
- Medium: none.
- Low: none.
- Known gaps: none.

`.factory/brief.json` is absent, so the researched brief embedded in work
order `touch-canvas-drills-verify-9` was used as the scope contract.
