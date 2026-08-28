export type DrillKind = 'line' | 'curve' | 'shape';
export type Drill = { id: string; title: string; kind: DrillKind; cue: string; seconds: number; guide: string };
const drillRows: [string, string, DrillKind, string, number, string][] = [
  ['rail-lines','Rail lines','line','Keep one steady lane.',20,'h'], ['ladder-rungs','Ladder rungs','line','Cross each rail without rushing.',20,'v'],
  ['corner-turns','Corner turns','line','Stop at each corner, then turn.',25,'corner'], ['long-pulls','Long pulls','line','Pull from shoulder to fingertip.',20,'diag'],
  ['short-dashes','Short dashes','line','Lift cleanly between marks.',20,'dash'], ['fan-out','Fan out','line','Start every line from the same point.',25,'fan'],
  ['s-curves','S curves','curve','Let the curve change direction once.',25,'s'], ['c-curves','C curves','curve','Match the open side.',20,'c'],
  ['wave-train','Wave train','curve','Keep the crests even.',25,'wave'], ['spiral-in','Spiral in','curve','Tighten slowly toward the center.',30,'spiral'],
  ['arc-stack','Arc stack','curve','Nest each arc inside the last.',25,'arc'], ['loop-chain','Loop chain','curve','Meet each loop at one point.',25,'loops'],
  ['square-loop','Square loop','shape','Trace the corners with one pause.',20,'square'], ['circle-stack','Circle stack','shape','Close each circle without a bump.',25,'circles'],
  ['triangle-trio','Triangle trio','shape','Aim each point at the guide.',20,'triangles'], ['oval-orbit','Oval orbit','shape','Keep the oval breathing evenly.',25,'ovals'],
  ['diamond-grid','Diamond grid','shape','Cross through the same corners.',25,'diamonds'], ['box-turn','Box turn','shape','Keep opposite sides parallel.',20,'boxes'],
  ['leaf-pair','Leaf pair','shape','Meet the tips, then lift.',20,'leaves'], ['target-rings','Target rings','shape','Keep each ring centered.',30,'rings']
];
export const drills: Drill[] = drillRows.map(([id,title,kind,cue,seconds,guide]) => ({id,title,kind,cue,seconds,guide}));
export const sampleProgress = [{date:'2026-08-26', drillId:'rail-lines'}, {date:'2026-08-27', drillId:'s-curves'}];
