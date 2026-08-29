# Adversarial first-read review 3 — FAIL

**Reviewed:** 2026-08-29 UTC
**Live URL:** <https://touch-canvas-drills.sociobot.in>
**Source baseline:** `1fc8ab656b2707cf3fa1b7d6dd0fb1aeea0be59c`

## Verdict

**FAIL.** One blocking demo defect and four minor copy or claims-governance
findings remain. The first landing screen is clear, the underlying sample data
and isolation work, and all 21 registered claims pass. The acceptance rule is
zero findings, so those passes do not override the findings below.

## First read before scrolling

Fresh browser contexts at 390×844 and 1440×900 answered all three questions:

- **What it does:** short, guided touch-drawing practice.
- **For whom:** people learning to draw on a phone or tablet who want steadier
  marks without a desktop editor.
- **First click:** **Try it with sample data**. The adjacent line says
  **“Starts a ready-to-draw sample drill.”**

At 390 px the primary action occupied y=427–473, and its explanation ended at
y=527, before scrolling. At desktop size the action, explanation, three facts,
and original hero art were visible. Both cold loads returned 200 and produced
no console or page errors.

The first screen therefore passes the landing clarity gate. The cream dotted
paper, blue rules, coral ink, cassette shapes, offset shadows, and locally
served illustration match `.factory/design.md` and do not resemble a generic
SaaS template.

## Findings

### F-3-1 — BLOCKING — The demo opens on a blank drill instead of visibly showing its sample work

**Location:** live `/?demo=1` and `/demo`, first viewport at 390×844 and
1440×900.

**Exact copy:** **“Try it with sample data”**, followed by **“Demo — sample
data, nothing is saved.”**

**Evidence:** after the one click, the active **Rail lines** canvas contains
13,801 blue guide pixels and **zero coral sample-mark pixels**. It is an
untouched guide, not the product already being used. At 390 px, the canvas
starts at y=544 while the two marked saved drills start at y=1764. At desktop
size, the canvas starts at y=497 and the samples at y=1602. The visitor must
scroll far below the first screen and then select **Replay saved drill** before
seeing any realistic sample work.

**Why this fails first use:** the supplied demo contract requires the first
screen after the click to show the product being used with realistic sample
data. A blank guide is indistinguishable from a new empty practice. The button
promises sample data, but its immediate result does not demonstrate the value.

**Concrete fix:** on demo entry, load the bundled `sample-1` Rail lines strokes
into the active canvas and show them in the first viewport, with a clear replay
control. Keep the two saved drills below for exploration. Add a 390 px claim
test that enters through the landing action and asserts coral sample pixels or
equivalent loaded sample strokes before any second interaction. Reset must
restore that same visibly populated first screen.

### F-3-2 — MINOR — The footer makes an unlisted, untestable outcome claim

**Location:** landing footer and every live app route.

**Exact quote:** “Small touch drills for steadier drawing.”

**Why this is misleading:** “steadier drawing” implies a learning outcome, but
`.factory/claims.json` has no entry or test for improved steadiness. The phrase
also functions as a generic slogan rather than telling the reader a concrete
product fact.

**Concrete fix:** replace it with **“Touch-drawing practice for phones and
tablets.”** This states the use and audience without promising improvement.

### F-3-3 — MINOR — The README deployment sentence uses avoidable implementation jargon

**Location:** `README.md`, Deployment.

**Exact quote:** “The emitted `staticwebapp.config.json` adds explicit app
routes, a styled 404 response, security headers, and immutable caching for
hashed assets.”

**Why this loses a first-time reader:** “emitted,” “explicit app routes,”
“immutable caching,” and “hashed assets” require deployment knowledge. The
sentence is registered and tested, but it does not pass the plain-words rule.

**Concrete fix:** write **“The build opens each page directly, includes a
styled 404 page, and applies browser security settings and safe file
caching.”**

### F-3-4 — MINOR — The README uses an unexplained factory term and combines two claims

**Location:** `README.md`, Deployment.

**Exact quote:** “The factory registers the paid product; no credentials are
stored in this repository.”

**Why this loses a first-time reader:** “the factory” is internal process
language with no explanation. The semicolon joins checkout configuration and
repository security even though the plain-words rule requires one idea per
sentence. Only the second clause has an exact registry claim; the first is an
unlisted deployment assertion.

**Concrete fix:** replace it with **“Paid checkout is configured outside this
repository. The repository contains no credentials.”** Register the first
sentence against the checkout test if it remains a public claim.

### F-3-5 — MINOR — The README’s MIT-license claim is not in the claim registry

**Location:** `README.md`, Privacy and terms.

**Exact quote:** “This project is licensed under MIT; see LICENSE.”

**Why this fails the claims contract:** licensing is a statement a reader may
rely on. The repository has a `LICENSE` file, but no `.factory/claims.json`
entry exposes a tagged clean-clone test for the statement.

**Concrete fix:** add a `mit-license` claim whose test confirms the tracked
`LICENSE` contains the complete MIT text and that the README links to it.

## Copy audit

Counts treat a hyphenated term or path as one word. Headings, labels, and
actions are included because they must make sense when scanned alone. No unit
exceeds 22 words, and no banned marketing adjective appears. `F-*` marks the
copy findings above.

### Landing page

| Copy unit | Words | Result |
| --- | ---: | --- |
| Skip to drills | 3 | Pass |
| TC DRILLS | 2 | Pass — wordmark |
| Demo | 1 | Pass — nav |
| Practice | 1 | Pass — nav |
| Privacy | 1 | Pass — nav |
| OFFLINE PRACTICE PAD / 20 DRILLS | 5 | Pass |
| Practice touch drawing with short drills | 6 | Pass |
| For people learning to draw on a phone or tablet who want steadier marks without a desktop editor. | 18 | Pass — audience situation, not an outcome promise |
| Try it with sample data | 5 | Pass as copy; result fails F-3-1 |
| Starts a ready-to-draw sample drill. | 5 | Pass as copy; result fails F-3-1 |
| Start a blank practice | 4 | Pass |
| Works offline after the first visit | 6 | Pass — `offline-reload` |
| Your strokes stay on this device | 6 | Pass — `privacy-local` |
| Free core drills; $6 one-time extras | 6 | Pass — `free-core`, `paid-extras` |
| NEXT UP / 00:20 | 3 | Pass — preview context |
| Rail lines | 2 | Pass |
| Follow a faint guide. | 4 | Pass |
| Draw your own marks. | 4 | Pass |
| Replay the drill if you want to study it. | 9 | Pass |
| Try the Rail lines sample | 5 | Pass |
| HOW IT WORKS | 3 | Pass |
| How the drills work | 4 | Pass |
| 01 | 1 | Pass — step number |
| Pick a drill | 3 | Pass |
| Choose lines, curves, or simple shapes. | 6 | Pass |
| 02 | 1 | Pass — step number |
| Draw for one timer | 4 | Pass |
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
| Buy the extras | 3 | Pass |
| Read purchase terms | 3 | Pass |
| Small touch drills for steadier drawing. | 6 | F-3-2 |
| Privacy | 1 | Pass — footer nav |
| Terms | 1 | Pass — footer nav |
| Built by Param Factory · v1.0.5 | 5 | Pass — attribution/version |

### README

| Copy unit | Words | Result |
| --- | ---: | --- |
| Touch Canvas Drills | 3 | Pass — document title |
| Practice touch drawing with short drills. | 6 | Pass |
| It is for Android phones and tablets. | 7 | Pass |
| It can be installed as a standalone web app. | 9 | Pass — `pwa-install` |
| It works offline after the first visit. | 7 | Pass — `offline-reload` |
| What it does | 3 | Pass — heading |
| Gives 20 timed line, curve, and shape drills. | 8 | Pass — `twenty-drills` |
| Draw with a finger, stylus, or keyboard, then export one drill as PNG. | 13 | Pass — `keyboard-drawing`, `png-export` |
| Saves progress only in the browser, shows seven days, and replays saved drills. | 13 | Pass — `local-progress`, `saved-replay` |
| Exports and imports checked progress files for backup or a new device. | 12 | Pass — `progress-roundtrip` |
| Includes an isolated demo at `/?demo=1` with two replayable saved drills. | 11 | Pass — `demo-isolation` |
| The demo keeps its sample work separate from your own practice. | 11 | Pass — `demo-isolation` |
| Rearranges the phone controls for left-handed practice. | 7 | Pass — `handed-layout` |
| All 20 drills and both exports are free. | 8 | Pass — `free-core` |
| A $6 one-time Sociobot license adds private drill notes and a printable seven-day practice sheet. | 15 | Pass — `paid-extras` |
| The app does not upload artwork or use third-party analytics. | 10 | Pass — `privacy-local` |
| Run and verify | 3 | Pass — heading |
| The static deploy output is `dist/`, with `index.html` at its root. | 12 | Pass — `deployment-policy` |
| Use `npm run preview` to view that build. | 8 | Pass — instruction |
| Open `/?demo=1` to try sample data that never changes your practice. | 11 | Pass — `demo-isolation` |
| Deployment | 1 | Pass — heading |
| Deploy `dist/` as a static app. | 5 | Pass — instruction |
| The emitted `staticwebapp.config.json` adds explicit app routes, a styled 404 response, security headers, and immutable caching for hashed assets. | 19 | F-3-3 — jargon |
| The factory registers the paid product; no credentials are stored in this repository. | 13 | F-3-4 — jargon, two ideas, first claim unlisted |
| Privacy and terms | 3 | Pass — heading |
| Read the in-app privacy page and terms. | 7 | Pass — instruction |
| This project is licensed under MIT; see LICENSE. | 8 | F-3-5 — unlisted claim |

### Terminology and action check

| Concept | Terms used | Result |
| --- | --- | --- |
| Guided exercise or persisted drawing | drill, saved drill | Pass; the saved form is explicit |
| Lines drawn by the visitor | marks, strokes | Pass; UI uses marks and the privacy fact uses strokes in the physical drawing sense |
| Sample sandbox | demo, sample data, sample work | Pass; each phrase identifies the demo context |
| Paid add-on | extras | Pass; used consistently |

Landing actions name their result: **Try it with sample data**, **Start a blank
practice**, **Try the Rail lines sample**, **Buy the extras**, and **Read
purchase terms**. No landing heading depends on metaphor or brand lore.

## Demo and sandbox

- The landing action enters `/?demo=1` in one click. The persistent banner,
  **Reset demo**, and **Start for real** are present.
- The bundled data is realistic: marked Rail lines and S curves drills dated on
  the two preceding days, each with two strokes. F-3-1 records that this work
  is not visible in the first screen.
- A pre-existing real-data sentinel containing one saved drill, left-handed
  layout, and a private note was seeded into both localStorage and IndexedDB.
  The demo did not read it. Drawing and saving created a third demo drill while
  the real sentinel remained byte-for-byte unchanged.
- Reset restored exactly the two bundled samples. Start for real removed the
  demo key from localStorage and IndexedDB, retained the real sentinel in both,
  removed the banner, and opened `/practice`.
- The observed live load, drawing, save, reset, replay, and exit flow made only
  same-origin requests. The live `@claim:privacy-local` request-log test also
  passed.
- The live service worker passed `@claim:offline-reload`: after the first
  visit, a previously unvisited `/practice` deep link opened with the network
  disabled. CLI and library sandbox rules do not apply to this PWA.

## Registered claims

The exact command from every entry was run individually after `npm ci` in a
clean clone at `/tmp/tcd-review3.47tw1i/clone`. Each selected exactly one tagged
test and passed.

| Claim ID | Result | Observable check |
| --- | --- | --- |
| `twenty-drills` | PASS | 20 demo drill controls |
| `png-export` | PASS | drawn drill downloaded as `rail-lines.png` |
| `privacy-local` | PASS | complete demo flow produced same-origin requests only |
| `offline-reload` | PASS | unvisited practice route opened offline after first visit |
| `pwa-install` | PASS | manifest, maskable icons, standalone mode, active service worker |
| `demo-isolation` | PASS | two samples, reset, namespace cleanup, real namespace excluded |
| `keyboard-drawing` | PASS | Space/Arrows/Shift draw and Escape clears |
| `handed-layout` | PASS | 390 px control order changes and survives reload |
| `saved-replay` | PASS | saved drill replays after refresh |
| `local-progress` | PASS | seven-day count and exported JSON |
| `progress-roundtrip` | PASS | valid import restores without deletion; malformed import rejected |
| `free-core` | PASS | drills, save, PNG, and JSON controls work without a license |
| `paid-extras` | PASS | valid fixture exposes notes and print control |
| `invalid-license-lock` | PASS | rejected license immediately locks paid controls |
| `checkout-redirect` | PASS | Sociobot endpoint returns 303 to HTTPS Dodo checkout |
| `merchant-refunds` | PASS | terms contain the merchant/refund statement |
| `license-daily-check` | PASS | no check before 24 hours and one after expiry |
| `pressure-independent` | PASS | low- and high-pressure strokes store width 8 |
| `first-mark-timer` | PASS | timer waits for the first mark |
| `deployment-policy` | PASS | built routes, 404 override, CSP, caching, and hashed assets |
| `no-repository-credentials` | PASS | tracked and built text scan found no credential-shaped value |

The full clean-clone `npm run test:all` also passed lint, typecheck, one unit
test, build, and all 33 Playwright tests. The build emitted 10.97 kB gzip of
JavaScript. F-3-2, F-3-4, and F-3-5 are the unlisted claim-like statements.
No registered claim is untested.

## Earlier-review closure

I read `.factory/review-1.md`, `.factory/review-2.md`, `.factory/polish-1.md`,
`.factory/polish-2.md`, and the prior handoff. Every earlier finding was checked
against the live site and current source, not accepted from its closure note.

| Earlier ID | Live and source confirmation | Result |
| --- | --- | --- |
| F-1-1 | Unknown live route returns HTTP 404 with shared header/footer and complete metadata; `public/404.html` contains that shell. | Fixed |
| F-1-2 | All routes expose route-specific Twitter title, description, and image; `updateMetadata()` sets them. | Fixed |
| F-1-3 | Landing uses **How the drills work** live and in `src/main.ts`. | Fixed |
| F-1-4 | Landing uses **Your practice data stays in this browser** live and in source. | Fixed |
| F-1-5 | Paid heading is **Optional notes and printable practice sheet** live and in source. | Fixed |
| F-1-6 | Direct 404 says **PAGE NOT FOUND** and **This page does not exist.** | Fixed |
| F-1-7 | README and live copy use the same free/export and seven-day practice-sheet terms. | Fixed |
| F-1-8 | README keeps browser-storage implementation detail out of user copy; `.factory/demo.md` retains verifier detail. | Fixed |
| F-1-9 | **Try the Rail lines sample** links directly to the query demo live and in source. | Fixed |
| F-2-1 | `deployment-policy` is registered and its tagged built-artifact test passes. | Fixed |
| F-2-2 | Persisted work is consistently called a **saved drill** live, in source, README, demo docs, and claims. | Fixed |
| F-2-3 | Live and source use factual **LOCAL PRIVACY**; the old slogan is absent. | Fixed |
| F-2-4 | `no-repository-credentials` is registered and its clean-clone scan passes. | Fixed |

No earlier ID is reopened. F-3-1 is a stricter first-viewport demo defect that
the earlier checks missed: they counted populated saved records below the fold
but did not confirm that the initial canvas visibly used one.

## Structure, accessibility, and links

- `/`, `/?demo=1`, `/demo`, `/practice`, `/privacy`, and `/terms` returned 200.
  Every route has `lang=en`, exactly one h1 and main, a route-specific title,
  description, canonical, Open Graph/Twitter metadata, favicon, Apple icon,
  and the same header/footer. Titles are at most 60 characters.
- A missing URL returned a real HTTP 404 with the designed cassette-zine shell,
  complete metadata, legal links, and a working return action.
- Browser Back restored the landing route and moved focus to its h1. Forward
  route changes focused the new h1 and updated the polite route announcement.
  Direct deep links loaded their intended screen.
- A crawl of every live internal link returned 200. The only external product
  action returned the registered 303 redirect to
  `checkout.dodopayments.com`. `robots.txt`, `sitemap.xml`, the manifest,
  icons, and the 1200×630 social image returned 200.
- Live response headers include CSP, HSTS, nosniff, and strict referrer policy.
  No third-party script, font, analytics request, or console error was seen.
- Playwright Axe found no serious or critical issue on the landing, both demo
  URLs, practice, privacy, terms, or static 404. Mobile targets, 200% text,
  keyboard drawing, reduced motion, and 390 px horizontal fit passed.

No structure, routing, dead-link, visual-identity, or accessibility finding was
observed.

## Missed leverage

No additional AI feature is justified. Automated critique would conflict with
the focused offline/local practice model and its explicit no-critique promise.
The obvious non-AI extensions—PNG export, progress export/import, saved replay,
offline installation, and left-handed layout—already exist and pass their
claims. No `.factory/brief.json` is present, so this check used the shipped
README, design thesis, demo documentation, and implemented scope.

## What would make this perfect

Make the first demo viewport visibly populated with the bundled Rail lines
marks and add a regression assertion for that state. Then remove the
unverifiable steadiness slogan, rewrite the two README deployment sentences in
plain words, and register the remaining license/deployment claims. A full
review after those changes must find zero new or repeated issues.
