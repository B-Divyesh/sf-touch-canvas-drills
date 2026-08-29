# Touch Canvas Drills polish 2 handoff

## Result

**PASS — all 13 cumulative review findings are closed.** Version 1.0.5 is
deployed at <https://touch-canvas-drills.sociobot.in>. The cassette-zine visual
system and offline PWA deployment class are unchanged.

## What changed

- Standardized every persisted drawing label to **saved drill** and replaced
  the generic privacy slogan with **LOCAL PRIVACY**.
- Added `deployment-policy` and `no-repository-credentials` to the claims
  registry, with one tagged observable test for each.
- Added a registry integrity test and made the privacy request test work
  against either a local build or the live origin.
- Updated the catalog line, copy audit, demo documentation, PWA cache/version,
  static 404 version, and public footer to v1.0.5.
- Preserved all round-1 fixes for first-screen wording, query demo isolation,
  routing, metadata, legal links, focus, 404 handling, accessibility, mobile
  controls, offline navigation, durable replay, and named drawing guides.

The finding-by-finding record is in `.factory/polish-2.md`.

## Exact verification

From a clean clone of repair commit `c7b56c9`:

```sh
npm ci
npm run test:all
npm audit --audit-level=high
```

Results: 0 vulnerabilities; lint and typecheck passed; 1/1 unit test passed;
the production build passed; 33/33 Playwright tests passed. Every one of the
21 commands listed in `.factory/claims.json` was then run separately and
selected one passing claim test.

Build output: 29.79 KB JS raw / 10.97 KB gzip, 9.51 KB CSS raw / 2.85 KB
gzip, and a 177.28 KB hero WebP. `dist/index.html` is at the artifact root.

Local Lighthouse on `/?demo=1`: 100 performance, 100 accessibility, 100 best
practices, 100 SEO; LCP 1.5 s, CLS 0, TBT 30 ms.

Live Lighthouse after deployment: 100 performance, 100 accessibility, 100
best practices, 100 SEO; LCP 0.9 s, CLS 0, TBT 10 ms.

The factory URL verifier passed the live root and `/?demo=1` with no console
errors. A separate cold live Playwright run passed 8/8 route, title, metadata,
focus, Axe, copy, demo-isolation, privacy, and 390 px checks. The live unknown
route returned HTTP 404; app/legal routes returned 200; security headers were
present.

## Run and deploy

```sh
npm ci
npm run test:all
npm run build
/opt/fleet/lib/deploy-static.sh touch-canvas-drills /work/repo/dist
```

Production deployment ID: `c148c970-40e2-4885-8c7f-e2130759f620`.

## Known gaps and next steps

None. No review finding or observed defect remains unresolved.
