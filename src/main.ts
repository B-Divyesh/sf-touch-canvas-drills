import "./style.css";
import heroUrl from "../assets/src/cassette-drill.webp?url";
import { drills, type Drill } from "./drills";
import {
  clearDemoData,
  isDemo,
  loadData,
  resetDemo,
  saveData,
  seedDemo,
  type AppData,
  type Stroke,
} from "./storage";

const app = document.querySelector<HTMLDivElement>("#app")!;
let data: AppData;
let chosen = 0;
let current: Stroke[] = [];
let seconds = drills[0].seconds;
let timer: number | undefined;
let activePointer: number | undefined;
let recordingStart = 0;
let statusText = "";
let keyboardCursor = { x: 450, y: 338 };
let keyboardDrawing = false;

function esc(value: string) {
  return value.replace(
    /[&<>"]/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]!,
  );
}
function route() {
  return location.pathname === "/demo" ? "/demo" : location.pathname;
}
function isAppRoute() {
  return route() === "/practice" || route() === "/demo";
}
function nav(path: string) {
  history.pushState({}, "", path);
  render();
  window.scrollTo(0, 0);
  requestAnimationFrame(() =>
    document.querySelector<HTMLElement>("h1")?.focus(),
  );
}
function footer() {
  return `<footer class="footer shell"><p>Small touch drills for steadier drawing.</p><nav aria-label="Footer navigation"><a href="/privacy" data-link>Privacy</a><a href="/terms" data-link>Terms</a></nav><p>Built by Param Factory · v1.0.1</p></footer>`;
}
function header() {
  return `<header class="shell topbar"><a class="wordmark" href="/" data-link><span>TC</span>DRILLS</a><nav class="nav" aria-label="Main navigation"><a href="/demo" data-link>Demo</a><a href="/practice" data-link>Practice</a><a href="/privacy" data-link>Privacy</a></nav></header>`;
}
function demoBar() {
  return isDemo()
    ? `<div class="demo-bar" role="status"><strong>Demo — sample data, nothing is saved</strong><button class="reset-demo">Reset demo</button><button class="start-real">Start for real</button></div>`
    : "";
}
function landing() {
  document.title = "Touch Canvas Drills — Practice touch drawing";
  return `${header()}<main id="main" tabindex="-1"><section class="shell hero"><div><p class="eyebrow">OFFLINE PRACTICE PAD / 20 DRILLS</p><h1>Practice touch drawing with short drills</h1><p class="lede">For people learning to draw on a phone or tablet who want steadier marks without a desktop editor.</p><div class="hero-actions"><a class="button coral" href="/demo" data-link>Try it with sample data</a><span class="after">Starts a ready-to-draw sample drill.</span><a class="button secondary" href="/practice" data-link>Start a blank practice</a></div><ul class="facts"><li>Works offline after the first visit</li><li>Your strokes stay on this device</li><li>Free core drills; $6 one-time extras</li></ul></div><img class="hero-art" src="${heroUrl}" width="1024" height="1024" fetchpriority="high" decoding="async" alt="A cassette case used as a drawing practice board with ink marks and pens." /></section><section class="section"><div class="shell preview"><div class="preview-tape" aria-hidden="true"></div><div><p class="tape-label">NEXT UP / 00:20</p><h2>Rail lines</h2><p>Follow a faint guide. Draw your own marks. Keep the replay if you want to study it.</p><a class="button coral" href="/demo" data-link>Open the practice pad</a></div></div></section><section class="section"><div class="shell"><p class="eyebrow">HOW IT WORKS</p><h2>One small mark at a time</h2><div class="steps"><article class="step"><p class="number">01</p><h3>Pick a drill</h3><p>Choose lines, curves, or simple shapes.</p></article><article class="step"><p class="number">02</p><h3>Draw for one timer</h3><p>Use a finger or a stylus. Pressure does not matter.</p></article><article class="step"><p class="number">03</p><h3>Review your mark</h3><p>Replay it, save the session, and return tomorrow.</p></article></div></div></section><section class="section"><div class="shell plain-grid"><div><p class="eyebrow">PRIVATE BY DESIGN</p><h2>Practice stays close to your hand</h2><p>Your sessions live in this browser. There is no account, upload, social feed, or automated critique.</p><p>Export a single drill image when you want a copy.</p></div><div class="pricing"><p class="tape-label">ONE-TIME / OPTIONAL</p><h2>Keep the tape rolling</h2><p class="price">$6</p><p>Paid extras add private drill notes and a printable seven-day practice sheet. The 20 drills, progress, and image export stay free.</p><a class="button" href="https://api.sociobot.in/api/v1/products/touch-canvas-drills/checkout">Buy the extras</a><p><a href="/terms" data-link>Read purchase terms</a></p></div></div></section></main>${footer()}`;
}

function days() {
  const out: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const count = data.sessions.filter(
      (s) => new Date(s.date).toDateString() === d.toDateString(),
    ).length;
    out.push(
      `<div class="day ${count ? "done" : ""}"><span>${d.toLocaleDateString(undefined, { weekday: "narrow" })}</span><br>${d.getDate()}${count ? `<br>● ${count}` : ""}</div>`,
    );
  }
  return out.join("");
}

function savedTakes() {
  const saved = [...data.sessions]
    .filter((session) => session.strokes.length)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);
  if (!saved.length) return '<p>No saved marks yet. Save a drill to replay it here.</p>';
  return `<ul class="saved-list">${saved.map((session) => {
    const drill = drills.find((item) => item.id === session.drillId);
    const date = new Date(session.date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    return `<li><span><strong>${esc(drill?.title || "Saved drill")}</strong><small>${date}</small></span><button class="load-session secondary" data-session="${esc(session.id)}">Replay saved marks</button></li>`;
  }).join("")}</ul>`;
}

function appView() {
  const drill = drills[chosen];
  const left = data.leftHanded ? "left" : "";
  document.title = `${isDemo() ? "Demo" : "Practice"} — Touch Canvas Drills`;
  return `${header()}${demoBar()}<main id="main" tabindex="-1" class="shell"><section class="app-head"><div><p class="eyebrow">${isDemo() ? "SAMPLE TAPE" : "PRACTICE TAPE"} / ${String(chosen + 1).padStart(2, "0")} OF 20</p><h1>Make one steadier mark</h1></div><button class="hand-toggle" aria-pressed="${data.leftHanded}">${data.leftHanded ? "Left-handed layout" : "Right-handed layout"}</button></section><div class="app-layout ${left}"><aside class="drill-list" aria-label="Drill list"><header><strong>20 short drills</strong><br><small>Lines · curves · shapes</small></header><ol>${drills.map((d, i) => `<li><button class="drill-item ${i === chosen ? "active" : ""}" data-drill="${i}" aria-current="${i === chosen ? "true" : "false"}"><span>${String(i + 1).padStart(2, "0")} ${d.title}</span><span>${d.seconds}s</span></button></li>`).join("")}</ol></aside><section class="deck" aria-labelledby="drill-title"><div class="deck-top"><div><p class="tape-label">${drill.kind} / TIMER RUNS ON FIRST MARK</p><h2 id="drill-title">${drill.title}</h2><p class="cue">${drill.cue}</p></div><output class="clock" aria-label="Seconds remaining">00:${String(seconds).padStart(2, "0")}</output></div><div class="canvas-wrap"><canvas class="drill-canvas" width="900" height="675" tabindex="0" role="application" aria-roledescription="keyboard drawing pad" aria-label="Drawing area for ${drill.title}" aria-describedby="canvas-help"></canvas></div><p class="canvas-help" id="canvas-help">Draw with a finger or stylus. For a keyboard, focus the drawing pad, press Space to lower or lift the pen, and use Arrow keys to draw. Hold Shift for longer steps. Press Escape to clear.</p><div class="deck-controls"><button class="clear">Clear marks</button><button class="replay" ${current.length ? "" : "disabled"}>Replay marks</button><button class="save-session" ${current.length ? "" : "disabled"}>Save this drill</button><button class="export">Export PNG</button></div><div class="status" aria-live="polite">${statusText || "Your timer starts when you draw."}</div></section></div><section class="progress-panel"><article class="calendar"><p class="eyebrow">LOCAL PROGRESS</p><h2>Last seven days</h2><div class="days" aria-label="Practice activity for the last seven days">${days()}</div><p>${data.sessions.length ? `${data.sessions.length} saved drill${data.sessions.length === 1 ? "" : "s"} on this device.` : "No saved drills yet. Save one after you draw."}</p><h3>Saved takes</h3>${savedTakes()}</article><article class="settings"><p class="eyebrow">YOUR SETUP</p><h2>Review and restore</h2><label for="note">Private note for this drill ${data.licenseValid ? "" : "(paid extra)"}</label><textarea id="note" rows="3" ${data.licenseValid ? "" : "disabled"} placeholder="What changed in this take?">${esc(data.notes[drill.id] || "")}</textarea>${data.licenseValid ? '<button class="save-note">Save note</button>' : '<p class="notice">Notes are included in the $6 one-time extras. Core practice remains free.</p>'}<label for="license">Have a license? Paste it</label><div class="row"><input id="license" autocomplete="off" placeholder="License token" value="${esc(data.license || "")}" /><button class="verify-license">Verify license</button></div><p id="license-result" aria-live="polite">${data.licenseValid ? "Extras are active." : "No active extras license."}</p><button class="export-data secondary">Export progress JSON</button></article></section></main>${footer()}`;
}
function legal(kind: "privacy" | "terms") {
  const privacy = kind === "privacy";
  document.title = `${privacy ? "Privacy" : "Terms"} — Touch Canvas Drills`;
  return `${header()}<main id="main" tabindex="-1" class="shell legal"><p class="eyebrow">${privacy ? "PRIVACY" : "TERMS"}</p><h1>${privacy ? "Your practice stays on your device" : "Simple terms for a small practice tool"}</h1>${privacy ? "<p>Touch Canvas Drills stores drills, marks, layout choice, and optional license details in your browser. It does not send artwork to us.</p><p>License verification contacts Sociobot only when you add a license and when a cached verification is older than one day. Their checkout handles payment. Clearing browser data removes local practice data.</p><p>Demo data uses a separate browser key and is discarded when you leave demo mode.</p>" : "<p>Touch Canvas Drills is a local practice utility. Use it at your own pace. A $6 one-time purchase adds notes and a printable week sheet. Checkout, refunds, and license revocation are handled by Sociobot, the merchant of record.</p><p>The free drills, progress export, and image export remain available without a purchase. The product is provided as-is.</p>"}</main>${footer()}`;
}
function notFound() {
  document.title = "Page not found — Touch Canvas Drills";
  return `${header()}<main id="main" tabindex="-1" class="shell not-found"><p class="eyebrow">TAPE ENDED</p><h1>That page is not on this tape.</h1><p>Pick a drill and make a new mark.</p><a class="button coral" href="/" data-link>Back to the drills</a></main>${footer()}`;
}

function render() {
  if (isDemo()) seedDemo();
  data = loadData();
  if (route() === "/") app.innerHTML = landing();
  else if (isAppRoute()) app.innerHTML = appView();
  else if (route() === "/privacy" || route() === "/terms")
    app.innerHTML = legal(route().slice(1) as "privacy" | "terms");
  else app.innerHTML = notFound();
  const canonicalPath = ["/", "/demo", "/practice", "/privacy", "/terms"].includes(route()) ? route() : "/";
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute("href", `https://touch-canvas-drills.sociobot.in${canonicalPath}`);
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute("content", document.title);
  document.querySelector("h1")?.setAttribute("tabindex", "-1");
  if (isAppRoute() && data.licenseValid) {
    document
      .querySelector(".save-note")
      ?.insertAdjacentHTML(
        "afterend",
        '<button class="print-week secondary">Print practice week</button>',
      );
  }
  bind();
  if (isAppRoute()) {
    setupCanvas();
    verifyStoredLicense();
  }
}
function bind() {
  document.querySelectorAll<HTMLAnchorElement>("[data-link]").forEach((a) =>
    a.addEventListener("click", (event) => {
      event.preventDefault();
      nav(a.getAttribute("href")!);
    }),
  );
  document.querySelector(".reset-demo")?.addEventListener("click", async () => {
    await resetDemo();
    statusText = "Demo reset to its sample sessions.";
    render();
  });
  document.querySelector(".start-real")?.addEventListener("click", async () => {
    await clearDemoData();
    statusText = "Demo data discarded. This is your practice space.";
    nav("/practice");
  });
  document.querySelector(".hand-toggle")?.addEventListener("click", () => {
    data.leftHanded = !data.leftHanded;
    saveData(data);
    render();
  });
  document.querySelectorAll<HTMLButtonElement>("[data-drill]").forEach((b) =>
    b.addEventListener("click", () => {
      chosen = Number(b.dataset.drill);
      current = [];
      keyboardDrawing = false;
      keyboardCursor = { x: 450, y: 338 };
      recordingStart = 0;
      seconds = drills[chosen].seconds;
      stopTimer();
      statusText = "New guide ready. Your timer starts when you draw.";
      render();
    }),
  );
  document.querySelector(".clear")?.addEventListener("click", () => {
    current = [];
    keyboardDrawing = false;
    keyboardCursor = { x: 450, y: 338 };
    recordingStart = 0;
    seconds = drills[chosen].seconds;
    stopTimer();
    statusText = "Marks cleared. Try the guide again.";
    setupCanvas();
  });
  document.querySelector(".replay")?.addEventListener("click", replay);
  document.querySelectorAll<HTMLButtonElement>(".load-session").forEach((button) =>
    button.addEventListener("click", () => {
      const session = data.sessions.find((item) => item.id === button.dataset.session);
      if (!session) return;
      const index = drills.findIndex((item) => item.id === session.drillId);
      if (index >= 0) chosen = index;
      current = structuredClone(session.strokes);
      seconds = Math.max(0, drills[chosen].seconds - session.seconds);
      recordingStart = 0;
      keyboardDrawing = false;
      statusText = `Loaded saved ${drills[chosen].title} marks.`;
      render();
      requestAnimationFrame(() => {
        replay();
        canvas().focus();
      });
    }),
  );
  document
    .querySelector(".save-session")
    ?.addEventListener("click", saveSession);
  document.querySelector(".export")?.addEventListener("click", exportPng);
  document.querySelector(".export-data")?.addEventListener("click", exportData);
  document
    .querySelector(".print-week")
    ?.addEventListener("click", () => window.print());
  document.querySelector(".save-note")?.addEventListener("click", () => {
    const note = document.querySelector<HTMLTextAreaElement>("#note")!;
    data.notes[drills[chosen].id] = note.value;
    saveData(data);
    statusText = "Note saved on this device.";
    render();
  });
  document
    .querySelector(".verify-license")
    ?.addEventListener("click", verifyLicense);
  window.onkeydown = (e) => {
    if (isAppRoute() && e.key === "Escape" && !document.querySelector(".drill-canvas:focus")) {
      current = [];
      keyboardDrawing = false;
      recordingStart = 0;
      seconds = drills[chosen].seconds;
      stopTimer();
      statusText = "Marks cleared.";
      setupCanvas();
    }
  };
}
function canvas() {
  return document.querySelector<HTMLCanvasElement>(".drill-canvas")!;
}
function setupCanvas() {
  const c = canvas();
  const ctx = c.getContext("2d")!;
  drawGuide(ctx, drills[chosen]);
  drawAll(ctx, current);
  c.onpointerdown = begin;
  c.onpointermove = move;
  c.onpointerup = end;
  c.onpointercancel = end;
  c.onkeydown = keyboardDraw;
  c.onfocus = drawNow;
  c.onblur = () => {
    keyboardDrawing = false;
    drawNow();
  };
}
function drawGuide(ctx: CanvasRenderingContext2D, d: Drill) {
  ctx.clearRect(0, 0, 900, 675);
  ctx.save();
  ctx.strokeStyle = "#8bb5c9";
  ctx.lineWidth = 5;
  ctx.setLineDash([12, 13]);
  ctx.lineCap = "round";
  const p = (x: number, y: number) => [x * 900, y * 675] as const;
  const line = (a: number, b: number, c: number, e: number) => {
    ctx.beginPath();
    ctx.moveTo(...p(a, b));
    ctx.lineTo(...p(c, e));
    ctx.stroke();
  };
  if (d.guide === "h")
    for (let y = 0.2; y < 0.9; y += 0.15) line(0.12, y, 0.88, y);
  else if (d.guide === "v")
    for (let x = 0.2; x < 0.9; x += 0.14) line(x, 0.14, x, 0.86);
  else if (d.guide === "diag")
    for (let x = 0.1; x < 0.6; x += 0.12) line(x, 0.18, x + 0.32, 0.82);
  else if (d.guide === "dash")
    for (let y = 0.2; y < 0.9; y += 0.14)
      for (let x = 0.15; x < 0.85; x += 0.15) line(x, y, x + 0.07, y);
  else if (d.guide === "corner")
    for (let y = 0.2; y < 0.8; y += 0.2) {
      ctx.beginPath();
      ctx.moveTo(...p(0.2, y));
      ctx.lineTo(...p(0.65, y));
      ctx.lineTo(...p(0.65, y + 0.11));
      ctx.stroke();
    }
  else if (d.guide === "fan")
    for (let a = -1.1; a <= 1.1; a += 0.3) {
      ctx.beginPath();
      ctx.moveTo(...p(0.5, 0.78));
      ctx.lineTo(...p(0.5 + Math.sin(a) * 0.36, 0.25 + Math.cos(a) * 0.25));
      ctx.stroke();
    }
  else if (d.guide === "triangles")
    for (const center of [0.22, 0.5, 0.78]) {
      ctx.beginPath();
      ctx.moveTo(...p(center, 0.2));
      ctx.lineTo(...p(center - 0.13, 0.7));
      ctx.lineTo(...p(center + 0.13, 0.7));
      ctx.closePath();
      ctx.stroke();
    }
  else if (d.guide === "diamonds")
    for (const centerX of [0.25, 0.5, 0.75])
      for (const centerY of [0.32, 0.68]) {
        ctx.beginPath();
        ctx.moveTo(...p(centerX, centerY - 0.14));
        ctx.lineTo(...p(centerX + 0.1, centerY));
        ctx.lineTo(...p(centerX, centerY + 0.14));
        ctx.lineTo(...p(centerX - 0.1, centerY));
        ctx.closePath();
        ctx.stroke();
      }
  else if (d.guide === "leaves") {
    for (const [start, end, bend] of [[0.12, 0.48, -0.18], [0.5, 0.88, 0.18]] as const) {
      ctx.beginPath();
      ctx.moveTo(...p(start, 0.5));
      ctx.bezierCurveTo(...p(start + 0.1, 0.5 + bend), ...p(end - 0.1, 0.5 + bend), ...p(end, 0.5));
      ctx.bezierCurveTo(...p(end - 0.1, 0.5 - bend), ...p(start + 0.1, 0.5 - bend), ...p(start, 0.5));
      ctx.stroke();
    }
  }
  else {
    ctx.setLineDash([10, 10]);
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      if (d.guide === "spiral") {
        for (let t = 0; t < Math.PI * 4; t += 0.1) {
          const r = 0.04 + t * 0.018;
          const x = 0.5 + Math.cos(t) * r,
            y = 0.5 + Math.sin(t) * r;
          if (t) ctx.lineTo(...p(x, y));
          else ctx.moveTo(...p(x, y));
        }
      } else if (d.guide === "wave" || d.guide === "s") {
        for (let x = 0.12; x <= 0.88; x += 0.02) {
          const y =
            0.5 +
            Math.sin((x - 0.12) * Math.PI * (d.guide === "s" ? 2 : 6)) * 0.17;
          if (x === 0.12) ctx.moveTo(...p(x, y));
          else ctx.lineTo(...p(x, y));
        }
      } else if (d.guide === "c" || d.guide === "arc") {
        ctx.arc(450, 338, (i + 1) * 46, Math.PI * 0.18, Math.PI * 1.82);
      } else {
        const r = 45 + i * 43;
        const oval = d.guide === "ovals" ? 1.35 : 1;
        for (let t = 0; t <= Math.PI * 2; t += 0.1) {
          let x = 0.5 + (Math.cos(t) * r * oval) / 900,
            y = 0.5 + (Math.sin(t) * r) / 675;
          if (d.guide === "square" || d.guide === "boxes") {
            x =
              0.5 +
              ((Math.cos(t) >= 0 ? 1 : -1) *
                Math.min(Math.abs(Math.cos(t)), Math.abs(Math.sin(t))) *
                r) /
                900;
            y =
              0.5 +
              ((Math.sin(t) >= 0 ? 1 : -1) *
                Math.min(Math.abs(Math.cos(t)), Math.abs(Math.sin(t))) *
                r) /
                675;
          }
          if (t) ctx.lineTo(...p(x, y));
          else ctx.moveTo(...p(x, y));
        }
      }
      ctx.stroke();
    }
  }
  ctx.restore();
}
function drawAll(ctx: CanvasRenderingContext2D, strokes: Stroke[]) {
  for (const s of strokes) {
    if (!s.points.length) continue;
    ctx.save();
    ctx.strokeStyle = s.color;
    ctx.lineWidth = s.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    s.points.forEach((point, i) =>
      i ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y),
    );
    ctx.stroke();
    ctx.restore();
  }
}
function position(e: PointerEvent, c: HTMLCanvasElement) {
  const r = c.getBoundingClientRect();
  return {
    x: ((e.clientX - r.left) * c.width) / r.width,
    y: ((e.clientY - r.top) * c.height) / r.height,
    t: performance.now() - recordingStart,
  };
}
function begin(e: PointerEvent) {
  const c = canvas();
  activePointer = e.pointerId;
  c.setPointerCapture(e.pointerId);
  if (!recordingStart) {
    recordingStart = performance.now();
    startTimer();
  }
  current.push({ points: [position(e, c)], color: "#bd3d35", width: 8 });
  drawNow();
}
function move(e: PointerEvent) {
  if (e.pointerId !== activePointer || !current.length) return;
  current[current.length - 1].points.push(position(e, canvas()));
  drawNow();
}
function end(e: PointerEvent) {
  if (e.pointerId === activePointer) activePointer = undefined;
  enableMarkControls();
}
function enableMarkControls() {
  const save = document.querySelector<HTMLButtonElement>(".save-session");
  const replayBtn = document.querySelector<HTMLButtonElement>(".replay");
  if (save) save.disabled = false;
  if (replayBtn) replayBtn.disabled = false;
}
function keyboardDraw(e: KeyboardEvent) {
  if (e.key === "Escape") {
    e.preventDefault();
    current = [];
    keyboardDrawing = false;
    keyboardCursor = { x: 450, y: 338 };
    recordingStart = 0;
    seconds = drills[chosen].seconds;
    stopTimer();
    statusText = "Marks cleared. Keyboard pen is at the center.";
    drawNow();
    announceStatus();
    return;
  }
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    keyboardDrawing = !keyboardDrawing;
    if (keyboardDrawing) {
      if (!recordingStart) {
        recordingStart = performance.now();
        startTimer();
      }
      current.push({ points: [{ ...keyboardCursor, t: performance.now() - recordingStart }], color: "#bd3d35", width: 8 });
      statusText = "Keyboard pen down. Use the Arrow keys to draw.";
    } else {
      enableMarkControls();
      statusText = "Keyboard pen lifted. Replay or save your marks.";
    }
    drawNow();
    announceStatus();
    return;
  }
  const direction: Record<string, [number, number]> = {
    ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1],
  };
  const delta = direction[e.key];
  if (!delta) return;
  e.preventDefault();
  const step = e.shiftKey ? 32 : 12;
  keyboardCursor.x = Math.max(8, Math.min(892, keyboardCursor.x + delta[0] * step));
  keyboardCursor.y = Math.max(8, Math.min(667, keyboardCursor.y + delta[1] * step));
  if (keyboardDrawing) {
    current.at(-1)?.points.push({ ...keyboardCursor, t: performance.now() - recordingStart });
    enableMarkControls();
  }
  drawNow();
}
function announceStatus() {
  const status = document.querySelector(".status");
  if (status) status.textContent = statusText;
}
function drawNow() {
  const ctx = canvas().getContext("2d")!;
  drawGuide(ctx, drills[chosen]);
  drawAll(ctx, current);
  if (document.activeElement === canvas()) {
    ctx.save();
    ctx.strokeStyle = "#075d8c";
    ctx.lineWidth = 4;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(keyboardCursor.x, keyboardCursor.y, 13, 0, Math.PI * 2);
    ctx.moveTo(keyboardCursor.x - 19, keyboardCursor.y);
    ctx.lineTo(keyboardCursor.x + 19, keyboardCursor.y);
    ctx.moveTo(keyboardCursor.x, keyboardCursor.y - 19);
    ctx.lineTo(keyboardCursor.x, keyboardCursor.y + 19);
    ctx.stroke();
    ctx.restore();
  }
}
function startTimer() {
  stopTimer();
  timer = window.setInterval(() => {
    seconds = Math.max(0, seconds - 1);
    const output = document.querySelector(".clock");
    if (output) output.textContent = `00:${String(seconds).padStart(2, "0")}`;
    if (seconds === 0) {
      stopTimer();
      statusText = "Timer ended. Replay your marks or save this drill.";
      const s = document.querySelector(".status");
      if (s) s.textContent = statusText;
    }
  }, 1000);
}
function stopTimer() {
  if (timer) window.clearInterval(timer);
  timer = undefined;
}
function saveSession() {
  if (!current.length) return;
  data.sessions.push({
    id: crypto.randomUUID(),
    drillId: drills[chosen].id,
    date: new Date().toISOString(),
    strokes: structuredClone(current),
    seconds: drills[chosen].seconds - seconds,
  });
  saveData(data);
  statusText = "Saved to your local progress calendar.";
  render();
}
function replay() {
  if (!current.length) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    drawNow();
    statusText = "Replay shown without motion.";
    return;
  }
  const flattened = current.flatMap((s, i) => s.points.map((p) => ({ i, p })));
  let n = 0;
  const ctx = canvas().getContext("2d")!;
  drawGuide(ctx, drills[chosen]);
  const tick = () => {
    for (let j = 0; j < 5 && n < flattened.length; j++, n++) {
      const { i, p } = flattened[n];
      const partial = {
        ...current[i],
        points: current[i].points.slice(0, current[i].points.indexOf(p) + 1),
      };
      drawGuide(ctx, drills[chosen]);
      drawAll(ctx, [...current.slice(0, i), partial]);
    }
    if (n < flattened.length) requestAnimationFrame(tick);
    else {
      drawNow();
      statusText = "Replay finished.";
      document.querySelector(".status")!.textContent = statusText;
    }
  };
  tick();
}
function download(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 500);
}
function exportPng() {
  canvas().toBlob((blob) => {
    if (blob) download(blob, `${drills[chosen].id}.png`);
  }, "image/png");
  statusText = "PNG export started.";
  document.querySelector(".status")!.textContent = statusText;
}
function exportData() {
  download(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    "touch-canvas-drills-progress.json",
  );
}
async function verifyLicense() {
  const token = document
    .querySelector<HTMLInputElement>("#license")!
    .value.trim();
  const result = document.querySelector("#license-result")!;
  if (!token) {
    result.textContent = "Paste a license token first.";
    return;
  }
  data.license = token;
  if (!isDemo()) localStorage.setItem("sb_license:touch-canvas-drills", token);
  saveData(data);
  result.textContent = "Checking your license…";
  try {
    const r = await fetch(
      `https://api.sociobot.in/api/v1/products/touch-canvas-drills/verify?license=${encodeURIComponent(token)}`,
    );
    const body = (await r.json()) as { valid: boolean; reason: string };
    data.licenseValid = body.valid;
    data.licenseChecked = Date.now();
    saveData(data);
    result.textContent = body.valid
      ? "Extras are active."
      : "License is not active. You can buy the extras from the home page.";
    if (body.valid) render();
  } catch {
    result.textContent =
      "Could not check the license. Your free drills still work offline.";
  }
}
async function verifyStoredLicense() {
  if (
    isDemo() ||
    !data.license ||
    Date.now() - (data.licenseChecked || 0) < 86_400_000
  )
    return;
  try {
    const response = await fetch(
      `https://api.sociobot.in/api/v1/products/touch-canvas-drills/verify?license=${encodeURIComponent(data.license)}`,
    );
    const body = (await response.json()) as { valid: boolean };
    data.licenseValid = body.valid;
    data.licenseChecked = Date.now();
    saveData(data);
    if (!body.valid) {
      const result = document.querySelector("#license-result");
      if (result)
        result.textContent =
          "License no longer active. Free drills still work.";
    }
  } catch {
    // Keep the cached verdict when offline.
  }
}
function captureReturnedLicense() {
  const url = new URL(location.href);
  const token = url.searchParams.get("license");
  if (token) {
    const stored = loadData();
    stored.license = token;
    if (!isDemo()) localStorage.setItem("sb_license:touch-canvas-drills", token);
    stored.licenseValid = true;
    saveData(stored);
    url.searchParams.delete("license");
    history.replaceState(
      {},
      "",
      url.pathname + (url.search ? url.search : "") + url.hash,
    );
  }
}
window.addEventListener("popstate", () => {
  render();
  requestAnimationFrame(() => document.querySelector<HTMLElement>("h1")?.focus());
});
captureReturnedLicense();
render();
if ("serviceWorker" in navigator)
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        let applyingUpdate = false;
        const offerUpdate = () => {
          if (!registration.waiting || document.querySelector(".update-toast"))
            return;
          const toast = document.createElement("div");
          toast.className = "update-toast";
          toast.innerHTML =
            "<span>A newer drill tape is ready.</span><button>Update app</button>";
          toast.querySelector("button")?.addEventListener("click", () => {
            applyingUpdate = true;
            registration.waiting?.postMessage("SKIP_WAITING");
          });
          document.body.append(toast);
        };
        offerUpdate();
        registration.addEventListener("updatefound", () =>
          registration.installing?.addEventListener("statechange", offerUpdate),
        );
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (applyingUpdate) location.reload();
        });
      })
      .catch(() => undefined);
  });
