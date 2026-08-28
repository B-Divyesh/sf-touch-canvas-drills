# Touch Canvas Drills verification 4 handoff

## Result

**PASS — release accepted.** Independent QA for candidate
`10c3d4e01cee33e939ccc1dec7e2988ab451d6e5` against
<https://touch-canvas-drills.sociobot.in> found no defect at any severity.

The complete report is `.factory/verification-4.md`. Product code was not
changed.

## Verified evidence

- Cold desktop and 390×844 first-read gates pass. The first screen states the
  job, audience, first click, result, and offline/privacy/price facts. The
  mobile sample action ends at y=472.94.
- `.factory/claims.json` exists; all 19 listed commands pass separately, with
  one unique tagged test per claim and no unlisted visitor claim.
- `npm ci`: 161 packages, 0 vulnerabilities.
- ESLint, TypeScript, 1/1 unit test, 27/27 Playwright tests,
  `npm audit --audit-level=high`, and the exact production build pass.
- Build output: JS 28.50 KB raw / 10.66 KB gzip, CSS 9.51 KB raw / 2.85 KB
  gzip, hero WebP 177.28 KB.
- Live desktop/mobile happy paths, touch, keyboard, saved replay, PNG/JSON
  export, demo reset/exit isolation, handed layout, invalid and oversized
  imports, 500/501-session boundaries, timer exhaustion, 200% text, and reduced
  motion pass.
- Live `/`, `/demo`, `/practice`, `/privacy`, and `/terms` have zero axe
  serious/critical findings and no console/page errors. The factory URL smoke
  verifier passes in 774ms with the required semantic checks.
- Ordinary use makes same-origin requests only. CSP, HSTS, `nosniff`, referrer
  policy, route no-cache, immutable hashed assets, worker no-cache, and real
  HTTP 404 behavior are live.
- All 15 public files byte-match the candidate build. Local/live `index.html`
  SHA-256: `3a6d02c7cd82084388fbf5af231cef519b796d76f55118cab8c986690d2a2f05`.
- PWA install metadata, fresh offline `/practice`, offline manifest start URL,
  no false first-install notice, and genuine worker update activation pass.
- Live Lighthouse mobile `/demo`: 98 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO; LCP 1.2s, TBT 140ms, CLS 0.
- Sociobot checkout returns 303 to Dodo checkout. License verification permits
  30 requests in the current window; request 31 returns 429 with
  `Retry-After: 3`.

## Run again

```sh
npm ci
npm run lint
npm run typecheck
npm run test:unit
npm test
npm audit --audit-level=high
npm run build
```

Run each command in `.factory/claims.json` separately for the strict claim
gate. Open `/demo` for the sandbox, and use a fresh service-worker-enabled
browser context for offline testing.

## Defects and gaps

- Release-blocking: none.
- High: none.
- Medium: none.
- Low: none.
- Conditional surfaces not present: sign-in, product backend, library, and CLI.
- `.factory/brief.json` is absent; verification used the researched brief in
  work order `touch-canvas-drills-verify-4`.
