# Adversarial first-read review 6 — PASS

**Reviewed:** 2026-08-29 UTC  
**Live URL:** https://touch-canvas-drills.sociobot.in  
**Source baseline:** e297d9ea2b86e91cd285cc9c266041d6650d966b

## Verdict

**PASS.** No blocking, high, medium, or minor finding remains. The live product is clear on a cold phone visit, enters a real sample in one click, and all declared claims have passing clean-clone tests.

## First read before scrolling

Fresh browser contexts at 390×844 and 1440×900 answered the three cold-visit questions without scrolling.

- **What it does:** short guided touch-drawing drills.
- **For whom:** people learning to draw on a phone or tablet.
- **First action:** **Try it with sample data**. The adjacent text says **“Starts a ready-to-draw sample drill.”**

At 390px the primary action was visible at y=427–473; it was also visible on desktop. Both cold loads returned 200, had no horizontal overflow, and emitted no page or script-console error. The cream paper, ink type, blue rules, coral marks, square offset shadows, and locally hosted cassette-board art match .factory/design.md and do not read as a generic SaaS template.

## Findings

None.

## Copy audit

Word counts include navigation, headings, labels, buttons, footer copy, and alt text because they can be read independently. Command snippets and paths in the README are not sentences. No item exceeds 22 words. No jargon, banned marketing adjective, empty slogan, inconsistent product term, or non-result landing action was found.

### Landing page

| Copy unit | Words | Result |
| --- | ---: | --- |
| Skip to drills | 3 | Pass |
| TC DRILLS | 2 | Pass — wordmark |
| Demo / Practice / Privacy | 1 each | Pass — navigation |
| OFFLINE PRACTICE PAD / 20 DRILLS | 5 | Pass — context label |
| Practice touch drawing with short drills | 6 | Pass |
| For people learning to draw on a phone or tablet who want steadier marks without a desktop editor. | 18 | Pass |
| Try it with sample data | 5 | Pass — result-naming action |
| Starts a ready-to-draw sample drill. | 5 | Pass |
| Start a blank practice | 4 | Pass — result-naming action |
| Works offline after the first visit | 6 | Pass — offline-reload |
| Your marks stay on this device | 6 | Pass — privacy-local |
| All 20 drills are free; extras cost $6 once | 9 | Pass — free-core, paid-extras |
| A cassette case used as a drawing practice board with ink marks and pens. | 14 | Pass — art alt text |
| NEXT UP / 00:20 | 3 | Pass — preview label |
| Rail lines | 2 | Pass |
| Follow a faint guide. | 4 | Pass |
| Draw your own marks. | 4 | Pass |
| Replay the drill if you want to study it. | 9 | Pass |
| Try the Rail lines sample | 5 | Pass — result-naming action |
| HOW IT WORKS | 3 | Pass — section label |
| How the drills work | 4 | Pass |
| Pick a drill | 3 | Pass |
| Choose lines, curves, or simple shapes. | 6 | Pass |
| Draw until the timer ends | 5 | Pass |
| Use a finger or a stylus. | 6 | Pass |
| Pressure does not matter. | 4 | Pass — pressure-independent |
| Review your mark | 3 | Pass |
| Replay it, save the drill, and return tomorrow. | 8 | Pass |
| LOCAL PRIVACY | 2 | Pass — section label |
| Your practice data stays in this browser | 7 | Pass |
| Your saved drills live in this browser. | 7 | Pass — saved-replay, privacy-local |
| There is no account, upload, social feed, or automated critique. | 10 | Pass — privacy-local |
| Export a single drill image when you want a copy. | 10 | Pass — png-export |
| ONE-TIME / OPTIONAL | 2 | Pass — price label |
| Optional notes and printable practice sheet | 6 | Pass |
| $6 | 1 | Pass — paid-extras |
| Paid extras add private drill notes and a printable seven-day practice sheet. | 12 | Pass — paid-extras |
| The 20 drills, progress, and image export stay free. | 9 | Pass — free-core |
| Buy the extras | 3 | Pass — result-naming action |
| Read purchase terms | 3 | Pass — result-naming action |
| Touch-drawing practice for phones and tablets. | 6 | Pass |
| Privacy / Terms | 1 each | Pass — footer navigation |
| Built by Param Factory · v1.0.8 | 5 | Pass — attribution and build |

### README

| Copy unit | Words | Result |
| --- | ---: | --- |
| Touch Canvas Drills | 3 | Pass — document heading |
| Practice touch drawing with short drills. | 6 | Pass |
| It is for people who draw on phones and tablets. | 10 | Pass |
| It can be installed as a standalone web app. | 9 | Pass — pwa-install |
| It works offline after the first visit. | 7 | Pass — offline-reload |
| What it does | 3 | Pass — heading |
| Gives 20 timed line, curve, and shape drills. | 8 | Pass — twenty-drills |
| Draw with a finger, stylus, or keyboard, then export one drill as PNG. | 13 | Pass — keyboard-drawing, png-export |
| Saves progress only in the browser, shows seven days, and replays saved drills. | 13 | Pass — local-progress, saved-replay |
| Exports and imports checked progress files for backup or a new device. | 12 | Pass — progress-roundtrip |
| Includes an isolated demo at /?demo=1 with two replayable saved drills. | 11 | Pass — demo-isolation |
| The demo keeps its sample work separate from your own practice. | 11 | Pass — demo-isolation |
| Rearranges the phone controls for left-handed practice. | 7 | Pass — handed-layout |
| All 20 drills and both exports are free. | 8 | Pass — free-core |
| A $6 one-time Sociobot license adds private drill notes and a printable seven-day practice sheet. | 15 | Pass — paid-extras |
| The app does not upload artwork or use third-party analytics. | 10 | Pass — privacy-local |
| Run and verify | 3 | Pass — heading |
| The static deploy output is dist/, with index.html at its root. | 12 | Pass — run instruction |
| Use npm run preview to view that build. | 8 | Pass — run instruction |
| Open /?demo=1 to try sample data that never changes your practice. | 11 | Pass — demo-isolation |
| Deployment | 1 | Pass — heading |
| Deploy dist/ as a static app. | 5 | Pass — instruction |
| The build opens each page directly, includes a styled 404 page, and applies browser security settings and safe file caching. | 20 | Pass — deployment-policy |
| Paid checkout is configured outside this repository. | 7 | Pass — paid-checkout-setup |
| The repository contains no credentials. | 5 | Pass — no-repository-credentials |
| Privacy and terms | 3 | Pass — heading |
| Read the in-app privacy page and terms. | 7 | Pass — instruction |
| This project is licensed under MIT; see LICENSE. | 8 | Pass — mit-license |

Terminology is consistent: an exercise is a **drill**, persisted work is a **saved drill**, and a visitor-drawn line is a **mark**.

## Demo, sandbox, privacy, and claims

The landing action opened /?demo=1 in one click. Its first mobile viewport contained the active Rail lines canvas with 9,780 coral sample-mark pixels, two replayable saved drills, and the persistent **“Demo — sample data, nothing is saved”** banner with **Reset demo** and **Start for real**. Reset restored the populated sample.

For isolation, a distinct real record (saved drill, left-handed setting, and note) was seeded in both localStorage and IndexedDB before entry. Entering and resetting demo left that record byte-identical. **Start for real** returned to /practice, kept the real record, and removed the demo key from both stores. The request log for the live practice, landing, demo, reset, and exit flow contained only same-origin GET requests with no body. No artwork or analytics request was observed.

All 23 entries in .factory/claims.json were run individually from a fresh clone after npm ci; each selected one passing tagged test: twenty-drills, png-export, privacy-local, clear-browser-data, offline-reload, pwa-install, demo-isolation, keyboard-drawing, handed-layout, saved-replay, local-progress, progress-roundtrip, free-core, paid-extras, invalid-license-lock, checkout-redirect, license-daily-check, pressure-independent, first-mark-timer, deployment-policy, no-repository-credentials, paid-checkout-setup, and mit-license.

The landing, README, privacy page, and terms page were cross-checked against the registry. Every visitor-reliant claim maps to one of those entries; no unlisted claim was found. This is a browser PWA, so CLI and library sandbox checks do not apply.

## History check

Every earlier review, polish report, and prior handoff was read. Every historical finding was rechecked on the current live site and source and is fixed, not merely marked fixed.

| Earlier findings | Current confirmation |
| --- | --- |
| F-1-1, F-1-2 | The direct 404 has the shared shell and full metadata; all routes have complete route-specific Twitter metadata. |
| F-1-3, F-1-4, F-1-5, F-1-6 | The literal landing headings and plain 404 recovery copy remain live and in source. |
| F-1-7, F-1-8, F-1-9 | README wording remains consistent/plain; the Rail lines action enters the demo. |
| F-2-1, F-2-2, F-2-3, F-2-4 | Registered deployment/credential tests pass; saved drill and LOCAL PRIVACY remain consistent. |
| F-3-1, F-3-2, F-3-3, F-3-4, F-3-5 | Populated demo, factual footer, plain README wording, separated checkout/credential claims, and the MIT claim all remain verified. |
| F-4-1, F-4-2, F-4-3, F-4-4, F-4-5, F-4-6 | Unsupported refunds text is absent; data clearing, wording, price, terminology, and timer-step repairs remain verified. |
| F-5-1, F-5-2, F-5-3, F-5-4, F-5-5, F-5-6, F-5-7 | The strengthened proof tests for paid extras, all drills, PNG content, seven-day progress, free outcomes, network privacy, and seeded-record demo isolation each pass. |

## Structure and access

/, /?demo=1, /demo, /practice, /privacy, and /terms returned 200; an unknown route returned a designed HTTP 404. Each checked route has one h1, one main landmark, an appropriate route title, description, canonical URL, Open Graph/Twitter metadata, favicon/manifest, shared header/footer, and Privacy/Terms links. Browser Back restored the previous route and focus moved to its h1. The internal-link crawl had no dead link; the checkout endpoint returned a 303 to Sociobot-hosted Dodo checkout without following it.

The live root sends CSP, X-Content-Type-Options, HSTS, and strict referrer policy headers. robots.txt, sitemap.xml, manifest, offline fallback, and the original social image returned 200. Axe at 390px found no serious or critical violation on every public route and the 404.

The clean-clone quality suite passed: npm run test:all completed ESLint, TypeScript, Vitest, production build, and 35 Playwright tests. The production bundle is 11.20 kB gzip JavaScript and 2.87 kB gzip CSS.

## Missed leverage

No finding. The brief-implied useful functions are present: guided drills, offline use, an isolated sample path, replay, local progress, PNG and JSON export/import, left-handed controls, and a paid printable sheet. AI critique would not improve this deliberately private, offline-first practice tool and would conflict with the explicit no-automated-critique boundary.

## What would make this perfect

No implementation change is identified in this review. Retain the one-click sample, isolated storage boundary, complete claim tests, and plain factual copy as future changes are made.

