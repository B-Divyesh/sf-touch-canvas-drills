# Polish round 3 — cumulative finding closure

This round read `.factory/review-1.md`, `.factory/review-2.md`,
`.factory/review-3.md`, `.factory/polish-1.md`, and `.factory/polish-2.md`.
The repair is commit `a34386d4c8034e6b786c909ee2141a1e7c12c22e`, deployed as
`d418c81f-c7b5-4e57-b2a6-3cf8790be4c7` on 2026-08-29 UTC.

| Finding | Change made or retained | Automated evidence | Screenshot / source evidence | Live URL check |
| --- | --- | --- | --- | --- |
| F-1-1 | Retained the complete cassette-zine 404 shell, metadata, navigation, legal links, attribution, and real HTTP 404 override. | `static 404 has the shared shell, plain recovery copy, and complete metadata`; `@claim:deployment-policy` | [404 desktop](evidence/polish-3/local/404-desktop.png) | [`/not-a-real-route`](https://touch-canvas-drills.sociobot.in/not-a-real-route) returned HTTP 404 with the full shell. |
| F-1-2 | Retained route-specific Open Graph and complete Twitter title, description, and image metadata. | `routes set complete metadata and history navigation restores heading focus` | [live root report](evidence/polish-3/live/root/verify.json) | `/`, `/?demo=1`, `/demo`, `/practice`, `/privacy`, and `/terms` passed the live metadata checker. |
| F-1-3 | Retained **How the drills work**. | `landing copy is literal and the sample action enters the isolated query demo in one click` | [landing mobile](evidence/polish-3/local/landing-mobile.png) | [`/`](https://touch-canvas-drills.sociobot.in/) contains the literal heading. |
| F-1-4 | Retained **Your practice data stays in this browser**. | landing-copy regression test | [landing mobile](evidence/polish-3/local/landing-mobile.png) | [`/`](https://touch-canvas-drills.sociobot.in/) contains the factual privacy heading. |
| F-1-5 | Retained **Optional notes and printable practice sheet**. | landing-copy regression test; `@claim:paid-extras` | [landing mobile](evidence/polish-3/local/landing-mobile.png) | [`/`](https://touch-canvas-drills.sociobot.in/) shows the exact paid heading and $6 price. |
| F-1-6 | Retained plain 404 copy: **PAGE NOT FOUND** and **This page does not exist.** | static-404 regression; live route checker | [404 desktop](evidence/polish-3/local/404-desktop.png) | [`/not-a-real-route`](https://touch-canvas-drills.sociobot.in/not-a-real-route) has the recovery action and HTTP 404. |
| F-1-7 | Retained the free-core and seven-day-practice-sheet wording across README and product copy. | `README and catalog use the reviewed plain wording`; `@claim:free-core`; `@claim:paid-extras` | [README at repair commit](https://github.com/B-Divyesh/sf-touch-canvas-drills/blob/a34386d4c8034e6b786c909ee2141a1e7c12c22e/README.md) | [`/terms`](https://touch-canvas-drills.sociobot.in/terms) retains the matching product terms. |
| F-1-8 | Retained plain README wording for checked imports and separate sample work; storage details remain in demo documentation. | README regression; `@claim:progress-roundtrip`; `@claim:demo-isolation` | [demo first viewport](evidence/polish-3/live/demo-first-mobile.png) | [`/?demo=1`](https://touch-canvas-drills.sociobot.in/?demo=1) is isolated and resettable. |
| F-1-9 | Retained **Try the Rail lines sample** with its direct `/?demo=1` target. | landing-copy regression test | [landing mobile](evidence/polish-3/local/landing-mobile.png) | The live action opens the populated query demo in one click. |
| F-2-1 | Retained the registered `deployment-policy` claim and built-artifact checks for routes, 404, CSP, and immutable assets. | `@claim:deployment-policy` | [live root report](evidence/polish-3/live/root/verify.json) | Live root sends CSP/nosniff/referrer headers; direct product routes load. |
| F-2-2 | Retained **saved drill** as the single name for persisted drawings. | `@claim:saved-replay`; `@claim:demo-isolation` | [demo first viewport](evidence/polish-3/live/demo-first-mobile.png) | The live demo lists and replays saved drills. |
| F-2-3 | Retained factual **LOCAL PRIVACY**. | landing-copy regression test | [landing mobile](evidence/polish-3/local/landing-mobile.png) | [`/`](https://touch-canvas-drills.sociobot.in/) contains the factual label. |
| F-2-4 | Retained the registered clean-clone credential scan. | `@claim:no-repository-credentials` | Clean-clone claim log: 23/23 pass | The deployed app contains no third-party scripts, fonts, or analytics requests. |
| F-3-1 | The demo now loads bundled `sample-1` Rail lines strokes into the active canvas on direct entry, landing entry, reset, and history entry. It labels the first control **Replay sample marks**. | `@claim:demo-isolation` enters via the 390 px landing action, requires >2,000 coral pixels, and repeats the assertion after reset. | [live demo first viewport](evidence/polish-3/live/demo-first-mobile.png) | [`/?demo=1`](https://touch-canvas-drills.sociobot.in/?demo=1) checked cold: canvas y=544, 9,780 coral pixels; reset restored 9,780. |
| F-3-2 | Replaced the outcome slogan with **Touch-drawing practice for phones and tablets.** on SPA and static-404 footers. | static-404 regression; live shell checker | [404 desktop](evidence/polish-3/local/404-desktop.png) | All live routes and the 404 have the factual footer. |
| F-3-3 | Rewrote the README deployment sentence in plain words. | `README and catalog use the reviewed plain wording`; `@claim:deployment-policy` | [README at repair commit](https://github.com/B-Divyesh/sf-touch-canvas-drills/blob/a34386d4c8034e6b786c909ee2141a1e7c12c22e/README.md) | [`/practice`](https://touch-canvas-drills.sociobot.in/practice) opens directly and the 404 is styled. |
| F-3-4 | Split the README ideas; registered **Paid checkout is configured outside this repository** as `paid-checkout-setup`. | `@claim:paid-checkout-setup`; `@claim:no-repository-credentials` | [README at repair commit](https://github.com/B-Divyesh/sf-touch-canvas-drills/blob/a34386d4c8034e6b786c909ee2141a1e7c12c22e/README.md) | The live purchase link uses Sociobot hosted checkout and redirects to Dodo. |
| F-3-5 | Registered the MIT statement as `mit-license` and proved the README link plus complete permission/warranty text. | `@claim:mit-license` | [LICENSE at repair commit](https://github.com/B-Divyesh/sf-touch-canvas-drills/blob/a34386d4c8034e6b786c909ee2141a1e7c12c22e/LICENSE) | Repository claim; no product-page URL applies. |

## Verification evidence

- Clean clone: `/tmp/touch-canvas-drills-polish-3.Nu91wt/clone` ran `npm ci`
  with 0 vulnerabilities and `npm run test:all` with lint, TypeScript, one
  Vitest unit test, production build, and **35 Playwright tests passing**.
- Every one of the **23** exact commands in `.factory/claims.json` passed
  individually from that clean clone. This includes the new direct-entry demo,
  hosted-checkout, and MIT-license claims.
- Production build: initial JavaScript is 11.09 kB gzip; CSS is 2.85 kB gzip;
  the self-hosted hero artwork is 177.28 kB.
- Local mobile Lighthouse on `/?demo=1`: performance 99, accessibility 100,
  best practices 100, SEO 100; LCP 986 ms, CLS 0, TBT 97 ms. See
  [local report](evidence/polish-3/local/lighthouse.json).
- Live mobile Lighthouse on `/?demo=1`: performance 100, accessibility 100,
  best practices 100, SEO 100; LCP 903 ms, CLS 0, TBT 0 ms. See
  [live report](evidence/polish-3/live/lighthouse.json).
- `verify-url.sh` found no console/page errors, one h1/main, language, titles,
  alt text, and labelled buttons on both live [root](evidence/polish-3/live/root/verify.json)
  and [query demo](evidence/polish-3/live/demo/verify.json).
- Live Playwright Axe found zero violations on the landing, both demo URLs,
  practice, privacy, terms, and static 404. The independent live check also
  confirmed direct routes, real 404, metadata, focus/back behavior, offline
  navigation after first visit, and localStorage demo isolation. See
  [live check](evidence/polish-3/live/live-check.json) and
  [internal-link crawl](evidence/polish-3/live/link-crawl.json).

No review finding remains open.
