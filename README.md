# Touch Canvas Drills

Practice touch drawing with short drills. It is for Android phones and tablets,
and works as an installable offline-first web app after the first visit.

## What it does

- Gives 20 timed line, curve, and shape drills.
- Draw with a finger or stylus, replay the marks, and export one drill as PNG.
- Saves progress only in the browser and shows a seven-day calendar.
- Includes an isolated demo at `/demo` with sample sessions. Demo data uses a
  separate `demo:touch-canvas-drills:` browser-storage key.

The free core practice is complete. A $6 one-time Sociobot license enables
private drill notes and the printable week sheet. The app does not upload
artwork or use third-party analytics.

## Run and verify

```sh
npm install
npm run dev
npm run test:unit
npm test
npm run build
```

The static deploy output is `dist/`, with `index.html` at its root. Use
`npm run preview` to view that build. Open `/demo` to test the no-save sandbox.

## Deployment

Deploy `dist/` as a static app. The included `staticwebapp.config.json` adds
SPA routing, a styled 404 response, and security headers. The factory registers
the paid product; no credentials are stored in this repository.

## Privacy and terms

Read the in-app [privacy page](/privacy) and [terms](/terms). This project is
licensed under MIT; see [LICENSE](LICENSE).
