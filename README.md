# Touch Canvas Drills

Practice touch drawing with short drills. It is for Android phones and tablets.
It can be installed as a standalone web app. It works offline after the first
visit.

## What it does

- Gives 20 timed line, curve, and shape drills.
- Draw with a finger, stylus, or keyboard, then export one drill as PNG.
- Saves progress only in the browser, shows seven days, and replays saved marks.
- Exports and imports checked progress files for backup or a new device.
- Includes an isolated demo at `/?demo=1` with two replayable sample sessions.
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

Deploy `dist/` as a static app. The emitted `staticwebapp.config.json` adds
explicit app routes, a styled 404 response, security headers, and immutable
caching for hashed assets. The factory registers
the paid product; no credentials are stored in this repository.

## Privacy and terms

Read the in-app [privacy page](/privacy) and [terms](/terms). This project is
licensed under MIT; see [LICENSE](LICENSE).
