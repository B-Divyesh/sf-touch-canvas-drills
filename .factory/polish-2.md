# Polish round 2 — cumulative finding closure

Reviewed `.factory/review-2.md`, `.factory/review-1.md`, and
`.factory/polish-1.md`. The repaired product is version 1.0.5. Local and live
checks were completed on 2026-08-29 UTC.

| Finding | Change made | Automated evidence | Screenshot | Live URL check |
| --- | --- | --- | --- | --- |
| F-1-1 | Retained the shared cassette-zine 404 shell, complete route metadata, legal links, and real 404 override; bumped its visible build to v1.0.5. | `static 404 has the shared shell, plain recovery copy, and complete metadata`; `@claim:deployment-policy`; route Axe test | [live 404](evidence/polish-2/live/404-desktop.png) | `/not-a-real-route` returned HTTP 404 with the shared header/footer, one h1/main, metadata, and a working home link. |
| F-1-2 | Retained route-specific Open Graph and Twitter title, description, and image updates. | `routes set complete metadata and history navigation restores heading focus` | [live landing](evidence/polish-2/live/root/screenshot-mobile.png) | `/`, `/?demo=1`, `/demo`, `/practice`, `/privacy`, and `/terms` passed the live metadata test. |
| F-1-3 | Retained the literal “How the drills work” section heading. | `landing copy is literal and the sample action enters the isolated query demo in one click` | [local landing](evidence/polish-2/local/landing-mobile.png) | Live root contains the reviewed heading. |
| F-1-4 | Retained “Your practice data stays in this browser”. | same landing-copy regression test | [live landing](evidence/polish-2/live/root/screenshot-mobile.png) | Live root contains the reviewed heading. |
| F-1-5 | Retained “Optional notes and printable practice sheet”. | same landing-copy regression test; `@claim:paid-extras` | [local landing](evidence/polish-2/local/landing-mobile.png) | Live root contains the reviewed heading and exact $6 terms. |
| F-1-6 | Retained plain 404 recovery wording: “PAGE NOT FOUND” and “This page does not exist.” | static 404 regression test; route Axe test | [live 404](evidence/polish-2/live/404-desktop.png) | Unknown live URL returned the exact wording with HTTP 404. |
| F-1-7 | Retained consistent README price/free wording and seven-day practice-sheet term. | `README and catalog use the reviewed plain wording`; `@claim:free-core`; `@claim:paid-extras` | Not applicable to repository copy | Live landing and `/terms` use the same product terms. |
| F-1-8 | Retained plain README wording for checked imports and separate demo work; browser-engine detail remains only in `.factory/demo.md`. | README regression test; `@claim:progress-roundtrip`; `@claim:demo-isolation` | [live demo](evidence/polish-2/live/demo/screenshot-mobile.png) | Live query demo reset and exit checks passed. |
| F-1-9 | Retained “Try the Rail lines sample” and its direct `/?demo=1` target. | landing-copy regression test | [live landing](evidence/polish-2/live/root/screenshot-mobile.png) | One click opened the populated live sample. |
| F-2-1 | Registered `deployment-policy` and tagged the built-artifact test. It asserts app rewrites, the 404 override, CSP, immutable caching, and hashed JS/CSS. | `@claim:deployment-policy`; claims-registry integrity test | [live 404](evidence/polish-2/live/404-desktop.png) | Live shell returned CSP/nosniff/referrer headers; all app routes returned 200; unknown route returned 404. |
| F-2-2 | Standardized persisted work as “saved drill” across landing copy, practice headings/buttons/status, metadata, README, demo docs, claims, and tests. Raw lines remain “marks”. | landing-copy regression test; `@claim:saved-replay`; `@claim:demo-isolation` | [live demo](evidence/polish-2/live/demo/screenshot-mobile.png) | Live demo shows “Saved drills” and two “Replay saved drill” actions. |
| F-2-3 | Replaced “PRIVATE BY DESIGN” with the factual label “LOCAL PRIVACY” and added a stale-copy regression assertion. | landing-copy regression test | [local landing](evidence/polish-2/local/landing-mobile.png) | Live root shows “LOCAL PRIVACY”; the old slogan is absent. |
| F-2-4 | Registered `no-repository-credentials` and added a clean-clone scan of every tracked text file and built text artifact for private keys and credential-shaped values. | `@claim:no-repository-credentials`; claims-registry integrity test | Not applicable to repository scan | The exact claim passed from the clean clone; no credential-like value was found. |

## Earlier product-defect safeguards

The earlier defects summarized in review 1 remain covered: `@claim:offline-reload`
opens an unvisited practice route offline; `@claim:demo-isolation` clears both
storage layers; `@claim:keyboard-drawing` performs and saves the core task;
the 390 px test enforces 44 px targets and no overflow; `@claim:saved-replay`
survives refresh; the named-guide test checks triangles, diamonds, and leaves;
and `@claim:deployment-policy` keeps the real 404 and host policy in `dist/`.

## Verification evidence

- Clean clone: `npm ci` passed with 0 vulnerabilities. `npm run test:all`
  passed lint, typecheck, 1 unit test, production build, and 33 browser tests.
- Claims: all 21 commands in `.factory/claims.json` ran separately from that
  clean clone. Each selected exactly one passing `@claim:<id>` test.
- Local Lighthouse sample route: performance 100, accessibility 100, best
  practices 100, SEO 100; LCP 1.5 s, CLS 0, TBT 30 ms.
- Live post-deploy regression: 8/8 tests passed for Axe, routes, metadata,
  focus/history, copy, 404, privacy, demo isolation, and mobile layout.
- Live Lighthouse sample route: performance 100, accessibility 100, best
  practices 100, SEO 100; LCP 0.9 s, CLS 0, TBT 10 ms.
- Factory URL verification found no console/page errors on the root or query
  demo. Both had `lang=en`, one h1, one main, complete alt text, and labeled
  buttons. See [root report](evidence/polish-2/live/root/verify.json) and
  [demo report](evidence/polish-2/live/demo/verify.json).
- Deployment ID: `c148c970-40e2-4885-8c7f-e2130759f620`.

No finding remains open.
