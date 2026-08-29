# Polish round 1 — cumulative finding closure

Reviewed source: `.factory/review-1.md` at commit
`467fd4299e1ffb2a64730916bc27b286168947fe`. No earlier
`.factory/review-*.md` or `.factory/polish-*.md` files existed. Checks below
were repeated on the deployed site on 2026-08-29 UTC.

| Finding | Change made | Automated evidence | Screenshot | Live URL check |
| --- | --- | --- | --- | --- |
| F-1-1 | Rebuilt the static 404 with the shared Demo/Practice/Privacy header, complete footer, manifest/icons, canonical, description, Open Graph, Twitter metadata, and the product's cassette-zine surface. The SWA override still returns HTTP 404. | `static 404 has the shared shell, plain recovery copy, and complete metadata`; `built deployment policy ships CSP, immutable hashed assets, and a real 404 override`; route Axe test | [live 404](evidence/polish-1/live/404-desktop.png) | `/not-a-real-route` returned 404 with one h1/main, all shared-shell text, full metadata, and zero serious/critical Axe findings. |
| F-1-2 | Added `twitter:title`, `twitter:description`, and `twitter:image`; route rendering now updates title, description, canonical, Open Graph, and Twitter values together. | `routes set complete metadata and history navigation restores heading focus` | [live landing](evidence/polish-1/live/landing-mobile.png) | `/`, `/?demo=1`, `/demo`, `/practice`, `/privacy`, and `/terms` each exposed non-empty route-correct metadata. |
| F-1-3 | Replaced “One small mark at a time” with “How the drills work”. | `landing copy is literal and the sample action enters the isolated query demo in one click` | [live landing](evidence/polish-1/live/landing-mobile.png) | `/` contains the new heading and not the old phrase. |
| F-1-4 | Replaced the metaphorical privacy heading with “Your practice data stays in this browser”. | same landing-copy regression test | [live landing](evidence/polish-1/live/landing-mobile.png) | `/` contains the new heading and not the old phrase. |
| F-1-5 | Replaced the paid-section mood heading with “Optional notes and printable practice sheet”. | same landing-copy regression test | [live landing](evidence/polish-1/live/landing-mobile.png) | `/` contains the new heading and not the old phrase. |
| F-1-6 | Replaced the 404 cassette metaphors with “PAGE NOT FOUND” and “This page does not exist.” while retaining the recovery action. | `static 404 has the shared shell, plain recovery copy, and complete metadata` | [live 404](evidence/polish-1/live/404-desktop.png) | `/not-a-real-route` returned the exact plain recovery copy with HTTP 404. |
| F-1-7 | Standardized README pricing language to “All 20 drills and both exports are free” and “printable seven-day practice sheet”; the terms and locked-note notice now use the same terms. | `README and catalog use the reviewed plain wording`; `@claim:free-core`; `@claim:paid-extras` | Not applicable to repository copy | GitHub `README.md` source was checked after push; product `/terms` uses “printable seven-day practice sheet”. |
| F-1-8 | Replaced README browser-internals jargon with checked-file, separate-sample-work, and `/?demo=1` wording. Storage details remain only in `.factory/demo.md`. | `README and catalog use the reviewed plain wording`; `@claim:progress-roundtrip`; `@claim:demo-isolation` | [live demo](evidence/polish-1/live/demo-mobile.png) | `/?demo=1` opened the populated sample directly; reset and exit removed the demo key without altering real practice data. |
| F-1-9 | Renamed “Open the practice pad” to “Try the Rail lines sample” and linked it to `/?demo=1`. | `landing copy is literal and the sample action enters the isolated query demo in one click` | [live landing](evidence/polish-1/live/landing-mobile.png) | The live link used the new label and opened the populated Rail lines sample in one click. |

## Additional acceptance evidence

- `/?demo=1` and `/demo` both render the same isolated sample namespace.
  Reset restores two replayable sessions. **Start for real** and ordinary
  navigation out of demo delete the demo records from localStorage and
  IndexedDB.
- `.factory/claims.json` contains 19 claims and exactly one
  `@claim:<id>` test for each. Every listed command passed separately in a
  fresh clone.
- `npm run test:all` passed lint, typecheck, 1 unit test, build, and the full
  browser suite. The suite covers keyboard drawing, 390 px layout, 200% text,
  privacy request logging, offline direct navigation, update behavior, routing,
  focus, metadata, static 404, and Axe.
- Local Lighthouse: performance 98, accessibility 100, best practices 100,
  SEO 100; LCP 2.4 s, CLS 0, total blocking time 0 ms.
- Live Lighthouse: 100 in all four categories; LCP 1.8 s, CLS 0, total
  blocking time 0 ms.
- Live root verification: HTTP 200, `lang=en`, one h1, one main, no missing
  alt text, no unlabeled buttons, and no console errors. Raw result:
  [verify.json](evidence/polish-1/live/root/verify.json).

No review finding remains open.
