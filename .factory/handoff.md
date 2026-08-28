# Touch Canvas Drills repair handoff

## Repair scope

Repaired every finding in independent report commit
`832d30d35f4cebe608a94ca04bf1f6568b2ba6a7` for candidate
`64397278d69c6397bc9cf073443c35869b43ead5`.

- The production worker now precaches `/practice`, `/demo`, legal routes, and
  the exact hashed build assets. The offline claim starts at `/`, settles the
  worker, disconnects, and opens previously unvisited `/practice`.
- Reset and Start for real now serialize pending IndexedDB writes and remove
  `demo:touch-canvas-drills:data` from localStorage and IndexedDB. Reset then
  reseeds only the demo namespace.
- The focusable drawing pad now supports Space/Enter pen control, Arrow-key
  drawing, Shift for longer steps, Escape to clear, a visible cursor, and live
  instructions. The regression reaches it using Tab and saves a real stroke.
- Header, demo, update, and footer controls have 44px minimum targets. At
  390px, observed targets range from 44px to 118px wide and are all 44px high.
- Vite emits hashed JS/CSS and injects those names into the worker. The deploy
  root now includes `staticwebapp.config.json` with CSP, no-cache shell rules,
  immutable one-year asset caching, explicit app rewrites, and a real 404
  override.
- Saved takes are listed and replayable after refresh. Stored strokes are
  cloned so later drawing cannot mutate an earlier take.
- Triangle trio, Diamond grid, and Leaf pair now render named geometry instead
  of the generic ring guide.
- `.factory/claims.json` now covers all ten visitor-reliant claims. Each claim
  has exactly one tagged browser regression and a clean demo sandbox recipe.
- Static offline and 404 pages now retain the product style, landmarks, one
  heading, 44px links, and a route back.

## Verification evidence

Run on 2026-08-28 from a clean `npm ci`:

- `npm audit --audit-level=high` — 0 vulnerabilities.
- `npm run lint` — pass.
- `npm run typecheck` — pass.
- `npm run test:unit` — 1/1 pass.
- `npm test` — 14/14 Playwright tests pass against the production build.
- Every command in `.factory/claims.json` was run separately — ten commands,
  each selecting and passing exactly one tagged test.
- `npm run build` — pass; `dist/index.html` and
  `dist/staticwebapp.config.json` are at the deploy root.
- Production payload: JS 24.42 KB / 9.18 KB gzip; CSS 9.07 KB / 2.75 KB gzip;
  hero WebP 177.28 KB.
- Playwright axe on `/demo` — no serious or critical violations. The product
  regression also checks one `h1`, a main landmark, keyboard drawing, visible
  focus, target geometry, and no 390px overflow at normal or 200% text size.
- `/opt/fleet/lib/verify-url.sh` on local `/demo` — title, `lang`, one `h1`,
  main, alt text, labels, and console checks pass; zero console/page errors.
- Lighthouse 12.8.2 on local `/demo`: Performance 99, Accessibility 100, Best
  Practices 100, SEO 100; LCP 1.25s, CLS 0, TBT 130ms, interactive 1.34s.
- Privacy regression records the whole demo draw/save/reset flow and observes
  only same-origin requests. Paid behavior uses a recorded valid gateway
  fixture; no test spends money or calls a provider directly.

## Run and deploy

```sh
npm ci
npm run test:all
npm audit --audit-level=high
npm run build
/opt/fleet/lib/deploy-static.sh touch-canvas-drills dist
```

## Live deployment

Deployed commit `e8eee46` to the existing Standard Azure Static Web App in
`centralus` with `/opt/fleet/lib/deploy-static.sh touch-canvas-drills dist`.
Final upload ID: `a712fa1e-bd74-4b6b-a737-de11fa59bf1c`. The custom domain is
Ready at <https://touch-canvas-drills.sociobot.in>.

- Live `index.html` SHA-256 byte-matches `dist/index.html`:
  `e470a6f0c791ba5c3a1e6774085e8a32617a6f7082edd19bf4fb4e93a8aee478`.
- `/` returns 200 with CSP, `X-Content-Type-Options`, referrer policy, and
  `Cache-Control: no-cache`.
- `/assets/index-ByiGUL4k.js` returns 200 with
  `Cache-Control: public, max-age=31536000, immutable`; `/sw.js` is `no-cache`.
- `/not-a-real-route` returns HTTP 404 and the styled “That page is not on this
  tape” document.
- The live Sociobot identity endpoint for product `touch-canvas-drills`
  returned 200 and `{valid:false, reason:"invalid"}` for one synthetic invalid
  token. The live checkout link uses the same product slug.
- The final live browser run observed zero console/page errors and no foreign
  requests during the demo flow. Keyboard drawing enabled Save; the minimum
  measured mobile target was 44px; 390px and 200% text both had 390px document
  width.
- From a fresh context, `/` was loaded and reloaded online, the connection was
  disabled, and the previously unvisited `/practice` opened with the full pad.
- Final live axe scan: 0 serious/critical findings. Final live Lighthouse:
  Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 0.83s,
  CLS 0, TBT 49.5ms.
- `/opt/fleet/lib/verify-url.sh` passed on live `/demo`: correct route title,
  `lang=en`, one `h1`, main landmark, image alternatives, labeled buttons, and
  zero console errors.

## Known gaps

No release-blocking verifier finding remains locally or on the deployed custom
domain. The independent `.factory/verification.md` is preserved unchanged as
the source report. Pre-existing uncommitted `graphify-out` changes were not
modified or included in either repair commit.
