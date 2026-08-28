export type Stroke = { points: {x:number;y:number;t:number}[]; color: string; width: number };
export type Session = { id:string; drillId:string; date:string; strokes:Stroke[]; seconds:number };
export type AppData = { sessions: Session[]; leftHanded: boolean; notes: Record<string,string>; license?: string; licenseChecked?: number; licenseValid?: boolean };
const realKey = 'touch-canvas-drills:data';
const demoKey = 'demo:touch-canvas-drills:data';
const databaseName = 'touch-canvas-drills';
function mirrorToIndexedDb(key: string, value: AppData) {
  if (!('indexedDB' in window)) return;
  const request = indexedDB.open(databaseName, 1);
  request.onupgradeneeded = () => request.result.createObjectStore('practice');
  request.onsuccess = () => {
    const transaction = request.result.transaction('practice', 'readwrite');
    transaction.objectStore('practice').put(value, key);
  };
}
export const isDemo = () => location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
export function loadData(): AppData { const raw = localStorage.getItem(isDemo() ? demoKey : realKey); const saved = raw ? JSON.parse(raw) : {sessions:[],leftHanded:false,notes:{}}; if (!isDemo() && !saved.license) saved.license = localStorage.getItem('sb_license:touch-canvas-drills') || undefined; return saved; }
export function saveData(data: AppData) { const key = isDemo() ? demoKey : realKey; localStorage.setItem(key, JSON.stringify(data)); mirrorToIndexedDb(key, data); }
export function resetDemo() { localStorage.removeItem(demoKey); seedDemo(); }
export function seedDemo() { if (!localStorage.getItem(demoKey)) { const now = new Date(); const d1 = new Date(now); d1.setDate(now.getDate()-2); const d2 = new Date(now); d2.setDate(now.getDate()-1); saveData({sessions:[{id:'sample-1',drillId:'rail-lines',date:d1.toISOString(),strokes:[],seconds:20},{id:'sample-2',drillId:'s-curves',date:d2.toISOString(),strokes:[],seconds:25}],leftHanded:false,notes:{}}); } }
