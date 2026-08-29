# Adversarial first-read review 5 — FAIL

**Reviewed:** 2026-08-29 UTC

**Live URL:** <https://touch-canvas-drills.sociobot.in>

**Source baseline:** `d238a6ed8cd6b231930358e74ce9c54884f497a8`

## Verdict

**FAIL.** The product itself is clear, tryable, local-first, accessible in the
tested paths, and visually distinct. The cold first screen and one-click demo
pass. All 23 declared claim commands also exit successfully. Seven high-severity
claim-proof gaps remain, however. Several tagged tests assert labels, buttons,
or controls instead of the outcomes their public claims promise. The acceptance
rule requires zero findings and no untested claim.

No finding is classified BLOCKING in this round: no declared command failed,
the first screen answers all three required questions, and the demo immediately
shows realistic sample work without touching the seeded real record.

## Findings

### F-5-1 — HIGH — The paid-extras test does not prove the price, saved notes, or the printable seven-day sheet

**Location:** live landing price fact and paid section; live `/terms`;
`README.md:17-19`; `.factory/claims.json` claim `paid-extras`;
`tests/product.spec.ts:418-433`.

**Exact quotes:** “All 20 drills are free; extras cost $6 once”; “A $6
one-time Sociobot license adds private notes and a printable seven-day sheet.”

**Evidence:** `@claim:paid-extras` confirms that `$6` is printed on the page,
stubs a valid license response, checks that the note field is enabled and the
print button exists, then replaces `window.print` and confirms the button calls
it. It never checks the checkout amount, currency, or recurrence. It never
enters, saves, reloads, or isolates a private note. It never checks that the
printed output contains exactly seven days. An independent live checkout read
during this review did expose `one_time_price`, `price: 600`, and `currency:
USD`, but that fact is absent from the registered test and can regress without
failing it.

**Why this can mislead a first-time visitor:** price and paid deliverables are
purchase decisions. Printing the price and exposing controls does not prove
what checkout charges or what the unlocked controls produce.

**Concrete fix:** make the tagged test follow the Sociobot 303 without buying,
read authoritative checkout/product metadata, and assert one-time USD 6.00.
With a recorded valid verification fixture, save a unique note, reload, confirm
it remains local, seed activity across date boundaries, emulate print media,
and assert the printable output contains the intended seven-day sheet.

### F-5-2 — HIGH — The twenty-drills test counts controls instead of testing 20 guided drills

**Location:** landing and README claim “20 drills”; `.factory/claims.json`
claim `twenty-drills`; `tests/product.spec.ts:179-185`.

**Exact quote:** “Includes 20 guided line, curve, and shape drills.”

**Evidence:** `@claim:twenty-drills` checks only that 20 `[data-drill]`
elements exist, plus the page heading and demo banner. Twenty dead buttons,
twenty duplicate drills, or blank guides would pass. A separate untagged test
checks only triangle, diamond, and leaf guide pixels; it does not prove the
registered 20-drill claim.

**Why this can mislead a first-time visitor:** the count promises 20 usable
exercises, not 20 controls in the DOM.

**Concrete fix:** in `@claim:twenty-drills`, activate every drill and assert
its expected title, cue, timer, and non-empty guide. Assert that the inventory
contains line, curve, and shape categories and that each active canvas accepts
a mark.

### F-5-3 — HIGH — The PNG test does not inspect the downloaded file as an image

**Location:** landing privacy section, practice toolbar, README;
`.factory/claims.json` claim `png-export`; `tests/product.spec.ts:187-195`.

**Exact quote:** “Exports a single drill image as PNG.”

**Evidence:** `@claim:png-export` checks the suggested filename
`rail-lines.png` and that a readable download stream exists. It does not read
the bytes, decode the image, check dimensions, or confirm that the drawn mark
appears. A text file named `.png` would satisfy the test.

**Why this can mislead a first-time visitor:** the useful result is an
openable image containing the drawing, not a download with a PNG-looking name.

**Concrete fix:** read the download, assert the PNG signature, decode it,
assert the expected canvas dimensions, and verify pixels from the test mark are
present.

### F-5-4 — HIGH — The local-progress test never proves that seven days are shown

**Location:** practice “Last seven days” panel, README;
`.factory/claims.json` claim `local-progress`; `tests/product.spec.ts:368-382`.

**Exact quote:** “Shows seven days of local progress and exports progress as
JSON.”

**Evidence:** `@claim:local-progress` saves one drill, checks the sentence “1
saved drill on this device,” and inspects the JSON download. It never counts the
day cells, checks their dates, or confirms that activity older than seven days
is excluded from the visible summary.

**Why this can mislead a first-time visitor:** the test proves the export half
of the claim but not the promised seven-day view.

**Concrete fix:** seed activity on today, six days ago, and eight days ago;
assert exactly seven consecutive dated cells, correct in-range counts, and no
old activity in the visible calendar, then retain the JSON assertions.

### F-5-5 — HIGH — The free-core test proves enabled controls, not working free outcomes

**Location:** landing price fact and paid section, `/terms`, README;
`.factory/claims.json` claim `free-core`; `tests/product.spec.ts:408-416`.

**Exact quote:** “The 20 drills, progress, and image and data exports remain
free.”

**Evidence:** `@claim:free-core` confirms there is no active note field, counts
20 drill controls, draws once, and checks that save/PNG/JSON buttons are
enabled. It does not save, download, or inspect either export in that unlicensed
flow. A paywall or error after button activation would pass.

**Why this can mislead a first-time visitor:** “remain free” promises completed
results without a license, not merely clickable controls.

**Concrete fix:** in one fresh context with no license, activate a later drill,
save and replay it, download and inspect PNG and JSON, and assert that no
checkout, license request, or paid gate interrupts those outcomes.

### F-5-6 — HIGH — The privacy test would allow a same-origin artwork upload

**Location:** first-screen privacy fact, landing privacy section, `/privacy`,
README; `.factory/claims.json` claim `privacy-local`;
`tests/product.spec.ts:197-207`.

**Exact quotes:** “Your marks stay on this device”; “It does not send artwork
to us”; “The app does not upload artwork or use third-party analytics.”

**Evidence:** `@claim:privacy-local` records request URLs and rejects only
origins different from the product origin. A same-origin `POST` containing
canvas points would pass. The independent live flow in this review made only
same-origin GET/HEAD requests, so the deployed behavior appears correct; the
registered privacy safeguard is still weaker than the claim.

**Why this can mislead a first-time visitor:** “no upload” covers uploads to the
product's own origin as well as third parties.

**Concrete fix:** record method, resource type, and request body for the full
draw/save/export/reset flow. Require every network request to be GET or HEAD,
reject any request body containing mark/sample data, and retain the same-origin
analytics assertion.

### F-5-7 — HIGH — The demo-isolation test starts with no real data, so it cannot detect real-data deletion or overwrite

**Location:** first-screen demo action, demo banner, `/privacy`, README,
`.factory/demo.md`; `.factory/claims.json` claim `demo-isolation`;
`tests/product.spec.ts:261-316`.

**Exact quote:** “The demo keeps its sample work separate from your own
practice.”

**Evidence:** `@claim:demo-isolation` confirms that the real localStorage key
is initially absent, exercises the demo, and confirms demo records are removed
on exit. It does not seed a distinct real record in localStorage and IndexedDB,
so accidental clearing or replacement of existing real work would still pass.
This review manually seeded a saved drill, left-handed preference, and note in
both stores; demo entry, Reset, and Start for real preserved that record
byte-for-byte. The product behavior passes, but the verifier cannot protect it
from regression.

**Why this can mislead a first-time visitor:** isolation matters most when a
returning visitor already has work to protect.

**Concrete fix:** seed a unique real record in both stores before entering the
demo. After demo entry, drawing, saving, Reset, ordinary demo navigation, and
Start for real, assert byte equality of the real record while separately
checking demo cleanup.

## First read before scrolling

Fresh contexts at 390×844 and 1440×900 answer all three questions.

- **What it does:** short guided touch-drawing practice.
- **For whom:** people learning to draw on a phone or tablet who want steadier
  marks without a desktop editor.
- **What to click first:** **Try it with sample data**. The adjacent sentence
  says **“Starts a ready-to-draw sample drill.”**

At 390 px, the primary action occupies y=427–473, its explanation ends at
y=527, and all three facts end at y=678. At 1440 px, the action begins at
y=617 and the facts end at y=813 within the 900 px viewport. Both cold loads
return 200, have one h1 and one main, fit without horizontal overflow, and log
no console or page error. The first-read gate passes.

## Copy audit

Counts treat a hyphenated term, path, price, or version as one word. Headings,
labels, navigation, metadata, and image alt text are included because they are
read independently. No item exceeds 22 words. No banned marketing word,
metaphor heading, unexplained slogan, inconsistent product term, or
non-result-naming landing action was found.

### Landing page

| Copy unit | Words | Result |
| --- | ---: | --- |
| Touch Canvas Drills — Practice touch drawing | 6 | Pass — title |
| Timed touch drawing drills that work offline on phones and tablets. | 11 | Pass — description |
| Skip to drills | 3 | Pass |
| TC DRILLS | 2 | Pass — wordmark |
| Demo | 1 | Pass — navigation |
| Practice | 1 | Pass — navigation |
| Privacy | 1 | Pass — navigation |
| OFFLINE PRACTICE PAD / 20 DRILLS | 5 | Pass |
| Practice touch drawing with short drills | 6 | Pass |
| For people learning to draw on a phone or tablet who want steadier marks without a desktop editor. | 18 | Pass |
| Try it with sample data | 5 | Pass — result-naming action |
| Starts a ready-to-draw sample drill. | 5 | Pass |
| Start a blank practice | 4 | Pass — result-naming action |
| Works offline after the first visit | 6 | Pass |
| Your marks stay on this device | 6 | Pass as copy; evidence gap F-5-6 |
| All 20 drills are free; extras cost $6 once | 9 | Pass as copy; evidence gaps F-5-1/F-5-5 |
| A cassette case used as a drawing practice board with ink marks and pens. | 14 | Pass — image alt |
| NEXT UP / 00:20 | 3 | Pass |
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
| Draw until the timer ends | 5 | Pass |
| Use a finger or a stylus. | 6 | Pass |
| Pressure does not matter. | 4 | Pass |
| 03 | 1 | Pass — step number |
| Review your mark | 3 | Pass |
| Replay it, save the drill, and return tomorrow. | 8 | Pass |
| LOCAL PRIVACY | 2 | Pass |
| Your practice data stays in this browser | 7 | Pass |
| Your saved drills live in this browser. | 7 | Pass |
| There is no account, upload, social feed, or automated critique. | 10 | Pass |
| Export a single drill image when you want a copy. | 10 | Pass as copy; evidence gap F-5-3 |
| ONE-TIME / OPTIONAL | 2 | Pass |
| Optional notes and printable practice sheet | 6 | Pass |
| $6 | 1 | Pass as copy; evidence gap F-5-1 |
| Paid extras add private drill notes and a printable seven-day practice sheet. | 12 | Pass as copy; evidence gap F-5-1 |
| The 20 drills, progress, and image export stay free. | 9 | Pass as copy; evidence gap F-5-5 |
| Buy the extras | 3 | Pass — result-naming action |
| Read purchase terms | 3 | Pass — result-naming action |
| Touch-drawing practice for phones and tablets. | 6 | Pass |
| Privacy | 1 | Pass — footer navigation |
| Terms | 1 | Pass — footer navigation |
| Built by Param Factory · v1.0.7 | 5 | Pass |

### README

| Copy unit | Words | Result |
| --- | ---: | --- |
| Touch Canvas Drills | 3 | Pass — document title |
| Practice touch drawing with short drills. | 6 | Pass |
| It is for people who draw on phones and tablets. | 10 | Pass |
| It can be installed as a standalone web app. | 9 | Pass |
| It works offline after the first visit. | 7 | Pass |
| What it does | 3 | Pass — heading |
| Gives 20 timed line, curve, and shape drills. | 8 | Pass as copy; evidence gap F-5-2 |
| Draw with a finger, stylus, or keyboard, then export one drill as PNG. | 13 | Pass as copy; evidence gap F-5-3 |
| Saves progress only in the browser, shows seven days, and replays saved drills. | 13 | Pass as copy; evidence gaps F-5-4/F-5-6 |
| Exports and imports checked progress files for backup or a new device. | 12 | Pass |
| Includes an isolated demo at `/?demo=1` with two replayable saved drills. | 11 | Pass |
| The demo keeps its sample work separate from your own practice. | 11 | Pass as copy; evidence gap F-5-7 |
| Rearranges the phone controls for left-handed practice. | 7 | Pass |
| All 20 drills and both exports are free. | 8 | Pass as copy; evidence gap F-5-5 |
| A $6 one-time Sociobot license adds private drill notes and a printable seven-day practice sheet. | 15 | Pass as copy; evidence gap F-5-1 |
| The app does not upload artwork or use third-party analytics. | 10 | Pass as copy; evidence gap F-5-6 |
| Run and verify | 3 | Pass — heading |
| `npm ci` | 2 | Pass — command |
| `npm run dev` | 3 | Pass — command |
| `npm run test:all` | 3 | Pass — command |
| `npm run build` | 3 | Pass — command |
| The static deploy output is `dist/`, with `index.html` at its root. | 11 | Pass |
| Use `npm run preview` to view that build. | 8 | Pass |
| Open `/?demo=1` to try sample data that never changes your practice. | 11 | Pass |
| Deployment | 1 | Pass — heading |
| Deploy `dist/` as a static app. | 5 | Pass |
| The build opens each page directly, includes a styled 404 page, and applies browser security settings and safe file caching. | 20 | Pass |
| Paid checkout is configured outside this repository. | 7 | Pass |
| The repository contains no credentials. | 5 | Pass |
| Privacy and terms | 3 | Pass — heading |
| Read the in-app privacy page and terms. | 7 | Pass |
| This project is licensed under MIT; see LICENSE. | 8 | Pass |

### Terminology checked

| Concept | One term used | Result |
| --- | --- | --- |
| Guided exercise and saved exercise | drill / saved drill | Pass |
| User-drawn line | mark | Pass |
| Sample sandbox | demo / sample data | Pass — distinct context and contents |
| Paid add-on | extras | Pass |
| Stored history | progress | Pass |

## Demo and sandbox behavior

- The first landing action enters `/?demo=1` in one click.
- At 390×844, the canvas starts at y=544. Its two coral sample marks occupy
  approximately y=592–634, so the populated work is actually visible in the
  first viewport. The canvas contains 9,780 coral pixels before interaction.
- The persistent demo-state banner says **“Demo — sample data, nothing is
  saved”** and exposes **Reset demo** and **Start for real**.
- Two realistic saved drills are immediately replayable. Reset restores two
  records and the same 9,780 coral pixels.
- A distinct real saved drill, left-handed setting, and note were seeded into
  both localStorage and IndexedDB. Demo entry and Reset left both real records
  byte-for-byte unchanged. Start for real removed both demo records, retained
  both real records, and opened `/practice`.
- The observed landing → demo → Reset → exit request log contained only the
  product origin and only GET/HEAD requests. No console or page error occurred.
- Offline reload passed through the registered clean-clone claim test. This is
  a PWA, so CLI and library sandbox checks do not apply.

The live behavior passes. F-5-6 and F-5-7 concern missing regression strength
in the registered sandbox tests.

## Claims audit

Every exact command in `.factory/claims.json` was run separately from a clean
clone of `d238a6e` after `npm ci`. All 23 commands selected one tagged test and
passed. “PASS / incomplete” means the command exits successfully but does not
assert the full claim, as detailed in the finding.

| Claim ID | Command | Result and observed assertion |
| --- | --- | --- |
| `twenty-drills` | `npm test -- --grep @claim:twenty-drills` | PASS / incomplete — counts 20 controls; F-5-2 |
| `png-export` | `npm test -- --grep @claim:png-export` | PASS / incomplete — filename and stream only; F-5-3 |
| `privacy-local` | `npm test -- --grep @claim:privacy-local` | PASS / incomplete — rejects foreign origins only; F-5-6 |
| `clear-browser-data` | `npm test -- --grep @claim:clear-browser-data` | PASS — removes seeded localStorage and IndexedDB practice data |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS — opens an unvisited practice deep link offline after the landing visit |
| `pwa-install` | `npm test -- --grep @claim:pwa-install` | PASS — standalone manifest, maskable icons, and active service worker |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | PASS / incomplete — demo lifecycle passes but no pre-existing real sentinel; F-5-7 |
| `keyboard-drawing` | `npm test -- --grep @claim:keyboard-drawing` | PASS — Space, arrows, Shift, save, and Escape outcomes |
| `handed-layout` | `npm test -- --grep @claim:handed-layout` | PASS — mobile order changes and persists after reload |
| `saved-replay` | `npm test -- --grep @claim:saved-replay` | PASS — saved drill replays after refresh |
| `local-progress` | `npm test -- --grep @claim:local-progress` | PASS / incomplete — JSON proven, seven-day display not asserted; F-5-4 |
| `progress-roundtrip` | `npm test -- --grep @claim:progress-roundtrip` | PASS — valid import restores and malformed input preserves restored work |
| `free-core` | `npm test -- --grep @claim:free-core` | PASS / incomplete — controls enabled, outcomes not completed; F-5-5 |
| `paid-extras` | `npm test -- --grep @claim:paid-extras` | PASS / incomplete — printed price and exposed controls only; F-5-1 |
| `invalid-license-lock` | `npm test -- --grep @claim:invalid-license-lock` | PASS — rejected license immediately locks notes and print |
| `checkout-redirect` | `npm test -- --grep @claim:checkout-redirect` | PASS — 303 to an HTTPS Dodo session |
| `license-daily-check` | `npm test -- --grep @claim:license-daily-check` | PASS — no check before 24 hours, one after, none on next reload |
| `pressure-independent` | `npm test -- --grep @claim:pressure-independent` | PASS — low/high pressure save the same width |
| `first-mark-timer` | `npm test -- --grep @claim:first-mark-timer` | PASS — timer waits and then counts down |
| `deployment-policy` | `npm test -- --grep @claim:deployment-policy` | PASS — routes, real 404, CSP, immutable assets, hashed files |
| `no-repository-credentials` | `npm test -- --grep @claim:no-repository-credentials` | PASS — tracked and built text scan clean |
| `paid-checkout-setup` | `npm test -- --grep @claim:paid-checkout-setup` | PASS — public checkout leaves through Sociobot for Dodo |
| `mit-license` | `npm test -- --grep @claim:mit-license` | PASS — README link and complete MIT permission/warranty text |

No additional claim-like landing or README sentence lacks a registry entry.
The seven findings concern incomplete proof inside existing entries.

## Earlier-finding closure

Every earlier `review-*.md`, `polish-*.md`, and the incoming handoff was read.
Each earlier finding was checked in current source and on the live deployment.
The live JavaScript byte-matches the clean build. No earlier ID is reopened.

| Earlier ID | Current live and source confirmation | Result |
| --- | --- | --- |
| F-1-1 | Unknown route returns HTTP 404 with complete shared shell, legal links, metadata, and recovery action; static source matches. | Fixed |
| F-1-2 | All tested routes expose route-specific Open Graph and complete Twitter metadata; source updates them together. | Fixed |
| F-1-3 | Landing uses **How the drills work**. | Fixed |
| F-1-4 | Landing uses **Your practice data stays in this browser**. | Fixed |
| F-1-5 | Paid heading is **Optional notes and printable practice sheet**. | Fixed |
| F-1-6 | Static and SPA 404 use **PAGE NOT FOUND** and **This page does not exist.** | Fixed |
| F-1-7 | README and live price copy consistently name all 20 drills and the seven-day practice sheet. | Fixed |
| F-1-8 | README uses checked-file and isolated-sample wording; storage internals remain in demo documentation. | Fixed |
| F-1-9 | **Try the Rail lines sample** opens the populated query demo. | Fixed |
| F-2-1 | `deployment-policy` is registered and passes against the clean build. | Fixed |
| F-2-2 | Persisted drawings are consistently **saved drills**; raw lines are **marks**. | Fixed |
| F-2-3 | Factual **LOCAL PRIVACY** replaces the generic slogan. | Fixed |
| F-2-4 | `no-repository-credentials` is registered and its scan passes. | Fixed |
| F-3-1 | Demo entry and Reset visibly restore 9,780 coral Rail lines pixels in the first mobile viewport. | Fixed |
| F-3-2 | Every live app footer and the static 404 say **Touch-drawing practice for phones and tablets.** | Fixed |
| F-3-3 | README uses the reviewed plain deployment sentence. | Fixed |
| F-3-4 | README separates checkout setup and repository-credential statements; both are registered. | Fixed |
| F-3-5 | `mit-license` is registered and passes. | Fixed |
| F-4-1 | Unsupported merchant/refund wording and its copy-only claim are absent; terms retain only tested checkout and license-lock statements. | Fixed |
| F-4-2 | `clear-browser-data` is registered and clears both stores in its test. | Fixed |
| F-4-3 | README says people who draw on phones and tablets, not untested Android compatibility. | Fixed |
| F-4-4 | First-screen fact names all 20 free drills and the exact extras price. | Fixed as copy; current price-proof gap is new F-5-1 |
| F-4-5 | Visitor-facing copy consistently uses **mark**. | Fixed |
| F-4-6 | Step heading is **Draw until the timer ends**. | Fixed |

## Structure, routing, accessibility, and identity

- `/`, `/demo`, `/practice`, `/privacy`, and `/terms` return 200. A fresh
  unknown URL returns a real 404.
- Each route has `lang=en`, one h1, one main, its route title, a description,
  canonical, Open Graph/Twitter metadata, favicon, Apple icon, and the same
  header/footer. The social image is 1200×630.
- Direct links, History API navigation, browser Back, h1 focus, and the polite
  route announcement pass the live regression test.
- The internal crawl returns 200 for every link. The purchase endpoint returns
  303 to an HTTPS Dodo checkout; that page returns 200. `robots.txt`, the
  five-route sitemap, manifest, and icons are present.
- Live Playwright Axe reports no serious or critical issue on the landing,
  query demo, path demo, practice, privacy, terms, or static 404. The live route
  and Axe checks pass 2/2 with no console error.
- The clean `npm run test:all` passes lint, typecheck, 1/1 unit test, build, and
  35/35 Playwright tests. Initial JavaScript is 30.23 kB raw / 11.10 kB gzip;
  CSS is 9.60 kB raw / 2.87 kB gzip.
- The cream paper, dotted texture, blue rules, coral ink, cassette geometry,
  square corners, offset shadows, and original local artwork match
  `.factory/design.md`. The page does not resemble a generic centered-hero,
  gradient-blob SaaS template.

No structure, routing, dead-link, accessibility-baseline, performance-budget,
or generic-identity finding was observed.

## Missed leverage

No finding. The product already provides PNG export, checked progress
export/import, saved replay, local seven-day history, installable offline use,
and a left-handed layout. A normal user would not expect AI to perform this
tactile drawing drill, and automated critique would contradict the explicit
local/no-critique scope. Sync would add accounts and a privacy surface not
implied by the available scope. No runtime AI feature or provider key exists.

`.factory/brief.json` is absent, so this check used the product contract,
README, design thesis, demo document, claim registry, current implementation,
and accumulated review history.

## What would make this perfect

Close F-5-1 through F-5-7 by making each registered test prove its complete
observable promise: authoritative price and paid results, 20 working guided
drills, a decoded PNG with marks, an exact seven-day view, completed unlicensed
save/export flows, no upload to any origin, and real-data preservation during
the demo lifecycle. Then rerun every claim command and this full review. Based
on this round, no landing-copy, demo-UI, route, accessibility, visual-identity,
or product-feature change is otherwise required.
