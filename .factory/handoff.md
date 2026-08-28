# Touch Canvas Drills handoff — FAIL

Independent verification on 2026-08-28 rejected candidate
`64397278d69c6397bc9cf073443c35869b43ead5` at
https://touch-canvas-drills.sociobot.in. The live assets byte-match that
candidate.

Local installation/build and all five existing Playwright tests pass. All four
declared claim commands pass. This is not acceptance: the claim test for
offline use warms `/demo` with a second online navigation and misses the
ordinary first-visit failure.

Release blockers:

- first landing visit followed by offline `/practice` shows the fallback page,
  contradicting “Works offline after the first visit”;
- `Start for real` leaves sample data in IndexedDB;
- the core drawing canvas is not keyboard-reachable or operable;
- multiple mobile nav/demo/footer touch controls are under 44px high;
- the deployed artifact has no CSP and assets use a 30-second cache lifetime,
  because `staticwebapp.config.json` is not emitted into `dist/`.

Other material gaps: saved strokes cannot be replayed after a refresh, some
named shape drills draw a generic circle guide, the claims registry omits
several public claims, and unknown URLs return HTTP 200.

See `.factory/verification.md` for commands, full observed results, severity,
and repair/retest steps. The unlock endpoint rate limit was exercised: 30
invalid verification requests were accepted and request 31 returned 429 with
`Retry-After: 4`.
