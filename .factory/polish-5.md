# Polish round 5 — cumulative finding closure

This round read every `.factory/review-*.md` and `.factory/polish-*.md` before
editing. Repair commit `c1eb8758d22820b3fd73b6b41f0fbffe2c124354`
was deployed as `354cab45-5100-4377-868e-e01ad579f577` on 2026-08-29 UTC.
The live JavaScript path matches the clean build:
`/assets/index-ElHNDllP.js`.

| Finding | Change made or retained | Automated evidence | Screenshot and live URL check |
| --- | --- | --- | --- |
| F-1-1 | Retained the complete cassette-zine 404 shell, shared navigation/footer, legal links, metadata, recovery action, and real 404 override. | `static 404 has the shared shell, plain recovery copy, and complete metadata`; `@claim:deployment-policy` | [live 404](evidence/polish-5/live/404/screenshot-mobile.png); [`/not-a-real-route`](https://touch-canvas-drills.sociobot.in/not-a-real-route) returned HTTP 404. |
| F-1-2 | Retained route-specific title, description, canonical, Open Graph, and Twitter metadata. | `routes set complete metadata and history navigation restores heading focus` | [live root](evidence/polish-5/live/root/screenshot-desktop.png); `/`, `?demo=1`, `/demo`, `/practice`, `/privacy`, and `/terms` passed live. |
| F-1-3 | Retained the literal **How the drills work** heading. | `landing copy is literal and the sample action enters the isolated query demo in one click` | [live landing](evidence/polish-5/live/root/screenshot-mobile.png); [root](https://touch-canvas-drills.sociobot.in/). |
| F-1-4 | Retained **Your practice data stays in this browser**. | Landing-copy regression test | [live landing](evidence/polish-5/live/root/screenshot-mobile.png); [root](https://touch-canvas-drills.sociobot.in/). |
| F-1-5 | Retained **Optional notes and printable practice sheet** and exact $6 wording. | Landing-copy regression; `@claim:paid-extras` | [live landing](evidence/polish-5/live/root/screenshot-mobile.png); [root](https://touch-canvas-drills.sociobot.in/). |
| F-1-6 | Retained plain **PAGE NOT FOUND** and **This page does not exist.** recovery copy. | Static-404 regression; `@claim:deployment-policy` | [live 404](evidence/polish-5/live/404/screenshot-mobile.png); [unknown URL](https://touch-canvas-drills.sociobot.in/not-a-real-route). |
| F-1-7 | Retained consistent README and product terms for all 20 free drills and the printable seven-day practice sheet. | `README and catalog use the reviewed plain wording`; `@claim:free-core`; `@claim:paid-extras` | [live terms](evidence/polish-5/live/terms/screenshot-mobile.png); [terms](https://touch-canvas-drills.sociobot.in/terms). |
| F-1-8 | Retained plain checked-file/demo wording in README and storage detail only in demo documentation. | README regression; `@claim:progress-roundtrip`; `@claim:demo-isolation` | [live demo](evidence/polish-5/live/demo/screenshot-mobile.png); [query demo](https://touch-canvas-drills.sociobot.in/?demo=1). |
| F-1-9 | Retained **Try the Rail lines sample** with its direct `?demo=1` target. | Landing-copy regression; `@claim:demo-isolation` | [live landing](evidence/polish-5/live/root/screenshot-mobile.png); [query demo](https://touch-canvas-drills.sociobot.in/?demo=1). |
| F-2-1 | Retained registered build-policy proof for direct routes, security headers, immutable hashed assets, and real 404 handling. | `@claim:deployment-policy` | [live root report](evidence/polish-5/live/root/verify.json); [practice](https://touch-canvas-drills.sociobot.in/practice). |
| F-2-2 | Retained **saved drill** for persisted drawings and **mark** for a user-drawn line. | Landing-copy regression; `@claim:saved-replay`; `@claim:demo-isolation` | [live demo](evidence/polish-5/live/demo/screenshot-mobile.png); [query demo](https://touch-canvas-drills.sociobot.in/?demo=1). |
| F-2-3 | Retained factual **LOCAL PRIVACY** instead of the former slogan. | Landing-copy regression | [live landing](evidence/polish-5/live/root/screenshot-mobile.png); [root](https://touch-canvas-drills.sociobot.in/). |
| F-2-4 | Retained the tracked-source and built-output credential scan. | `@claim:no-repository-credentials` | [clean-clone log](evidence/polish-5/clean-clone/verification.log); [root](https://touch-canvas-drills.sociobot.in/) loads no third-party analytics. |
| F-3-1 | Retained visible bundled Rail lines marks on first demo entry and Reset. | `@claim:demo-isolation` requires visible canvas and more than 2,000 coral pixels twice. | [live demo first screen](evidence/polish-5/live/demo/screenshot-mobile.png); [query demo](https://touch-canvas-drills.sociobot.in/?demo=1). |
| F-3-2 | Retained the factual footer **Touch-drawing practice for phones and tablets.** | Static-404 and live-shell regression | [live 404](evidence/polish-5/live/404/screenshot-desktop.png); [root](https://touch-canvas-drills.sociobot.in/). |
| F-3-3 | Retained the plain README deployment sentence. | README regression; `@claim:deployment-policy` | [live practice](https://touch-canvas-drills.sociobot.in/practice); [root report](evidence/polish-5/live/root/verify.json). |
| F-3-4 | Retained separate, registered checkout-setup and no-credentials statements. | `@claim:paid-checkout-setup`; `@claim:no-repository-credentials` | [live terms](evidence/polish-5/live/terms/screenshot-mobile.png); [terms](https://touch-canvas-drills.sociobot.in/terms). |
| F-3-5 | Retained the registered MIT claim and complete-license proof. | `@claim:mit-license` | [clean-clone log](evidence/polish-5/clean-clone/verification.log); repository `LICENSE`. |
| F-4-1 | Retained only verifiable hosted-checkout and rejected/revoked-license wording; no merchant/refund promise returned. | `@claim:checkout-redirect`; `@claim:invalid-license-lock` | [live terms](evidence/polish-5/live/terms/screenshot-mobile.png); [terms](https://touch-canvas-drills.sociobot.in/terms). |
| F-4-2 | Retained the data-deletion claim and real localStorage/IndexedDB clearing test. | `@claim:clear-browser-data` | [live privacy](evidence/polish-5/live/privacy/screenshot-mobile.png); [privacy](https://touch-canvas-drills.sociobot.in/privacy). |
| F-4-3 | Retained phone/tablet audience wording without an untested Android guarantee. | README plain-wording regression | [live landing](evidence/polish-5/live/root/screenshot-mobile.png); [root](https://touch-canvas-drills.sociobot.in/). |
| F-4-4 | Retained **All 20 drills are free; extras cost $6 once**. | Landing-copy regression; strengthened `@claim:free-core` and `@claim:paid-extras` | [live landing](evidence/polish-5/live/root/screenshot-mobile.png); [root](https://touch-canvas-drills.sociobot.in/). |
| F-4-5 | Retained **mark** consistently in visitor-facing copy. | Landing-copy regression; strengthened `@claim:privacy-local` | [live landing](evidence/polish-5/live/root/screenshot-mobile.png); [privacy](https://touch-canvas-drills.sociobot.in/privacy). |
| F-4-6 | Retained **Draw until the timer ends**. | Landing-copy regression; `@claim:first-mark-timer` | [live landing](evidence/polish-5/live/root/screenshot-desktop.png); [root](https://touch-canvas-drills.sociobot.in/). |
| F-5-1 | Rebuilt `paid-extras` proof: follows Sociobot's 303, reads Dodo product metadata, asserts one-time USD 600, saves/reloads a unique local note with a recorded valid-license response, seeds boundary dates, emulates print, and requires seven day cells. | `@claim:paid-extras authoritative $6 one-time checkout adds persistent local notes and a seven-day print sheet` | [live landing price](evidence/polish-5/live/root/screenshot-mobile.png); live claim passed against [root](https://touch-canvas-drills.sociobot.in/). |
| F-5-2 | Rebuilt `twenty-drills` proof to activate all 20 expected drills and check each distinct title, category, cue, timer, guide pixels, canvas label, accepted mark pixels, and save state. | `@claim:twenty-drills all 20 guided drills load their own working exercise` | [live demo](evidence/polish-5/live/demo/screenshot-desktop.png); live claim passed at [query demo](https://touch-canvas-drills.sociobot.in/?demo=1). |
| F-5-3 | Rebuilt PNG proof to clear the sample, draw a mark, assert the PNG signature, decode it, require 900×675 dimensions, and find coral mark pixels. | `@claim:png-export exports a decodable 900 by 675 PNG containing the drawn mark` | [live demo canvas](evidence/polish-5/live/demo/screenshot-mobile.png); live claim passed at [demo](https://touch-canvas-drills.sociobot.in/demo). |
| F-5-4 | Added exact `data-date`, `data-count`, and accessible labels to each calendar day; test seeds today, six days ago, and eight days ago, requires seven consecutive visible dates with correct counts, excludes the old date, and inspects the JSON export. | `@claim:local-progress calendar shows exactly seven consecutive days and JSON keeps all progress` | [live seven-day panel](evidence/polish-5/live/demo/screenshot-mobile.png); live claim passed at [practice](https://touch-canvas-drills.sociobot.in/practice). |
| F-5-5 | Rebuilt free-core proof in a license-free context: opens drill 20, draws, saves, replays, decodes the PNG, inspects JSON, and asserts no checkout/verify request or paid control appears. | `@claim:free-core an unlicensed visitor completes a later drill, replay, PNG, and JSON export` | [live free controls](evidence/polish-5/live/demo/screenshot-mobile.png); live claim passed at [practice](https://touch-canvas-drills.sociobot.in/practice). |
| F-5-6 | Rebuilt privacy proof to record URL, origin, method, resource type, and body for load, draw, save, PNG/JSON export, and Reset; every request must be same-origin GET/HEAD with no body or drawing data. | `@claim:privacy-local full demo flow sends no artwork or analytics request to any origin` | [live privacy](evidence/polish-5/live/privacy/screenshot-mobile.png); live claim passed at [demo](https://touch-canvas-drills.sociobot.in/demo). |
| F-5-7 | Rebuilt demo-isolation proof with a distinct real saved drill, left-handed preference, and note in both storage layers; byte/deep equality is checked after entry, demo save, Reset, drill navigation, Start for real, re-entry, and route exit while demo records are separately removed. | `@claim:demo-isolation demo preserves an existing real record through entry, work, reset, navigation, and exit` | [live demo banner and reset](evidence/polish-5/live/demo/screenshot-mobile.png); live claim passed at [query demo](https://touch-canvas-drills.sociobot.in/?demo=1). |

## Verification summary

- Clean clone `c1eb875`: `npm ci` found 0 vulnerabilities;
  `npm run test:all` passed lint, TypeScript, 1 unit test, production build,
  and 35 Playwright tests. Every one of the 23 exact claim commands then
  passed separately. See [verification.log](evidence/polish-5/clean-clone/verification.log).
- Live post-deploy run: 33 portable browser tests passed, including all seven
  strengthened round-5 claims, all-route Axe checks, offline navigation,
  keyboard, mobile, privacy, focus/history, metadata, checkout, and 404 UI.
  See [live-browser-tests.log](evidence/polish-5/live-browser-tests.log).
- Built sizes: JavaScript 30.57 kB raw / 11.20 kB gzip; CSS 9.60 kB raw /
  2.87 kB gzip; hero artwork 177.28 kB.
- Local mobile Lighthouse: 100 performance, 100 accessibility, 100 best
  practices, 100 SEO; LCP 1.1 s, CLS 0, TBT 50 ms.
- Live mobile Lighthouse: 100/100/100/100; LCP 1.0 s, CLS 0, TBT 50 ms.
- Factory URL checks on root, query demo, privacy, terms, and 404 record
  correct titles, `lang=en`, one h1, one main, complete alt/button labels, and
  zero console errors. The live unknown route returned HTTP 404.

No finding from rounds 1–5 remains open.
