# Adversarial first-read review 1 — FAIL

**Reviewed:** 2026-08-29 UTC  
**Live URL:** <https://touch-canvas-drills.sociobot.in>  
**Source baseline:** `dd105176767379ee48f9a10829f01c8af60cb1ff`

## Verdict

**FAIL.** The core product is clear and works, and all declared claims pass, but this review has nine findings. The acceptance rule is zero findings, not “mostly working”.

## First read

Cold loads at 390×844 and 1440×844 passed the first-screen gate.

- **What it does:** short guided drawing practice drills.
- **For whom:** people learning to draw on a phone or tablet.
- **First click:** **Try it with sample data**; the adjacent text says it starts a ready-to-draw sample drill.

At 390px the primary action occupied y=427–473, so it was visible before scrolling. The live landing page had no console or page errors. The cassette-zine artwork, cream paper, blue rules, coral actions, and square offset shadows match `.factory/design.md` and do not read as a generic SaaS template.

## Findings

### F-1-1 — HIGH — The direct 404 omits the shared header, footer, and required metadata

**Location:** live `/not-a-real-route` (HTTP 404; served from `public/404.html`).

**Evidence:** it has only a wordmark in its header and only `Privacy · Terms` in its footer. It omits the normal Demo/Practice/Privacy navigation, the footer one-liner, `Built by Param Factory`, and the version. Its head has no meta description, canonical URL, favicon/Apple icon, manifest, Open Graph metadata, or Twitter metadata.

**Why this fails first use:** a person following a stale link lands on a visibly different, incomplete site shell. It also fails the required consistent header/footer and per-route metadata checks.

**Concrete fix:** make the static 404 use the same header/footer links and copy as every route; add the normal favicon, manifest, 404 description, canonical, Open Graph, and Twitter metadata. Keep the HTTP 404 status and the working link back home.

### F-1-2 — MEDIUM — Required Twitter title, description, and image metadata is absent

**Location:** the live head on `/`, `/demo`, `/practice`, `/privacy`, and `/terms`.

**Evidence:** each page has `twitter:card` only. It lacks `twitter:title`, `twitter:description`, and `twitter:image`, although a valid local 1200×630 `social.webp` exists and the Open Graph equivalents are present.

**Why this misleads:** shared links do not carry the product-specific title, explanation, or artwork required by the site contract.

**Concrete fix:** emit route-appropriate `twitter:title` and `twitter:description`, plus `twitter:image` pointing at the existing social image, on every route and the 404 page.

### F-1-3 — MINOR — “One small mark at a time” is a mood heading, not a section name

**Location:** landing page, How it works section heading.

**Exact quote:** “One small mark at a time”

**Why this loses a first-time visitor:** heard alone in a screen-reader heading list, it does not identify the section or explain what follows.

**Concrete fix:** rewrite it as **“How the drills work”**.

### F-1-4 — MINOR — The privacy heading uses a metaphor instead of a privacy fact

**Location:** landing page, privacy section heading.

**Exact quote:** “Practice stays close to your hand”

**Why this loses a first-time visitor:** it does not say where the data is or what the privacy section covers until the paragraph below.

**Concrete fix:** rewrite it as **“Your practice data stays in this browser”**.

### F-1-5 — MINOR — The paid-section heading provides no information

**Location:** landing page, paid section heading.

**Exact quote:** “Keep the tape rolling”

**Why this loses a first-time visitor:** the phrase is brand mood, not a name for paid notes and the printable practice sheet.

**Concrete fix:** rewrite it as **“Optional notes and printable practice sheet”**.

### F-1-6 — MINOR — The 404 uses cassette metaphors in required recovery copy

**Location:** direct 404 page.

**Exact quotes:** “TAPE ENDED” and “That page is not on this tape.”

**Why this loses a first-time visitor:** the page is understandable only after the visitor infers the cassette theme. The required recovery message should state the failure plainly.

**Concrete fix:** use **“PAGE NOT FOUND”** and **“This page does not exist.”** Keep **“Back to the drills”** as the recovery action.

### F-1-7 — MINOR — README terminology is inconsistent and one statement is not useful

**Location:** `README.md`, feature and price paragraphs.

**Exact quotes:** “The free core practice is complete.” and “the printable week sheet.” The landing page instead says “Free core drills” and “printable seven-day practice sheet.”

**Why this loses a first-time visitor:** “core practice” does not name what is free, and the product calls the same paid item both a “week sheet” and a “seven-day practice sheet.”

**Concrete fix:** replace both README sentences with **“All 20 drills and both exports are free. A $6 one-time Sociobot license adds private drill notes and a printable seven-day practice sheet.”**

### F-1-8 — MINOR — README uses implementation jargon where plain user wording is available

**Location:** `README.md`, feature/demo and run/verify text.

**Exact quotes:** “Exports and imports **validated** progress JSON,” “Demo data uses a separate `demo:touch-canvas-drills:data` key in **localStorage and IndexedDB**,” and “test the **no-save sandbox**.”

**Why this loses a first-time visitor:** these terms describe browser internals rather than the useful promise: demo work is separate and imported files are checked before use.

**Concrete fix:** write **“Exports and imports checked progress files for backup or a new device. The demo keeps its sample work separate from your own practice. Open `/demo` to try sample data that never changes your practice.”** Keep the storage-engine detail in `.factory/demo.md`, where verifiers need it.

### F-1-9 — MINOR — The “Open the practice pad” button does not name the result

**Location:** landing-page preview section.

**Exact quote:** “Open the practice pad”

**Why this loses a first-time visitor:** it says which container opens rather than what the visitor gets. The target is the populated Rail lines sample.

**Concrete fix:** rename it **“Try the Rail lines sample”**.

## Copy audit

No sentence exceeds 22 words. The inventory includes headings and button labels because they are read as standalone text on a phone. `F-*` cells identify the findings above; all unflagged copy is clear or is a necessary navigation label.

### Landing page

| Copy unit | Words | Result |
| --- | ---: | --- |
| OFFLINE PRACTICE PAD / 20 DRILLS | 5 | Pass |
| Practice touch drawing with short drills | 6 | Pass |
| For people learning to draw on a phone or tablet who want steadier marks without a desktop editor. | 18 | Pass |
| Try it with sample data | 5 | Pass |
| Starts a ready-to-draw sample drill. | 5 | Pass |
| Start a blank practice | 4 | Pass |
| Works offline after the first visit | 6 | Pass |
| Your strokes stay on this device | 6 | Pass |
| Free core drills; $6 one-time extras | 6 | Pass |
| NEXT UP / 00:20 | 4 | Pass (context label) |
| Rail lines | 2 | Pass |
| Follow a faint guide. | 4 | Pass |
| Draw your own marks. | 4 | Pass |
| Keep the replay if you want to study it. | 9 | Pass |
| Open the practice pad | 4 | F-1-9 |
| HOW IT WORKS | 3 | Pass |
| One small mark at a time | 6 | F-1-3 |
| Pick a drill | 3 | Pass |
| Choose lines, curves, or simple shapes. | 6 | Pass |
| Draw for one timer | 4 | Pass |
| Use a finger or a stylus. | 6 | Pass |
| Pressure does not matter. | 4 | Pass |
| Review your mark | 3 | Pass |
| Replay it, save the session, and return tomorrow. | 8 | Pass |
| PRIVATE BY DESIGN | 3 | Pass (section label) |
| Practice stays close to your hand | 6 | F-1-4 |
| Your sessions live in this browser. | 6 | Pass |
| There is no account, upload, social feed, or automated critique. | 10 | Pass |
| Export a single drill image when you want a copy. | 10 | Pass |
| ONE-TIME / OPTIONAL | 2 | Pass (price label) |
| Keep the tape rolling | 4 | F-1-5 |
| $6 | 1 | Pass |
| Paid extras add private drill notes and a printable seven-day practice sheet. | 12 | Pass |
| The 20 drills, progress, and image export stay free. | 9 | Pass |
| Buy the extras | 3 | Pass |
| Read purchase terms | 3 | Pass |
| Small touch drills for steadier drawing. | 6 | Pass |

### README

| Copy unit | Words | Result |
| --- | ---: | --- |
| Touch Canvas Drills | 3 | Pass (document title) |
| Practice touch drawing with short drills. | 6 | Pass |
| It is for Android phones and tablets. | 7 | Pass |
| It can be installed as a standalone web app. | 9 | Pass |
| It works offline after the first visit. | 7 | Pass |
| What it does | 3 | Pass |
| Gives 20 timed line, curve, and shape drills. | 8 | Pass |
| Draw with a finger, stylus, or keyboard, then export one drill as PNG. | 13 | Pass |
| Saves progress only in the browser, shows seven days, and replays saved marks. | 13 | Pass |
| Exports and imports validated progress JSON for backup or device moves. | 11 | F-1-8 |
| Includes an isolated demo at `/demo` with two replayable sample sessions. | 11 | Pass |
| Demo data uses a separate `demo:touch-canvas-drills:data` key in localStorage and IndexedDB. | 13 | F-1-8 |
| Rearranges the phone controls for left-handed practice. | 7 | Pass |
| The free core practice is complete. | 6 | F-1-7 |
| A $6 one-time Sociobot license enables private drill notes and the printable week sheet. | 14 | F-1-7 |
| The app does not upload artwork or use third-party analytics. | 10 | Pass |
| Run and verify | 3 | Pass |
| The static deploy output is `dist/`, with `index.html` at its root. | 12 | Pass |
| Use `npm run preview` to view that build. | 8 | Pass |
| Open `/demo` to test the no-save sandbox. | 7 | F-1-8 |
| Deployment | 1 | Pass |
| Deploy `dist/` as a static app. | 6 | Pass |
| The emitted `staticwebapp.config.json` adds explicit app routes, a styled 404 response, security headers, and immutable caching for hashed assets. | 21 | Pass (maintainer deployment detail) |
| The factory registers the paid product; no credentials are stored in this repository. | 13 | Pass (maintainer deployment detail) |
| Privacy and terms | 3 | Pass |
| Read the in-app privacy page and terms. | 7 | Pass |
| This project is licensed under MIT; see LICENSE. | 8 | Pass |

## Demo, privacy, claims, and history

- **Demo:** PASS. `/demo` immediately showed the active Rail lines drill, 20 controls, two saved marked sessions, two replay buttons, and the persistent **Demo — sample data, nothing is saved** banner. In a fresh context, drawing and saving created a third session; Reset restored the two samples; Start for real opened `/practice` and left neither the demo localStorage key nor its IndexedDB record.
- **Privacy/offline:** PASS for the observed demo flow. The request log for load, replay, touch draw, save, reset, and exit contained only the product origin. No third-party script, font, analytics, artwork upload, or console error was observed. The declared offline claim test passes from the landing visit to offline `/practice`.
- **Claims:** PASS. `.factory/claims.json` lists 19 claims. After `npm ci`, each exact listed `npm test -- --grep @claim:<id>` command was run separately; all selected exactly one passing test. `npm test` then passed all 27 tests. Landing, app, legal, and README claims were cross-checked against the registry; no unlisted claim was found.
- **History:** No earlier `.factory/review-*.md` or `.factory/polish-*.md` exists. `.factory/handoff.md` and all four prior verification reports were read. Their former issues (offline first route, demo IndexedDB cleanup, keyboard drawing, touch target sizing, replay persistence, guide rendering, import/export, and first-install update notice) were rechecked live and in source and are fixed. The nine findings above are newly observed gaps, not merely a stale prior failure.

## Structure and accessibility checks

- `/`, `/demo`, `/practice`, `/privacy`, and `/terms` returned 200. Their titles, language, one h1, one main, route canonical URL, header/footer, and history route-focus behavior passed. The real unknown route returned HTTP 404 and had a working return link, but has F-1-1 and F-1-6.
- The main routes have description, canonical, favicon, Apple touch icon, Open Graph title/description/image, robots, sitemap, and a 1200×630 local social image. F-1-2 records the missing Twitter fields.
- All ordinary internal links returned 200. The hosted checkout endpoint returned 303 to an HTTPS Dodo checkout URL; it was not followed. The 404 recovery link returned 200.
- Playwright Axe found no violations on `/`, `/demo`, `/practice`, `/privacy`, `/terms`, or the direct 404 at 390px. Keyboard routing moved focus to each new h1. The canvas keyboard flow, reduced motion, and mobile layout controls passed the product tests.

## Missed leverage

No finding. The implied useful additions—PNG and JSON export/import, local replay, an isolated demo, offline operation, and left-handed layout—are present. An AI feature would not improve this focused local drawing drill and would add an avoidable privacy/cost surface.

## What would make this perfect

Ship a full, metadata-complete 404 that feels like the same application; complete the Twitter sharing metadata; and replace the identified cassette mood headings and README jargon/inconsistent terms with the proposed plain copy. Then rerun this entire review and retain the already-passing demo, privacy, claim, offline, keyboard, and mobile checks.
