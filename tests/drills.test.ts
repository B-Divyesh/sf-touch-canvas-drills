import { describe, expect, it } from 'vitest';
import { drills } from '../src/drills';
describe('drill library', () => {
  it('has a balanced set of timed drills', () => {
    expect(drills).toHaveLength(20);
    expect(new Set(drills.map(d => d.kind))).toEqual(new Set(['line', 'curve', 'shape']));
    expect(drills.every(d => d.seconds >= 20 && d.seconds <= 30)).toBe(true);
  });
});
