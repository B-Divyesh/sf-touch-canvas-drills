# Polish round 4 — cumulative finding closure

This round read every `review-*.md` and `polish-*.md`, including the current
adversarial report. Repair source commit: `388cd5e`; live deployment:
`be6b2242-d0cc-448e-b702-cb4a2c2e4e`. All checks below were repeated on
2026-08-29 UTC.

| Finding | Change made or retained | Evidence | Screenshot and live check |
| --- | --- | --- | --- |
| F-1-1 | Retained the metadata-complete static 404 with the shared header, footer, legal links, attribution, and real 404 override. | `static 404 has the shared shell, plain recovery copy, and complete metadata`; `@claim:deployment-policy` | [404](evidence/polish-4/live/404/screenshot-desktop.png); [unknown route](https://touch-canvas-drills.sociobot.in/not-a-real-route) returned HTTP 404. |
| F-1-2 | Retained route-specific Open Graph and Twitter title, description, and image metadata. | `routes set complete metadata and history navigation restores heading focus` | [landing](evidence/polish-4/live/root/screenshot-mobile.png); live `/`, `?demo=1`, `/demo`, `/practice`, `/privacy`, and `/terms` passed metadata checks. |
| F-1-3 | Retained **How the drills work**. | `landing copy is literal and the sample action enters the isolated query demo in one click` | [landing](evidence/polish-4/live/root/screenshot-mobile.png); [live root](https://touch-canvas-drills.sociobot.in/). |
| F-1-4 | Retained **Your practice data stays in this browser**. | landing-copy regression | [landing](evidence/polish-4/live/root/screenshot-mobile.png); [live root](https://touch-canvas-drills.sociobot.in/). |
| F-1-5 | Retained **Optional notes and printable practice sheet** and the exact $6 price. | landing-copy regression; `@claim:paid-extras` | [landing](evidence/polish-4/live/root/screenshot-desktop.png); [live root](https://touch-canvas-drills.sociobot.in/). |
| F-1-6 | Retained **PAGE NOT FOUND** and **This page does not exist.** | static-404 regression | [404](evidence/polish-4/live/404/screenshot-mobile.png); [unknown route](https://touch-canvas-drills.sociobot.in/not-a-real-route). |
| F-1-7 | Retained README wording for all 20 free drills and the printable seven-day practice sheet. | `README and catalog use the reviewed plain wording`; `@claim:free-core`; `@claim:paid-extras` | [terms](evidence/polish-4/live/terms/screenshot-desktop.png); [live terms](https://touch-canvas-drills.sociobot.in/terms). |
| F-1-8 | Retained plain README wording for checked files and isolated sample work. | README regression; `@claim:progress-roundtrip`; `@claim:demo-isolation` | [demo](evidence/polish-4/live/demo/screenshot-mobile.png); [live demo](https://touch-canvas-drills.sociobot.in/?demo=1). |
| F-1-9 | Retained **Try the Rail lines sample** with its one-click `?demo=1` target. | landing-copy regression; `@claim:demo-isolation` | [landing](evidence/polish-4/live/root/screenshot-mobile.png); [live demo](https://touch-canvas-drills.sociobot.in/?demo=1). |
| F-2-1 | Retained registered deployment-policy evidence for direct routes, 404, CSP, and immutable assets. | `@claim:deployment-policy` | [live root report](evidence/polish-4/live/root/verify.json); [live practice](https://touch-canvas-drills.sociobot.in/practice). |
| F-2-2 | Retained **saved drill** for persisted drawings across UI, docs, and claims. | `@claim:saved-replay`; `@claim:demo-isolation` | [demo](evidence/polish-4/live/demo/screenshot-desktop.png); [live demo](https://touch-canvas-drills.sociobot.in/?demo=1). |
| F-2-3 | Retained factual **LOCAL PRIVACY**. | landing-copy regression | [landing](evidence/polish-4/live/root/screenshot-mobile.png); [live root](https://touch-canvas-drills.sociobot.in/). |
| F-2-4 | Retained the clean-clone credential scan. | `@claim:no-repository-credentials` | Clean-clone claim pass; deployed [root](https://touch-canvas-drills.sociobot.in/) makes no third-party analytics request. |
| F-3-1 | Retained visible bundled Rail lines marks on direct/one-click demo entry and reset. | `@claim:demo-isolation` counts coral canvas pixels at 390 px. | [demo first viewport](evidence/polish-4/live/demo/screenshot-mobile.png); [live demo](https://touch-canvas-drills.sociobot.in/?demo=1). |
| F-3-2 | Retained the factual footer: **Touch-drawing practice for phones and tablets.** | static-404 regression; live shell check | [404](evidence/polish-4/live/404/screenshot-desktop.png); [live root](https://touch-canvas-drills.sociobot.in/). |
| F-3-3 | Retained the plain README deployment sentence. | `README and catalog use the reviewed plain wording`; `@claim:deployment-policy` | [local root report](evidence/polish-4/local/root/verify.json); [live practice](https://touch-canvas-drills.sociobot.in/practice). |
| F-3-4 | Retained separate, registered checkout and credential statements in README. | `@claim:paid-checkout-setup`; `@claim:no-repository-credentials` | [terms](evidence/polish-4/live/terms/screenshot-desktop.png); [hosted checkout source](https://touch-canvas-drills.sociobot.in/). |
| F-3-5 | Retained the MIT registry entry and complete license test. | `@claim:mit-license` | Clean-clone claim pass; repository [LICENSE](../LICENSE). |
| F-4-1 | Removed the unsupported merchant/refund statement and its copy-only claim. Terms now state only tested checkout and rejected/revoked-license behavior. | `@claim:checkout-redirect`; `@claim:invalid-license-lock` | [terms](evidence/polish-4/live/terms/screenshot-mobile.png); [live terms](https://touch-canvas-drills.sociobot.in/terms) has no merchant/refund assertion. |
| F-4-2 | Added `clear-browser-data` to the claim registry and a real CDP storage-clear test covering localStorage and IndexedDB. | `@claim:clear-browser-data` | [privacy](evidence/polish-4/live/privacy/screenshot-desktop.png); [live privacy](https://touch-canvas-drills.sociobot.in/privacy). |
| F-4-3 | Replaced the untested Android-specific README claim with wording for people who draw on phones and tablets. | `README and catalog use the reviewed plain wording` | [landing](evidence/polish-4/live/root/screenshot-mobile.png); [live root](https://touch-canvas-drills.sociobot.in/). |
| F-4-4 | Rewrote the first-screen price fact as **All 20 drills are free; extras cost $6 once**. | landing-copy regression; `@claim:free-core`; `@claim:paid-extras` | [landing](evidence/polish-4/live/root/screenshot-mobile.png); [live root](https://touch-canvas-drills.sociobot.in/). |
| F-4-5 | Replaced the visitor-facing **strokes** fact with **marks** and updated the privacy claim wording. | landing-copy regression; `@claim:privacy-local` | [landing](evidence/polish-4/live/root/screenshot-mobile.png); [live root](https://touch-canvas-drills.sociobot.in/). |
| F-4-6 | Rewrote the second step as **Draw until the timer ends**. | landing-copy regression; `@claim:first-mark-timer` | [landing](evidence/polish-4/live/root/screenshot-desktop.png); [live root](https://touch-canvas-drills.sociobot.in/). |

## Verification summary

- Fresh clone at `388cd5e`: `npm ci` (0 vulnerabilities), ESLint,
  TypeScript, Vitest, production build, and 35 Playwright tests all passed.
- Each of the 23 exact `npm test -- --grep @claim:<id>` commands passed
  separately from that clean clone.
- Local and live `verify-url.sh` reports are stored in
  `evidence/polish-4/local/` and `evidence/polish-4/live/`; all record one h1,
  main landmark, English language, complete alt text, labelled buttons, and
  zero console errors.
- Lighthouse on the demo route: local 100/100/100/100 (LCP 1.5 s, CLS 0, TBT
  30 ms); live 100/100/100/100 (LCP 1.0 s, CLS 0, TBT 30 ms).

No finding remains open.
