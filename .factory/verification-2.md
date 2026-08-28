# Independent verification 2 — FAIL

**Candidate:** `b7ddf629f4a7b3fa29163ca8f3733715619a7105`

**Live URL:** <https://touch-canvas-drills.sociobot.in>

**Verified:** 2026-08-28 UTC

**Artifact:** offline-first PWA

## Decision

**FAIL — do not release.** The live paid checkout is unavailable, an invalid
returned license leaves paid controls usable, and the landing page has a
serious axe contrast failure. Public claims also remain outside the mandatory
claims registry. These are fresh findings against a deployment that otherwise
matches the candidate build.

No product code was changed during this verification.

## First-read gate

**PASS.** A cold 1440×900 load says “Practice touch drawing with short drills,”
names people learning on a phone or tablet, and leads with **Try it with sample
data**. The adjacent text says “Starts a ready-to-draw sample drill.” One click
opens `/demo`, showing the Rail lines pad, two sample sessions, and the
persistent “Demo — sample data, nothing is saved” banner.

In plain words: it gives phone and tablet learners short guided drawing drills;
click **Try it with sample data** first.

## Required claim tests

The first invocation from the dependency-free clone could not start because
`tsc` was not installed. After the required lockfile install (`npm ci`), every
exact command in `.factory/claims.json` ran separately through the production
demo/test entry point and selected one passing test:

| Claim | Exact command | Result |
| --- | --- | --- |
| 20 guided drills | `npm test -- --grep @claim:twenty-drills` | PASS, 1 test |
| PNG export | `npm test -- --grep @claim:png-export` | PASS, 1 test |
| local privacy | `npm test -- --grep @claim:privacy-local` | PASS, 1 test |
| offline reload | `npm test -- --grep @claim:offline-reload` | PASS, 1 test |
| demo isolation | `npm test -- --grep @claim:demo-isolation` | PASS, 1 test |
| keyboard drawing | `npm test -- --grep @claim:keyboard-drawing` | PASS, 1 test |
| saved replay | `npm test -- --grep @claim:saved-replay` | PASS, 1 test |
| local progress | `npm test -- --grep @claim:local-progress` | PASS, 1 test |
| free core | `npm test -- --grep @claim:free-core` | PASS, 1 test |
| paid extras | `npm test -- --grep @claim:paid-extras` | PASS, 1 test |

The paid-extras test uses a recorded valid response. It does not cover the live
checkout or an invalid returned token; both fail independently below.

## Clean-clone quality gates

- `npm ci`: PASS; 161 packages installed, 0 vulnerabilities.
- `npm run test:all`: PASS — lint, TypeScript, 1/1 Vitest, production build,
  and 14/14 Playwright tests.
- `npm audit --audit-level=high`: PASS, 0 vulnerabilities.
- `npm run build`: PASS; `dist/` produced.
- Build payload: JS 24.42 KB raw / 9.18 KB gzip; CSS 9.07 KB raw / 2.75 KB
  gzip; hero WebP 177.28 KB. There are no downloaded font files. These are
  within the static-product budgets.

## Independent end-to-end results

Live desktop and 390×844 mobile checks covered pointer/touch and keyboard use.

- `/demo` showed all 20 line, curve, and shape drills and two realistic sample
  sessions. Demo state existed only at `demo:touch-canvas-drills:data` in
  localStorage and IndexedDB.
- A first pointer stroke changed the timer from `00:20` to `00:19`. At the
  lower boundary it stopped at `00:00` and announced the next action.
- Saving raised progress from two to three sessions. Refresh preserved a saved
  take and **Replay saved marks** loaded it.
- PNG export produced `rail-lines.png`, 32,813 bytes, with the PNG signature.
  JSON export contained all three sessions and the newly drawn stroke.
- Drill 20, Target rings, was selectable. The left-handed toggle changed the
  app layout. Free notes stayed disabled and the print control stayed absent.
- Blank license input announced “Paste a license token first.”
- Demo reset returned to exactly two samples. **Start for real** removed the
  demo key from both storage systems and opened `/practice`.
- The drawing pad was reachable by Tab, had a 5px blue focus outline, accepted
  Space/Arrow/Shift keyboard drawing, and saved the result. The skip link was
  the first focus target, became visible, and moved focus to the page heading.
- At 390px there was no horizontal overflow, touch drawing enabled Save, and
  200% text still fit the viewport. Normal visible controls met 44px targets;
  the off-screen skip link measured 43.5px high due to fractional line layout.
- Reduced-motion CSS removed transitions and animation. Replay rendered
  immediately, but the promised status text was not placed in the live region
  (finding M2).
- The ordinary demo draw/save/export/reset flow made same-origin requests only
  and produced no console or page errors.

## Accessibility and structure

- `/`, `/demo`, `/practice`, `/privacy`, and `/terms` returned 200 with unique
  titles, `lang=en`, one `h1`, one `main`, and route-correct canonicals.
- `/not-real` returned a genuine 404 with a styled recovery link and no
  serious/critical axe findings.
- Axe found no serious/critical issue on demo, practice, privacy, terms, mobile
  demo, or 404. It found one **serious** issue on `/`: **Read purchase terms**
  is blue `#075d8c` on yellow `#e8b830`, contrast **3.83:1** at 17px instead of
  the required 4.5:1.
- The worker-provided `verify-url.sh` passed live `/demo`: title, language, one
  heading, main landmark, image alternatives, button names, and zero console
  errors. Its measured load was 605ms.

## PWA, offline, and update behavior

- Chrome reported no app-manifest or installability errors. The manifest has a
  versioned start URL, standalone display, 192px and 512px maskable/any icons,
  and thesis-matched colors.
- A fresh context visited only `/`, waited for worker control, reloaded, went
  offline, and opened previously unvisited `/practice` successfully. Cache
  `touch-drills-v2` contained the precached shell.
- In a controlled server using the exact `dist/` build, changing the worker to
  cache `touch-drills-v3` displayed “A newer drill tape is ready.” Clicking
  **Update app** activated the worker, reloaded, removed v2, and left v3.

## Deployment identity, privacy, headers, and rate limiting

- Fifteen public files in the fresh `dist/` build byte-matched live, including
  `index.html`, hashed JS/CSS, hero art, manifest, worker, icons, offline page,
  robots, sitemap, social image, and 404 page. `index.html` SHA-256 was
  `e470a6f0c791ba5c3a1e6774085e8a32617a6f7082edd19bf4fb4e93a8aee478`.
  `staticwebapp.config.json` is consumed by Azure rather than exposed; the live
  behavior and headers match it. The deployment is the candidate.
- Shell routes use `Cache-Control: no-cache`; hashed JS/CSS use
  `public, max-age=31536000, immutable`; the worker uses `no-cache`.
- Live responses include HSTS, CSP, `X-Content-Type-Options: nosniff`, and
  `Referrer-Policy: strict-origin-when-cross-origin`. CSP limits runtime
  connections to self and `https://api.sociobot.in`.
- The product has no sign-in, backend, library, or CLI surface, so those
  conditional checks do not apply.
- The Sociobot verify endpoint returned 200 with `valid:false` for 30 sequential
  invalid requests. Request 31 returned **429** with `Retry-After: 4` and
  `X-RateLimit-After: 4`. Observed allowance: **30 requests per window**.

## Performance

A fresh Lighthouse 12.8.2 mobile run against live `/demo`, with the full-page
screenshot disabled, completed without a runtime error:

- Performance 95
- Accessibility 100
- Best Practices 100
- SEO 100
- LCP 1.4s, CLS 0, TBT 240ms, Speed Index 1.2s, interactive 1.6s

## Release-blocking findings

### H1 — The advertised paid checkout returns 404

The landing page links **Buy the extras** to
`https://api.sociobot.in/api/v1/products/touch-canvas-drills/checkout`. A fresh
GET returned HTTP 404 with:

```json
{"error":"enabled factory product","status":404}
```

The product advertises a $6 one-time purchase, but a visitor cannot buy it.
This appears to be product registration/deployment state, but it still blocks
release under the live acceptance contract.

### H1 — Any returned token leaves paid features usable after rejection

Open `/practice?license=definitely-invalid-<timestamp>` in a fresh context. The
app strips the token and live verification returns 200 with `valid:false`. The
page says “License no longer active,” and stored `licenseValid` becomes false,
but the note remains enabled, **Save note** remains present, and **Print
practice week** remains present. A QA note was successfully saved after the
rejection. Reloading finally locks the controls.

The return-token path grants paid UI optimistically and the invalid-response
path updates storage/message without rerendering the locked state.

### H1 — Landing-page contrast fails the non-negotiable baseline

Axe classifies **Read purchase terms** as serious: 3.83:1 contrast versus the
required 4.5:1. The supplied accessibility contract requires zero
serious/critical axe issues before handoff.

### H1 — Public claims are missing from `.factory/claims.json`

The registry does not list or sandbox-test several visitor-reliant statements:

- README: “installable offline-first web app.”
- Privacy: verification contacts Sociobot only when a license is added or the
  cached check is older than one day.
- Practice instructions: “Pressure does not matter” and “Timer runs on first
  mark.”

Independent QA observed installability and timer behavior, but the claims
contract requires each claim in the registry with exactly one tagged sandbox
test. The daily verification and pressure behavior were not proven there.

## Other findings

### M1 — Clear leaves stale actions enabled

After drawing, **Clear marks** removes the strokes but leaves **Save this
drill** and **Replay marks** enabled. Both controls then silently do nothing.
The recovery action should also restore the disabled empty state.

### M2 — Reduced-motion replay gives no visible or announced result

With `prefers-reduced-motion: reduce`, replay correctly avoids animation, but
the status region remains “Your timer starts when you draw.” The implementation
updates an internal string without updating the live region, so the action has
no user feedback.

### L1 — Update toast has a moderate axe landmark finding

When a waiting worker adds the update toast, axe reports its text outside a
landmark (`region`, moderate). This is not a serious/critical failure, but it
should be corrected with the release blockers.

## Recommended re-verification

Register/enable the live Sociobot checkout, rerender immediately after invalid
license verification, fix the landing-link contrast, add missing claim entries
and tagged sandbox tests, and repair the two stale-feedback states. Then rerun
every claim command, `npm run test:all`, the live invalid-token and checkout
paths, landing axe, offline/update checks, and deployment byte comparison.
