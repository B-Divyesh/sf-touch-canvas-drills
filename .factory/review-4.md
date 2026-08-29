# Adversarial first-read review 4 — FAIL

**Reviewed:** 2026-08-29 UTC

**Live URL:** <https://touch-canvas-drills.sociobot.in>

**Source baseline:** `3f13c9864d6d4bc5fa9c7f04dc482aea77bab2ce`

## Verdict

**FAIL.** The first screen, one-click demo, real-data isolation, offline flow,
routing, accessibility baseline, and all 23 registered claim commands pass.
Six findings remain: one high-severity claim-proof gap and five minor copy or
claims-governance gaps. The acceptance rule is zero findings.

There is no blocking finding in this round. In particular, no listed claim
command failed, the first screen answers all three required questions, and the
demo opens with realistic sample marks already visible.

## First read before scrolling

Fresh browser contexts at 390×844 and 1440×900 answered all three questions:

- **What it does:** short, guided touch-drawing practice.
- **For whom:** people learning to draw on a phone or tablet who want steadier
  marks without a desktop editor.
- **What to click first:** **Try it with sample data**. The adjacent line says
  **“Starts a ready-to-draw sample drill.”**

At 390 px, the primary action, its result, the blank-practice alternative, and
all three facts were visible before scrolling. At desktop size, those elements
and the original cassette-case art were visible. Both cold loads returned 200
with no console or page error. Evidence: [mobile first screen](evidence/review-4/live/landing-mobile.png)
and [desktop first screen](evidence/review-4/live/landing-desktop.png).

The landing gate passes. Its cream dotted paper, blue rules, coral ink,
cassette geometry, offset shadows, and locally served illustration match
`.factory/design.md` and do not look like a generic SaaS template.

## Findings

### F-4-1 — HIGH — The merchant/refund claim test only checks that the claim was printed

**Location:** live `/terms`; `.factory/claims.json` claim
`merchant-refunds`; `tests/product.spec.ts` test
`@claim:merchant-refunds`.

**Exact quote:** “Checkout, refunds, and license revocation are handled by
Sociobot, the merchant of record.”

**Evidence:** the tagged test opens `/terms`, asserts that exact sentence is
visible, and checks that a Privacy link exists. It does not verify a merchant
record, a refund policy, a refund path, or revocation handling. The separate
checkout test proves only that the purchase URL redirects through Sociobot to
Dodo. The command passes, but it does not prove the outcome a buyer is asked to
rely on.

**Why this misleads a first-time visitor:** merchant and refund responsibility
affect whether a visitor is willing to pay. Repeating the legal assertion in a
test is not independent evidence that the assertion is true.

**Concrete fix:** expose an authoritative public Sociobot product-terms or
merchant endpoint and make `@claim:merchant-refunds` assert its merchant and
refund fields, plus retain the existing revoked-license behavior test. If no
such verifiable source exists, remove the merchant/refund assertion and use
only the proven wording: **“Payment opens Sociobot’s hosted checkout. A
rejected or revoked license locks notes and printing.”** Link to an
authoritative refund policy before making a refund promise.

### F-4-2 — MINOR — The privacy page makes an unlisted data-deletion claim

**Location:** live `/privacy`; `src/main.ts` legal copy.

**Exact quote:** “Clearing browser data removes local practice data.”

**Evidence:** `.factory/claims.json` has no entry for this sentence. No tagged
test clears the origin's localStorage and IndexedDB and then confirms that the
practice data is gone.

**Why this matters:** this is the only deletion instruction given to a person
who wants their data removed. It is a privacy promise, not incidental prose.

**Concrete fix:** add a `clear-browser-data` claim and a tagged test that seeds
both stores, clears all storage for the product origin through the browser
protocol, reloads, and confirms that no practice record remains.

### F-4-3 — MINOR — The README makes an unlisted Android compatibility claim

**Location:** `README.md`, opening paragraph.

**Exact quote:** “It is for Android phones and tablets.”

**Evidence:** no claim entry or Android-device test covers platform
compatibility. The landing page uses the broader terms “phone or tablet,” and
the browser suite uses Chromium viewports rather than an Android environment.

**Why this misleads a first-time reader:** naming Android reads as tested
platform support. The available evidence proves a responsive web interface,
not Android-specific compatibility.

**Concrete fix:** replace it with **“It is for people who draw on phones and
tablets.”** If Android support is intentionally guaranteed, register it and
run the core draw, save, export, install, and offline flows on an Android
browser in the claim sandbox.

### F-4-4 — MINOR — The first-screen price fact uses the undefined term “core”

**Location:** live landing first screen.

**Exact quote:** “Free core drills; $6 one-time extras”

**Evidence:** “core drills” is not defined elsewhere. The later pricing copy
uses the concrete scope “The 20 drills,” while the README says “All 20
drills.”

**Why this slows a first-time visitor:** “core” leaves open whether some drills
are paid. The fact is meant to answer price at a glance.

**Concrete fix:** write **“All 20 drills are free; extras cost $6 once.”**

### F-4-5 — MINOR — User drawings are called both “strokes” and “marks”

**Location:** live landing first screen and later landing sections.

**Exact quotes:** “Your strokes stay on this device”; “Draw your own marks”;
“Review your mark.”

**Evidence:** the user-facing action and review copy consistently uses
“mark,” but the first-screen privacy fact switches to “strokes.” The
plain-words rule requires one word for one concept.

**Why this slows a first-time visitor:** the privacy fact should refer to the
same thing the drawing instructions ask the visitor to create.

**Concrete fix:** use **“mark”** in user-facing copy. Rewrite the fact as
**“Your marks stay on this device.”** Internal storage may continue to call
its records strokes.

### F-4-6 — MINOR — “Draw for one timer” is not a clear standalone step heading

**Location:** live landing, How the drills work, step 2.

**Exact quote:** “Draw for one timer”

**Evidence:** the phrase is grammatically awkward and does not state whether
the visitor starts, watches, or finishes the timer.

**Why this loses a first-time visitor:** headings must make sense when heard
without their surrounding card. “One timer” is not a usual duration or task.

**Concrete fix:** write **“Draw until the timer ends.”**

## Copy audit

Counts treat a hyphenated term, path, or version as one word. Headings,
labels, actions, metadata, and image alt text are included because they are
read independently. No unit exceeds 22 words and no banned marketing word is
present. `F-*` marks the findings above.

### Landing page

| Copy unit | Words | Result |
| --- | ---: | --- |
| Touch Canvas Drills — Practice touch drawing | 6 | Pass — page title |
| Timed touch drawing drills that work offline on phones and tablets. | 11 | Pass — metadata; `offline-reload`, `first-mark-timer` |
| Skip to drills | 3 | Pass |
| TC DRILLS | 2 | Pass — wordmark |
| Demo | 1 | Pass — navigation |
| Practice | 1 | Pass — navigation |
| Privacy | 1 | Pass — navigation |
| OFFLINE PRACTICE PAD / 20 DRILLS | 5 | Pass |
| Practice touch drawing with short drills | 6 | Pass |
| For people learning to draw on a phone or tablet who want steadier marks without a desktop editor. | 18 | Pass — audience and situation |
| Try it with sample data | 5 | Pass — result-naming action |
| Starts a ready-to-draw sample drill. | 5 | Pass |
| Start a blank practice | 4 | Pass — result-naming action |
| Works offline after the first visit | 6 | Pass — `offline-reload` |
| Your strokes stay on this device | 6 | F-4-5 |
| Free core drills; $6 one-time extras | 6 | F-4-4 |
| A cassette case used as a drawing practice board with ink marks and pens. | 14 | Pass — image alt |
| NEXT UP / 00:20 | 3 | Pass — preview context |
| Rail lines | 2 | Pass |
| Follow a faint guide. | 4 | Pass |
| Draw your own marks. | 4 | Pass |
| Replay the drill if you want to study it. | 9 | Pass |
| Try the Rail lines sample | 5 | Pass — result-naming action |
| HOW IT WORKS | 3 | Pass |
| How the drills work | 4 | Pass |
| 01 | 1 | Pass — step number |
| Pick a drill | 3 | Pass |
| Choose lines, curves, or simple shapes. | 6 | Pass |
| 02 | 1 | Pass — step number |
| Draw for one timer | 4 | F-4-6 |
| Use a finger or a stylus. | 6 | Pass |
| Pressure does not matter. | 4 | Pass — `pressure-independent` |
| 03 | 1 | Pass — step number |
| Review your mark | 3 | Pass |
| Replay it, save the drill, and return tomorrow. | 8 | Pass |
| LOCAL PRIVACY | 2 | Pass |
| Your practice data stays in this browser | 7 | Pass |
| Your saved drills live in this browser. | 7 | Pass — `saved-replay`, `privacy-local` |
| There is no account, upload, social feed, or automated critique. | 10 | Pass — `privacy-local` |
| Export a single drill image when you want a copy. | 10 | Pass — `png-export` |
| ONE-TIME / OPTIONAL | 2 | Pass |
| Optional notes and printable practice sheet | 6 | Pass |
| $6 | 1 | Pass — `paid-extras` |
| Paid extras add private drill notes and a printable seven-day practice sheet. | 12 | Pass — `paid-extras` |
| The 20 drills, progress, and image export stay free. | 9 | Pass — `free-core` |
| Buy the extras | 3 | Pass — result-naming action |
| Read purchase terms | 3 | Pass — result-naming action |
| Touch-drawing practice for phones and tablets. | 6 | Pass |
| Privacy | 1 | Pass — footer navigation |
| Terms | 1 | Pass — footer navigation |
| Built by Param Factory · v1.0.6 | 5 | Pass — attribution/version |

### README

| Copy unit | Words | Result |
| --- | ---: | --- |
| Touch Canvas Drills | 3 | Pass — document title |
| Practice touch drawing with short drills. | 6 | Pass |
| It is for Android phones and tablets. | 7 | F-4-3 — unlisted compatibility claim |
| It can be installed as a standalone web app. | 9 | Pass — `pwa-install` |
| It works offline after the first visit. | 7 | Pass — `offline-reload` |
| What it does | 3 | Pass — heading |
| Gives 20 timed line, curve, and shape drills. | 8 | Pass — `twenty-drills`, `first-mark-timer` |
| Draw with a finger, stylus, or keyboard, then export one drill as PNG. | 13 | Pass — `keyboard-drawing`, `png-export` |
| Saves progress only in the browser, shows seven days, and replays saved drills. | 13 | Pass — `local-progress`, `saved-replay`, `privacy-local` |
| Exports and imports checked progress files for backup or a new device. | 12 | Pass — `progress-roundtrip` |
| Includes an isolated demo at `/?demo=1` with two replayable saved drills. | 11 | Pass — `demo-isolation` |
| The demo keeps its sample work separate from your own practice. | 11 | Pass — `demo-isolation` |
| Rearranges the phone controls for left-handed practice. | 7 | Pass — `handed-layout` |
| All 20 drills and both exports are free. | 8 | Pass — `free-core` |
| A $6 one-time Sociobot license adds private drill notes and a printable seven-day practice sheet. | 15 | Pass — `paid-extras` |
| The app does not upload artwork or use third-party analytics. | 10 | Pass — `privacy-local` |
| Run and verify | 3 | Pass — heading |
| The static deploy output is `dist/`, with `index.html` at its root. | 11 | Pass — build instruction and `deployment-policy` |
| Use `npm run preview` to view that build. | 8 | Pass — instruction |
| Open `/?demo=1` to try sample data that never changes your practice. | 11 | Pass — `demo-isolation` |
| Deployment | 1 | Pass — heading |
| Deploy `dist/` as a static app. | 5 | Pass — instruction |
| The build opens each page directly, includes a styled 404 page, and applies browser security settings and safe file caching. | 20 | Pass — `deployment-policy` |
| Paid checkout is configured outside this repository. | 7 | Pass — `paid-checkout-setup` |
| The repository contains no credentials. | 5 | Pass — `no-repository-credentials` |
| Privacy and terms | 3 | Pass — heading |
| Read the in-app privacy page and terms. | 7 | Pass — instruction |
| This project is licensed under MIT; see LICENSE. | 8 | Pass — `mit-license` |

### Terminology and action check

| Concept | Terms found | Result |
| --- | --- | --- |
| Guided exercise or persisted drawing | drill, saved drill | Pass |
| A line drawn by the visitor | mark, stroke | F-4-5 — use `mark` in user copy |
| Free product scope | core drills, 20 drills, all 20 drills | F-4-4 — name all 20 drills |
| Sample sandbox | demo, sample data, sample work | Pass — each identifies the demo context |
| Paid add-on | extras | Pass |

All landing buttons use verbs and state their result. F-4-6 is the only
standalone landing heading that fails the plain-language check.

## Demo and sandbox behavior

- The landing action enters `/?demo=1` in one click. The persistent **Demo —
  sample data, nothing is saved** banner, **Reset demo**, and **Start for real**
  are present.
- At 390×844, the canvas begins at y=544 and contains 9,780 coral sample-mark
  pixels before a second interaction. The active Rail lines sample and its
  replay control are therefore visible in the first viewport. Evidence:
  [demo first screen](evidence/review-4/live/demo-mobile.png).
- Two realistic saved drills are present. Reset restores the same 9,780 coral
  pixels and two saved drills.
- A real-data sentinel containing a saved drill, left-handed preference, and
  note was seeded in both localStorage and IndexedDB. Entering, resetting, and
  leaving the demo preserved it byte-for-byte. **Start for real** removed the
  demo record from both stores and retained the real record in both.
- The request log covering load, demo entry, reset, and exit contained no
  cross-origin request and no non-GET/HEAD request. There was no console or
  page error. The registered live privacy and offline tests also passed.

The PWA sandbox requirement passes. CLI and library sandbox rules do not apply.

## Registered claims

The exact command in every `.factory/claims.json` entry was run separately
after `npm ci` in a clean clone at commit
`3f13c9864d6d4bc5fa9c7f04dc482aea77bab2ce`. Every command selected one tagged
test and exited successfully.

| Claim ID | Command result | Observable assertion |
| --- | --- | --- |
| `twenty-drills` | PASS | 20 guided-drill controls load in the demo |
| `png-export` | PASS | drawing produces a `rail-lines.png` download stream |
| `privacy-local` | PASS | demo draw/save/reset produces only same-origin requests |
| `offline-reload` | PASS | an unvisited practice deep link opens offline after the first landing visit |
| `pwa-install` | PASS | manifest, maskable icons, standalone display, and active service worker |
| `demo-isolation` | PASS | visible sample marks, two saved samples, reset, and demo-store cleanup |
| `keyboard-drawing` | PASS | Space, Arrows, Shift, save, and Escape work |
| `handed-layout` | PASS | mobile control order changes and survives reload |
| `saved-replay` | PASS | a saved drill replays after refresh |
| `local-progress` | PASS | seven-day count and exported JSON contain the saved drill |
| `progress-roundtrip` | PASS | valid import restores without deletion; malformed import is rejected |
| `free-core` | PASS | drills, saving, PNG, and JSON controls are available without a license |
| `paid-extras` | PASS | a recorded valid response enables notes and print |
| `invalid-license-lock` | PASS | a rejected response immediately locks paid controls |
| `checkout-redirect` | PASS | Sociobot returns 303 to an HTTPS Dodo checkout session |
| `merchant-refunds` | PASS command / inadequate proof | asserts only the terms sentence and Privacy link; see F-4-1 |
| `license-daily-check` | PASS | no check before 24 hours and one after expiry |
| `pressure-independent` | PASS | low- and high-pressure strokes store the same width |
| `first-mark-timer` | PASS | timer waits for the first mark, then counts down |
| `deployment-policy` | PASS | clean build contains route rewrites, 404 override, CSP, and immutable hashed assets |
| `no-repository-credentials` | PASS | tracked and built text scan finds no credential-shaped value |
| `paid-checkout-setup` | PASS | the public purchase link leaves for hosted Dodo checkout through Sociobot |
| `mit-license` | PASS | README links the complete MIT permission and warranty text |

No registered command failed, so the automatic blocking rule is not triggered.
F-4-1 records that one passing test does not prove its claim. F-4-2 and F-4-3
are the two unlisted claims found on the live pages and README. No other
claim-like sentence lacked a matching registry entry.

## Earlier-finding closure

Every earlier review, polish report, and the prior handoff was read. Each prior
finding was checked against both the live deployment and current source rather
than accepted from its closure note.

| Earlier ID | Live and source confirmation | Result |
| --- | --- | --- |
| F-1-1 | Unknown route returns HTTP 404 with the shared header/footer, one h1/main, legal links, metadata, and recovery action; `public/404.html` matches. | Fixed |
| F-1-2 | Root and every app route expose route-specific Twitter title, description, and image; `updateMetadata()` sets them. | Fixed |
| F-1-3 | Landing uses **How the drills work** live and in source. | Fixed |
| F-1-4 | Landing uses **Your practice data stays in this browser** live and in source. | Fixed |
| F-1-5 | Paid heading is **Optional notes and printable practice sheet** live and in source. | Fixed |
| F-1-6 | Static and SPA 404 copy say **PAGE NOT FOUND** and **This page does not exist.** | Fixed |
| F-1-7 | README and live copy use “all 20 drills” and “printable seven-day practice sheet.” | Fixed |
| F-1-8 | README uses checked-file and separate-demo wording; storage details remain in `.factory/demo.md`. | Fixed |
| F-1-9 | **Try the Rail lines sample** opens `/?demo=1` live and in source. | Fixed |
| F-2-1 | `deployment-policy` exists and its exact clean-build test passes. | Fixed |
| F-2-2 | Persisted drawings are consistently called **saved drills** live, in source, README, demo docs, and claims. | Fixed |
| F-2-3 | Factual **LOCAL PRIVACY** replaces the earlier slogan live and in source. | Fixed |
| F-2-4 | `no-repository-credentials` exists and its clean-clone scan passes. | Fixed |
| F-3-1 | Query and path demos load visible Rail lines marks on first entry and reset; 9,780 coral pixels were measured. | Fixed |
| F-3-2 | Every app footer and static 404 says **Touch-drawing practice for phones and tablets.** | Fixed |
| F-3-3 | README uses the reviewed plain deployment sentence. | Fixed |
| F-3-4 | README splits the checkout and credential statements; both have registered tests. | Fixed |
| F-3-5 | `mit-license` is registered and its clean-clone test passes. | Fixed |

No earlier ID is reopened. The six findings in this review concern distinct
copy and claims-governance gaps.

## Structure, routes, links, and accessibility

- `/`, `/?demo=1`, `/demo`, `/practice`, `/privacy`, and `/terms` return 200.
  A missing route returns a real HTTP 404. Every route has its required title,
  description, canonical URL, Open Graph/Twitter data, favicon, shared
  header/footer, one h1, and one main. The social image is 1200×630.
- Direct links, browser Back, h1 focus on route changes, and the polite route
  announcement passed live. `robots.txt`, `sitemap.xml`, manifest, icons, and
  every ordinary internal link return 200. The purchase link returns the
  expected 303 to an HTTPS Dodo session.
- The live root sends CSP, HSTS, nosniff, and strict-origin referrer headers.
  The real 404 sends the same policy headers. Captures are in
  [root headers](evidence/review-4/live/root-headers.txt) and
  [404 headers](evidence/review-4/live/404-headers.txt).
- `verify-url.sh` reports HTTP 200, `lang=en`, one h1, one main, complete alt
  text, labeled buttons, and no console error. See
  [verify.json](evidence/review-4/live/verify/verify.json).
- `npx @axe-core/cli` reports zero violations on the live root. Playwright Axe
  reports no serious or critical violation on the landing, both demo forms,
  practice, privacy, terms, and 404. Mobile targets, keyboard drawing, 200%
  text, reduced motion, and 390 px horizontal fit pass.
- The live HTML, service worker, static 404, JavaScript, and CSS hashes match
  the clean candidate build. Initial JavaScript is 30.21 kB raw / 11.09 kB
  gzip; CSS is 9.60 kB raw / 2.87 kB gzip.

The clean-clone `npm run test:all` passes lint, TypeScript, one unit test,
production build, and all 35 Playwright tests. A live run passes 33 portable
tests. The build-artifact `deployment-policy` test is intentionally evaluated
against `dist/`; when pointed at production it cannot fetch the host-consumed
`staticwebapp.config.json`, so that live-only invocation is not evidence of a
product failure.

No routing, metadata, dead-link, generic-template, accessibility, performance,
or deployment-parity finding was observed.

## Missed leverage

No finding. PNG export, checked JSON export/import, saved replay, offline
installation, local seven-day progress, and left-handed layout cover the
obvious extensions of the drawing-practice brief. Automated AI critique would
conflict with the focused offline/local product and its explicit no-critique
position. Sync would add an account and privacy surface that the local-first
brief does not imply.

The repository still has no `.factory/brief.json`; this review used the work
order, README, design thesis, demo documentation, claims registry, and shipped
behavior as the available scope sources.

## What would make this perfect

Provide independent proof for the merchant/refund statement or narrow it to
the hosted-checkout behavior that can be tested. Register and test the browser-
data deletion instruction, remove or test the Android-specific support claim,
and apply the three exact landing rewrites in F-4-4 through F-4-6. Then rerun
the entire review from fresh contexts. The existing demo, privacy isolation,
offline operation, route structure, accessibility baseline, and candidate/live
parity should remain unchanged.
