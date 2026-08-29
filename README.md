# Touch Canvas Drills

Practice touch drawing with short drills. It is for Android phones and tablets.
It can be installed as a standalone web app. It works offline after the first
visit.

## What it does

- Gives 20 timed line, curve, and shape drills.
- Draw with a finger, stylus, or keyboard, then export one drill as PNG.
- Saves progress only in the browser, shows seven days, and replays saved drills.
- Exports and imports checked progress files for backup or a new device.
- Includes an isolated demo at `/?demo=1` with two replayable saved drills.
- The demo keeps its sample work separate from your own practice.
- Rearranges the phone controls for left-handed practice.

All 20 drills and both exports are free. A $6 one-time Sociobot license adds
private drill notes and a printable seven-day practice sheet. The app does not
upload artwork or use third-party analytics.

## Run and verify

```sh
npm ci
npm run dev
npm run test:all
npm run build
```

The static deploy output is `dist/`, with `index.html` at its root. Use
`npm run preview` to view that build. Open `/?demo=1` to try sample data that
never changes your practice.

## Deployment

Deploy `dist/` as a static app. The build opens each page directly, includes a
styled 404 page, and applies browser security settings and safe file caching.
Paid checkout is configured outside this repository. The repository contains
no credentials.

## Privacy and terms

Read the in-app [privacy page](/privacy) and [terms](/terms). This project is
licensed under MIT; see [LICENSE](LICENSE).
