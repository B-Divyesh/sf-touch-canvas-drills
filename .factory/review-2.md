# Adversarial first-read review 2 — FAIL

**Reviewed:** 2026-08-29 UTC  
**Live URL:** <https://touch-canvas-drills.sociobot.in>  
**Source baseline:** `acbb13e9654fb5d0e610b6dcef124ac814a007fa`

## Verdict

**FAIL.** The usable product, demo, privacy behaviour, routes, metadata, and
all 19 registered claims passed. Four minor copy/claims-governance findings
remain. The acceptance rule for this review is zero findings.

## First read

Cold, fresh contexts at 390×844 and 1440×900 passed the first-screen gate,
before scrolling.

- **What it does:** short touch-drawing practice drills.
- **For whom:** people learning to draw on a phone or tablet who want steadier
  marks without a desktop editor.
- **First click:** **Try it with sample data**. The adjacent text says
  **“Starts a ready-to-draw sample drill.”**

At 390px, the primary action occupied y=427–473 and the adjacent explanation
was visible before scrolling. The first screen is not a generic SaaS template:
its cream, dotted-paper surface, blue rules, coral controls, cassette-tape
shapes, and ink-black type match the cassette-era zine direction in
`.factory/design.md`. The landing, demo interaction, and route changes had no
console or page errors.

## Findings

### F-2-1 — MINOR — The README makes a deployment/security claim without a registered claim test

**Location:** `README.md:36-38`.

**Exact quote:** “The emitted `staticwebapp.config.json` adds explicit app
routes, a styled 404 response, security headers, and immutable caching for
hashed assets.”

**Why this fails the claims contract:** this is a visitor-reliant assertion
about the deployed product's routes, error handling, headers, and caching. It
has no entry in `.factory/claims.json`. An untagged browser test happens to
check much of it, but the registry is the required public inventory and the
test cannot be discovered or run through a claim ID.

**Concrete fix:** add a `deployment-policy` entry to `.factory/claims.json`
and tag the existing built-artifact policy test `@claim:deployment-policy`;
the test should assert the emitted configuration, real 404 override, CSP, and
immutable hashed-asset policy. Alternatively, remove this implementation
promise from the README.

### F-2-2 — MINOR — The same saved work has four inconsistent names

**Location:** landing page: “Replay it, save the session, and return
tomorrow.”; practice UI: **“Save this drill”**, **“Saved takes”**;
`README.md:11`: “replays saved marks.”

**Why this loses a first-time visitor:** a saved drawing is alternately called
a session, drill, take, and marks. On a small screen, a person cannot tell
whether **Saved takes** is the same thing they just saved with **Save this
drill**, or whether a session contains different data.

**Concrete fix:** choose **“saved drill”** for the persisted drawing
everywhere. For example: rewrite the landing instruction as **“Replay it,
save the drill, and return tomorrow.”**, change **“Saved takes”** to **“Saved
drills”**, and change the README to **“Saves progress only in the browser,
shows seven days, and replays saved drills.”**

### F-2-3 — MINOR — “PRIVATE BY DESIGN” is a generic slogan, not a useful section label

**Location:** landing privacy section eyebrow.

**Exact quote:** “PRIVATE BY DESIGN”

**Why this fails the plain-words check:** it is a broad marketing phrase. It
does not say what privacy fact the section covers and does not help a person
scanning a screen-reader heading/label list. The following heading carries the
useful information, so this label adds only mood.

**Concrete fix:** replace it with **“LOCAL PRIVACY”**, or remove it and let
**“Your practice data stays in this browser”** name the section alone.

### F-2-4 — MINOR — The README promises that the repository has no credentials without a registered proof

**Location:** `README.md:38-39`.

**Exact quote:** “The factory registers the paid product; no credentials are
stored in this repository.”

**Why this fails the claims contract:** the second clause is a security claim a
reader may rely on when cloning or deploying the project. It is not listed in
`.factory/claims.json`, and no tagged clean-clone secret scan proves it.

**Concrete fix:** add a `no-repository-credentials` registry entry with a
tagged test that checks tracked source and build output for credentials, or
remove the security promise and state only the deployment instruction.

## Copy audit

Counts include headings, labels, and buttons because they are heard or read as
standalone copy on a phone. No unit exceeds 22 words. `F-*` denotes the
findings above; all other landing copy is plain, useful, and uses a
result-naming action.

### Landing page

| Copy unit | Words | Result |
| --- | ---: | --- |
| Skip to drills | 3 | Pass |
| TC DRILLS | 2 | Pass (wordmark) |
| Demo | 1 | Pass (nav) |
| Practice | 1 | Pass (nav) |
| Privacy | 1 | Pass (nav) |
| OFFLINE PRACTICE PAD / 20 DRILLS | 5 | Pass |
| Practice touch drawing with short drills | 6 | Pass |
| For people learning to draw on a phone or tablet who want steadier marks without a desktop editor. | 18 | Pass |
| Try it with sample data | 5 | Pass |
| Starts a ready-to-draw sample drill. | 5 | Pass |
| Start a blank practice | 4 | Pass |
| Works offline after the first visit | 6 | Pass — `offline-reload` |
| Your strokes stay on this device | 6 | Pass — `privacy-local` |
| Free core drills; $6 one-time extras | 6 | Pass — `free-core`, `paid-extras` |
| NEXT UP / 00:20 | 3 | Pass (context label) |
| Rail lines | 2 | Pass |
| Follow a faint guide. | 4 | Pass |
| Draw your own marks. | 4 | Pass |
| Keep the replay if you want to study it. | 9 | F-2-2 |
| Try the Rail lines sample | 5 | Pass |
| HOW IT WORKS | 3 | Pass |
| How the drills work | 4 | Pass |
| 01 | 1 | Pass (step number) |
| Pick a drill | 3 | Pass |
| Choose lines, curves, or simple shapes. | 6 | Pass |
| 02 | 1 | Pass (step number) |
| Draw for one timer | 4 | Pass |
| Use a finger or a stylus. | 6 | Pass |
| Pressure does not matter. | 4 | Pass — `pressure-independent` |
| 03 | 1 | Pass (step number) |
| Review your mark | 3 | Pass |
| Replay it, save the session, and return tomorrow. | 8 | F-2-2 |
| PRIVATE BY DESIGN | 3 | F-2-3 |
| Your practice data stays in this browser | 8 | Pass |
| Your sessions live in this browser. | 6 | F-2-2 |
| There is no account, upload, social feed, or automated critique. | 10 | Pass — `privacy-local` |
| Export a single drill image when you want a copy. | 10 | Pass — `png-export` |
| ONE-TIME / OPTIONAL | 3 | Pass |
| Optional notes and printable practice sheet | 6 | Pass |
| $6 | 1 | Pass — `paid-extras` |
| Paid extras add private drill notes and a printable seven-day practice sheet. | 12 | Pass — `paid-extras` |
| The 20 drills, progress, and image export stay free. | 9 | Pass — `free-core` |
| Buy the extras | 3 | Pass |
| Read purchase terms | 3 | Pass |
| Small touch drills for steadier drawing. | 6 | Pass |
| Privacy | 1 | Pass (footer nav) |
| Terms | 1 | Pass (footer nav) |
| Built by Param Factory · v1.0.4 | 5 | Pass (attribution/version) |

### README

| Copy unit | Words | Result |
| --- | ---: | --- |
| Touch Canvas Drills | 3 | Pass (document title) |
| Practice touch drawing with short drills. | 6 | Pass |
| It is for Android phones and tablets. | 7 | Pass |
| It can be installed as a standalone web app. | 9 | Pass — `pwa-install` |
| It works offline after the first visit. | 7 | Pass — `offline-reload` |
| What it does | 3 | Pass |
| Gives 20 timed line, curve, and shape drills. | 8 | Pass — `twenty-drills` |
| Draw with a finger, stylus, or keyboard, then export one drill as PNG. | 13 | Pass — `keyboard-drawing`, `png-export` |
| Saves progress only in the browser, shows seven days, and replays saved marks. | 13 | F-2-2 |
| Exports and imports checked progress files for backup or a new device. | 12 | Pass — `progress-roundtrip` |
| Includes an isolated demo at `/?demo=1` with two replayable sample sessions. | 10 | Pass — `demo-isolation` |
| The demo keeps its sample work separate from your own practice. | 11 | Pass — `demo-isolation` |
| Rearranges the phone controls for left-handed practice. | 7 | Pass — `handed-layout` |
| All 20 drills and both exports are free. | 8 | Pass — `free-core` |
| A $6 one-time Sociobot license adds private drill notes and a printable seven-day practice sheet. | 15 | Pass — `paid-extras` |
| The app does not upload artwork or use third-party analytics. | 10 | Pass — `privacy-local` |
| Run and verify | 3 | Pass |
| The static deploy output is `dist/`, with `index.html` at its root. | 12 | Pass (run instruction) |
| Use `npm run preview` to view that build. | 8 | Pass (run instruction) |
| Open `/?demo=1` to try sample data that never changes your practice. | 11 | Pass — `demo-isolation` |
| Deployment | 1 | Pass |
| Deploy `dist/` as a static app. | 5 | Pass (instruction) |
| The emitted `staticwebapp.config.json` adds explicit app routes, a styled 404 response, security headers, and immutable caching for hashed assets. | 19 | F-2-1 |
| The factory registers the paid product; no credentials are stored in this repository. | 13 | F-2-4 |
| Privacy and terms | 3 | Pass |
| Read the in-app privacy page and terms. | 7 | Pass |
| This project is licensed under MIT; see LICENSE. | 8 | Pass |

### Terminology checked

| Concept | Current terms | Result |
| --- | --- | --- |
| Persisted drawing | session, drill, take, marks | F-2-2 — choose `saved drill` |
| Sample sandbox | demo, sample data, sample work | Pass — each identifies the demo context |
| Exercise | drill | Pass |
| Paid add-on | extras | Pass |

## Demo, claims, and sandbox checks

- **One-click demo:** passed. Fresh `/?demo=1` immediately showed Rail lines,
  20 drills, two sample sessions with two marks each, and **“Demo — sample
  data, nothing is saved”** with Reset demo and Start for real.
- **Isolation:** passed. Demo storage was only
  `demo:touch-canvas-drills:data`; the real key was absent. Reset restored the
  two samples. Start for real removed the demo key from localStorage and
  IndexedDB and opened an empty `/practice`.
- **Privacy/offline:** passed. The ordinary demo flow made only same-origin
  requests. `@claim:offline-reload` passed from a fresh context after the
  landing visit. This is a web PWA, so CLI/library checks do not apply.
- **Registered claims:** the 19 exact commands in `.factory/claims.json` were
  run individually from a fresh local clone after `npm ci`; all passed:
  `twenty-drills`, `png-export`, `privacy-local`, `offline-reload`,
  `pwa-install`, `demo-isolation`, `keyboard-drawing`, `handed-layout`,
  `saved-replay`, `local-progress`, `progress-roundtrip`, `free-core`,
  `paid-extras`, `invalid-license-lock`, `checkout-redirect`,
  `merchant-refunds`, `license-daily-check`, `pressure-independent`, and
  `first-mark-timer`.
- **Unlisted claims:** all substantive landing claims map to the registry.
  F-2-1 and F-2-4 are the two README deployment/security claims with no
  registry entry.

## Earlier-review closure

I read `.factory/review-1.md`, `.factory/polish-1.md`, and the prior handoff.
There are no other earlier review or polish files. Each earlier finding was
rechecked against both the live site and source; none is re-opened.

| Earlier finding | Live and source confirmation | Result |
| --- | --- | --- |
| F-1-1 | Unknown route returns HTTP 404 with shared header/footer, one h1/main, full metadata; `public/404.html` contains the shared shell and metadata. | Fixed |
| F-1-2 | Every tested route exposes non-empty route-specific Twitter title, description, and image; `updateMetadata()` sets all three. | Fixed |
| F-1-3 | Landing heading is **“How the drills work”** in live HTML and `src/main.ts`. | Fixed |
| F-1-4 | Landing heading is **“Your practice data stays in this browser”** in live HTML and source. | Fixed |
| F-1-5 | Paid heading is **“Optional notes and printable practice sheet”** in live HTML and source. | Fixed |
| F-1-6 | Live unknown route says **“PAGE NOT FOUND”** and **“This page does not exist.”** | Fixed |
| F-1-7 | README and live paid copy consistently say **“All 20 drills and both exports are free”** and **“printable seven-day practice sheet.”** | Fixed |
| F-1-8 | README uses checked-file and separate-demo wording; storage-engine details are confined to `.factory/demo.md`. | Fixed |
| F-1-9 | Live preview action is **“Try the Rail lines sample”** and opens `/?demo=1`; source uses the same label and target. | Fixed |

## Structure, access, and links

- `/`, `/demo`, `/practice`, `/privacy`, and `/terms` returned 200. An unknown
  route returned a real 404. All have route-specific title, description,
  canonical, Open Graph/Twitter metadata, favicon/manifest, one h1, and one
  main. Titles follow the required product/what-it-does pattern.
- Direct routes, browser Back, focus handoff to the new h1, and the polite
  route announcement work. The direct Back check was repeated after the live
  route announcement settled.
- The internal-link crawl found no dead link. The only external product link
  is the explicit Sociobot checkout; its registered claim test passed.
- `robots.txt` and `sitemap.xml` are live and list the five public routes.
  Header/footer remain consistent and include the required Privacy/Terms,
  attribution, and version. The live root sends CSP, HSTS, nosniff, and a
  strict referrer policy.
- The full clean-clone `npm run test:all` passed: lint, TypeScript, one unit
  test, production build, and 31 Playwright tests, including Axe, mobile
  targets, keyboard drawing, reduced motion, metadata, 404, and routing.

## Missed leverage

No additional AI feature is expected for this local, tactile drawing-practice
tool; automated critique would conflict with its stated offline/local-first
scope. The brief-implied export/import, saved replay, left-handed layout,
offline use, and installable PWA behaviour are present and tested.

## What would make this perfect

Close F-2-1 through F-2-4: put the documented deployment and credential
guarantees into the claim registry (or remove them), and use one clear name for
a saved drawing while removing the generic privacy slogan. With those details
resolved, the product would have no finding from this review.
