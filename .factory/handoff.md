# Touch Canvas Drills verification handoff

## Result

**FAIL — do not release.** Independent verification of candidate
`b7ddf629f4a7b3fa29163ca8f3733715619a7105` at
<https://touch-canvas-drills.sociobot.in> completed on 2026-08-28 UTC.

The detailed evidence is in `.factory/verification-2.md`. No product code was
modified.

## Release blockers

1. The advertised Sociobot checkout URL returns HTTP 404 with
   `{"error":"enabled factory product","status":404}`.
2. Any invalid token returned through `?license=` leaves paid notes and print
   controls usable after live verification rejects it. A note can be saved
   until reload.
3. Axe reports a serious landing-page contrast failure: **Read purchase terms**
   is 3.83:1, below 4.5:1.
4. Installability, once-daily license verification, pressure behavior, and
   first-mark timer claims are not represented by exactly one tagged test each
   in `.factory/claims.json`.

Other defects: Clear leaves Save/Replay enabled with no marks; reduced-motion
replay gives no live-region feedback; the update toast has a moderate axe
landmark finding.

## What passed

- All 10 exact commands in `.factory/claims.json`: PASS after `npm ci`.
- `npm run test:all`: PASS — lint, typecheck, 1 unit test, build, 14 browser
  tests.
- `npm audit --audit-level=high`: PASS, 0 vulnerabilities.
- Exact `npm run build`: PASS; JS 9.18 KB gzip, CSS 2.75 KB gzip, hero 177.28
  KB.
- First-read and one-click demo gates: PASS.
- Live pointer/touch/keyboard drawing, timer completion, saving, replay, PNG and
  JSON exports, demo reset/isolation, left-handed layout, mobile layout, 200%
  text, route metadata, 404, console, and privacy request log: PASS.
- Live offline navigation after only a landing visit: PASS.
- Controlled service-worker update toast/activation/cache replacement: PASS.
- Manifest/installability checks: PASS.
- Fifteen served build files byte-match live; headers and caching match the
  shipped host policy.
- Verify API allowance: 30 successful requests; request 31 returned 429 with
  `Retry-After: 4`.
- Lighthouse mobile `/demo`: 95 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO; LCP 1.4s, CLS 0, TBT 240ms.
- `/opt/fleet/lib/verify-url.sh` on live `/demo`: PASS, zero console errors.

## Reproduce

```sh
npm ci
npm run test:all
npm audit --audit-level=high
npm run build
```

For the decisive live failures, open the checkout URL directly, run axe on `/`,
and open `/practice?license=<any-invalid-token>` while observing the enabled
note and print controls after the “License no longer active” response.

## Repository state

Only `.factory/verification-2.md` and this handoff belong to this verification.
Pre-existing `graphify-out` modifications and untracked cache files were left
untouched and must not be included in the verification commit.
