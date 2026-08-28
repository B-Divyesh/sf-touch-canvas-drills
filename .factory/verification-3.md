# Independent verification 3 — FAIL

**Candidate:** `fb005ff6a6b2eb25cc4b923d387ea4ec95d44631`

**Live URL:** <https://touch-canvas-drills.sociobot.in>

**Verified:** 2026-08-28 UTC

**Artifact:** offline-first PWA

## Decision

**FAIL — do not release.** The live files match the candidate and the core
drawing flows work, but the mandatory mobile first-read gate fails. The
left-handed layout does nothing at the target 390px phone width, the one-click
demo seeds impossible empty sessions instead of replayable sample marks, and
visitor-facing behavior remains outside the required claims registry.

No product code was changed during this verification.

## First-read gate

Cold read: this gives phone and tablet learners short guided drawing drills;
the intended first action is **Try it with sample data**.

- Desktop 1440×900: PASS. The headline, named audience, primary action, action
  result, and three facts are visible. One click opens `/demo`.
- Mobile 390×844: **FAIL**. The primary action starts at y=850.875 and is below
  the 844px first viewport. The audience sentence occupies y=746.25–826.875
  while a false update prompt covers y=751–828. The header's terse **Demo**
  link is one click, but it does not tell a cold visitor what happens.

This independently triggers the work order's mandatory FAIL condition.

## Required claim tests

`.factory/claims.json` exists. After `npm ci` in a detached, clean checkout at
the candidate, every declared command ran separately through the production
demo/test entry point. Each selected exactly one passing Playwright test.

| Claim ID | Exact command | Result |
| --- | --- | --- |
| `twenty-drills` | `npm test -- --grep @claim:twenty-drills` | PASS |
| `png-export` | `npm test -- --grep @claim:png-export` | PASS |
| `privacy-local` | `npm test -- --grep @claim:privacy-local` | PASS |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS |
| `pwa-install` | `npm test -- --grep @claim:pwa-install` | PASS |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | PASS |
| `keyboard-drawing` | `npm test -- --grep @claim:keyboard-drawing` | PASS |
| `saved-replay` | `npm test -- --grep @claim:saved-replay` | PASS |
| `local-progress` | `npm test -- --grep @claim:local-progress` | PASS |
| `free-core` | `npm test -- --grep @claim:free-core` | PASS |
| `paid-extras` | `npm test -- --grep @claim:paid-extras` | PASS |
| `invalid-license-lock` | `npm test -- --grep @claim:invalid-license-lock` | PASS |
| `checkout-redirect` | `npm test -- --grep @claim:checkout-redirect` | PASS |
| `license-daily-check` | `npm test -- --grep @claim:license-daily-check` | PASS |
| `pressure-independent` | `npm test -- --grep @claim:pressure-independent` | PASS |
| `first-mark-timer` | `npm test -- --grep @claim:first-mark-timer` | PASS |

Passing declared tests does not override the unlisted-claim finding below.

## Clean-checkout quality gates

- `npm ci`: PASS; 161 packages, 0 vulnerabilities.
- `npm run test:all`: PASS; ESLint, TypeScript, 1/1 Vitest, production build,
  and 22/22 Playwright tests.
- `npm audit --audit-level=high`: PASS; 0 vulnerabilities.
- Exact `npm run build`: PASS; `dist/` produced.
- Output: JS 24.49 KB raw / 9.24 KB gzip; CSS 9.16 KB raw / 2.77 KB gzip;
  hero WebP 177.28 KB. JS, CSS, font, and image budgets pass.

## Independent end-to-end results

PASS unless stated otherwise:

- `/demo` opens in one click with the persistent sandbox banner and 20 drill
  controls. Pointer and touch marks start the timer; it reaches `00:00` and
  announces the replay/save choices. Drill 20 starts at its 30-second boundary.
- A drawn Rail lines mark exported as `rail-lines.png` with the PNG signature.
  Saving changed progress from two to three sessions; JSON export contained all
  three sessions and the new stroke. Clear disabled stale replay/save actions.
- Blank license input announced “Paste a license token first.” A fresh live
  returned invalid token was removed from the URL, received `valid:false`, and
  left notes/save-note/print locked both before and after the response.
- Reset restored two demo records. Start for real deleted the demo localStorage
  and IndexedDB record, then opened `/practice`.
- Keyboard-only: the skip link is first, has a 4px visible focus outline, and
  focuses the h1. The canvas has a 5px visible focus outline; Space/Arrows/Shift
  draw, Escape clears, and saving works. No trap was observed.
- At 390px, touch drawing works, checked navigation/demo/footer targets are at
  least 44×44px, there is no horizontal overflow, and forced 200% text does not
  introduce horizontal loss.
- Reduced-motion replay is immediate, transitions are `0s`, and the polite
  status says “Replay shown without motion.”
- Real-data save/reload/replay and separate demo storage pass the authored tests
  and independent storage inspection.

## Accessibility, structure, and console

- Live `/`, `/demo`, `/practice`, `/privacy`, `/terms`, and the real 404 have
  `lang=en`, one h1, one main landmark, route titles, and zero axe
  serious/critical findings on desktop; mobile demo also has zero.
- `/opt/fleet/lib/verify-url.sh` on live `/demo`: HTTP 200, 680ms measured load,
  no console errors, correct title/language, one h1, main present, no missing
  image alternatives, and no unlabeled buttons.
- Independent landing/demo/practice/mobile flows produced no console or page
  errors.

## Privacy, paid endpoint, and rate limit

- The complete ordinary demo draw/save/export/reset/start-real flow made four
  requests, all same-origin. No analytics, CDN, font, or artwork-upload request
  was observed.
- License verification is the documented cross-origin exception and goes only
  to `https://api.sociobot.in`.
- Checkout returns HTTP 303 to an HTTPS
  `checkout.dodopayments.com/session/cks_…` URL.
- In a fresh sequential run the verify endpoint returned 200 for requests
  1–30. Request 31 returned **429** with `Retry-After: 3`. Observed allowance:
  **30 requests per window**.
- There is no sign-in, product backend, library, or CLI surface, so the related
  conditional checks do not apply.

## Deployment identity, headers, caching, and PWA

- All 15 public files in the clean `dist/` build byte-match live, including
  HTML, hashed JS/CSS, art, icons, worker, manifest, offline/404 pages, robots,
  sitemap, and social image. Local and live `index.html` SHA-256:
  `7bd26c68e72b845cdd391522c42a2b3c0353a536297ae5028e0012d927c01e2b`.
- Shell routes are `no-cache`; hashed JS/CSS are
  `public, max-age=31536000, immutable`; `sw.js` is `no-cache`.
- HSTS, CSP, `nosniff`, and strict-origin referrer headers are present. Unknown
  routes return HTTP 404. Chrome reports no manifest/installability errors.
- Fresh live landing-only install, reload, offline navigation to previously
  unvisited `/practice`: PASS; the normal practice h1 renders, not the fallback.
- Controlled exact-build worker v3→v4 update: PASS. A real waiting worker shows
  the update action; activating reloads, deletes v3, and retains v4 only.

## Performance

Second clean Lighthouse 12.8.2 mobile run on live `/demo` (full-page screenshot
audit disabled): Performance 99, Accessibility 100, Best Practices 100, SEO
100; LCP 1.0s, CLS 0, TBT 130ms, Speed Index 0.9s. An earlier run scored 98/100/
100/92 solely because Lighthouse transiently could not download `robots.txt`;
direct retrieval and the repeat both passed.

## Release-blocking findings

### H1 — Mobile first screen does not show the first action

At 390×844, **Try it with sample data** begins 6.875px below the viewport. A
false service-worker notice simultaneously overlays most of the audience copy.
The first screen therefore does not plainly show what to click first, violating
the explicit first-read acceptance gate.

### H2 — Left-handed layout has no effect on a 390px phone

On `/practice` at 390px, clicking **Right-handed layout** changes the label to
**Left-handed layout**, adds the `left` class, and persists the boolean. Before
and after, the deck is exactly x=16, y=282.1875, width=358 and the drill list is
x=16, y=1003.5, width=358. No control or canvas moves. The brief requires a
left-handed layout for phone/tablet learners; changing only the label does not
deliver it on the primary phone viewport.

### H3 — “Sample data” contains no drawable sample data

The demo seeds two sessions, but both have `strokes: []`. These records cannot
be created through the real UI because Save is disabled without a mark. The
same first demo screen claims two saved drills while Saved takes says “No saved
marks yet,” so the user cannot replay either sample. This is not the realistic,
opinionated, already-used sandbox required by the demo contract.

### H4 — Visitor-facing claims remain outside `.factory/claims.json`

Material live statements have no matching registry entry and exact tagged
test:

- the **Right-handed layout / Left-handed layout** control;
- “Hold Shift for longer steps” and “Press Escape to clear.” The
  `keyboard-drawing` claim names only Space/Arrow behavior; its test does not
  compare Shift distance or exercise Escape;
- `/terms`: “refunds … are handled by Sociobot, the merchant of record.”

Independent checks found the keyboard instructions work, but the claims rule
requires registry coverage, not ad hoc verifier proof. Any unlisted claim is
release-blocking under the supplied contract.

## Other findings

### M1 — Every first install shows a false, inert update prompt

In each fresh browser context, the first worker installation briefly passes
through `registration.waiting`, which creates “A newer drill tape is ready.” By
the time it is visible, `waiting` is null, the worker is already active and
controlling, and **Update app** does nothing: after 1.2 seconds the toast, URL,
active worker, and controller are unchanged. A genuine controlled update works;
the defect is specifically the misleading first-install state.

### M2 — Exported progress cannot be imported

The app exports progress JSON but has no import control or code path. A user
cannot restore their local progress after clearing data or moving devices,
contrary to the supplied local-first requirement for explicit export/import.

### L1 — Generated-art provenance is incomplete

The sidecar records the prompt, `factory-image` deployment, size, and quality,
but neither it nor `.factory/design.md` records a generation date or explicit
licensing/provenance statement in the required form. The design document also
describes generation in future tense even though the asset ships.

## Required repair and re-verification

1. Keep the mobile primary action inside the first 390×844 viewport and never
   show an update prompt for the initial installation.
2. Make left-handed mode materially rearrange phone controls and add a tagged
   claim test at 390px.
3. Seed replayable, plausible strokes for both demo sessions and assert their
   presence/replay in the demo claim.
4. Register/test every remaining visitor claim, or remove the unsupported copy.
5. Add safe validated progress JSON import and round-trip coverage.
6. Rerun every claim command, all quality gates, mobile first-read, first-install
   and genuine-update paths, live parity, axe, offline reload, and Lighthouse.
