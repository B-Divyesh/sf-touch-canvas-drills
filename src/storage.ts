export type Stroke = { points: {x:number;y:number;t:number}[]; color: string; width: number };
export type Session = { id:string; drillId:string; date:string; strokes:Stroke[]; seconds:number };
export type AppData = { sessions: Session[]; leftHanded: boolean; notes: Record<string,string>; license?: string; licenseChecked?: number; licenseValid?: boolean };
const realKey = 'touch-canvas-drills:data';
const demoKey = 'demo:touch-canvas-drills:data';
const databaseName = 'touch-canvas-drills';
let pendingMirror = Promise.resolve();

function withPracticeStore(mode: IDBTransactionMode, action: (store: IDBObjectStore) => void) {
  return new Promise<void>((resolve, reject) => {
    if (!('indexedDB' in window)) {
      resolve();
      return;
    }
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains('practice')) request.result.createObjectStore('practice');
    };
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const database = request.result;
      const transaction = database.transaction('practice', mode);
      transaction.oncomplete = () => {
        database.close();
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
      action(transaction.objectStore('practice'));
    };
  });
}

function mirrorToIndexedDb(key: string, value: AppData) {
  pendingMirror = pendingMirror.then(() => withPracticeStore('readwrite', store => store.put(value, key)));
}
export const isDemo = () => location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
export function loadData(): AppData { const raw = localStorage.getItem(isDemo() ? demoKey : realKey); const saved = raw ? JSON.parse(raw) : {sessions:[],leftHanded:false,notes:{}}; if (!isDemo() && !saved.license) saved.license = localStorage.getItem('sb_license:touch-canvas-drills') || undefined; return saved; }
export function saveData(data: AppData) { const key = isDemo() ? demoKey : realKey; localStorage.setItem(key, JSON.stringify(data)); mirrorToIndexedDb(key, data); }
export async function clearDemoData() {
  localStorage.removeItem(demoKey);
  await pendingMirror;
  await withPracticeStore('readwrite', store => store.delete(demoKey));
}
export async function resetDemo() { await clearDemoData(); seedDemo(); await pendingMirror; }
function sampleStroke(points: [number, number, number][]): Stroke {
  return {
    color: '#bd3d35',
    width: 8,
    points: points.map(([x, y, t]) => ({ x, y, t })),
  };
}

function demoData(): AppData {
  const now = new Date();
  const d1 = new Date(now);
  d1.setDate(now.getDate() - 2);
  const d2 = new Date(now);
  d2.setDate(now.getDate() - 1);
  return {
    sessions: [
      {
        id: 'sample-1',
        drillId: 'rail-lines',
        date: d1.toISOString(),
        seconds: 14,
        strokes: [
          sampleStroke([[112, 138, 0], [284, 141, 320], [472, 137, 670], [682, 143, 1040], [790, 139, 1280]]),
          sampleStroke([[108, 239, 1560], [285, 244, 1840], [480, 240, 2190], [684, 247, 2540], [793, 242, 2780]]),
        ],
      },
      {
        id: 'sample-2',
        drillId: 's-curves',
        date: d2.toISOString(),
        seconds: 18,
        strokes: [
          sampleStroke([[135, 338, 0], [205, 245, 260], [312, 228, 520], [405, 318, 780], [493, 425, 1040], [605, 438, 1300], [760, 335, 1640]]),
          sampleStroke([[140, 460, 1920], [238, 378, 2180], [345, 389, 2440], [445, 481, 2700], [555, 494, 2960], [670, 408, 3260], [766, 399, 3500]]),
        ],
      },
    ],
    leftHanded: false,
    notes: {},
  };
}

export function seedDemo() {
  const raw = localStorage.getItem(demoKey);
  if (raw) {
    try {
      const saved = JSON.parse(raw) as AppData;
      const samplesAreReplayable = ['sample-1', 'sample-2'].every(id =>
        saved.sessions?.find(session => session.id === id)?.strokes.length,
      );
      if (samplesAreReplayable) return;
    } catch {
      // Replace stale or malformed demo-only data with the bundled sample.
    }
  }
  saveData(demoData());
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function importProgress(text: string, current: AppData, validDrillIds: ReadonlySet<string>): AppData {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('This file is not valid JSON. Choose a progress export from this app.');
  }
  if (!isRecord(parsed) || !Array.isArray(parsed.sessions) || parsed.sessions.length > 500) {
    throw new Error('This file is not a valid Touch Canvas Drills progress export.');
  }

  let pointCount = 0;
  const sessions: Session[] = parsed.sessions.map((value, sessionIndex) => {
    if (!isRecord(value) || typeof value.id !== 'string' || !value.id || value.id.length > 100 ||
        typeof value.drillId !== 'string' || !validDrillIds.has(value.drillId) ||
        typeof value.date !== 'string' || !Number.isFinite(Date.parse(value.date)) ||
        typeof value.seconds !== 'number' || !Number.isFinite(value.seconds) || value.seconds < 0 || value.seconds > 3600 ||
        !Array.isArray(value.strokes) || value.strokes.length > 1000) {
      throw new Error(`Session ${sessionIndex + 1} has invalid progress data.`);
    }
    const strokes: Stroke[] = value.strokes.map((stroke, strokeIndex) => {
      if (!isRecord(stroke) || !Array.isArray(stroke.points) || !stroke.points.length || stroke.points.length > 10_000 ||
          typeof stroke.color !== 'string' || !/^#[0-9a-f]{6}$/i.test(stroke.color) ||
          typeof stroke.width !== 'number' || !Number.isFinite(stroke.width) || stroke.width < 1 || stroke.width > 32) {
        throw new Error(`Session ${sessionIndex + 1}, mark ${strokeIndex + 1} is invalid.`);
      }
      pointCount += stroke.points.length;
      if (pointCount > 100_000) throw new Error('This progress file contains too many drawing points.');
      const points = stroke.points.map((point) => {
        if (!isRecord(point) || typeof point.x !== 'number' || !Number.isFinite(point.x) || point.x < 0 || point.x > 900 ||
            typeof point.y !== 'number' || !Number.isFinite(point.y) || point.y < 0 || point.y > 675 ||
            typeof point.t !== 'number' || !Number.isFinite(point.t) || point.t < 0 || point.t > 3_600_000) {
          throw new Error(`Session ${sessionIndex + 1} contains an invalid drawing point.`);
        }
        return { x: point.x, y: point.y, t: point.t };
      });
      return { points, color: stroke.color, width: stroke.width };
    });
    return { id: value.id, drillId: value.drillId, date: value.date, strokes, seconds: value.seconds };
  });

  const importedNotes: Record<string, string> = {};
  if (parsed.notes !== undefined) {
    if (!isRecord(parsed.notes)) throw new Error('This progress file has invalid notes.');
    for (const [drillId, note] of Object.entries(parsed.notes)) {
      if (!validDrillIds.has(drillId) || typeof note !== 'string' || note.length > 2000) {
        throw new Error('This progress file has invalid notes.');
      }
      importedNotes[drillId] = note;
    }
  }
  if (parsed.leftHanded !== undefined && typeof parsed.leftHanded !== 'boolean') {
    throw new Error('This progress file has an invalid layout setting.');
  }

  const merged = new Map(current.sessions.map(session => [session.id, session]));
  sessions.forEach(session => merged.set(session.id, session));
  return {
    ...current,
    sessions: [...merged.values()],
    notes: { ...current.notes, ...importedNotes },
    leftHanded: parsed.leftHanded ?? current.leftHanded,
  };
}
