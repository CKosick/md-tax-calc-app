import { describe, it, expect } from 'vitest';
import { DATED_FIGURES, staleFigures } from '../src/lib/datedFigures';
import stateRulesData from '../src/config/stateRules.json';
import { StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;

describe('Dated figures', () => {
  it('every entry points at a state whose rules still show the figure', () => {
    expect(DATED_FIGURES.length).toBeGreaterThan(0);
    for (const f of DATED_FIGURES) {
      expect(rules[f.state], `${f.state} must exist`).toBeDefined();
      expect(f.staleOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(JSON.stringify(rules[f.state]), `${f.state}: "${f.contains}" (${f.figure})`).toContain(f.contains);
    }
  });

  it('flags each figure on and after its stale date, not before', () => {
    expect(staleFigures(new Date('2026-12-31T12:00:00Z'))).toEqual([]);
    expect(staleFigures(new Date('2027-01-01T12:00:00Z')).map((f) => f.state)).toEqual(['washington', 'missouri', 'tennessee', 'colorado']);
    expect(staleFigures(new Date('2027-07-01T12:00:00Z')).map((f) => f.state)).toEqual(['washington', 'missouri', 'tennessee', 'colorado', 'colorado', 'washington', 'georgia']);
    expect(staleFigures(new Date('2027-09-01T12:00:00Z'))).toHaveLength(DATED_FIGURES.length);
  });

  it('no figure is stale today (re-check and update the entry when this fails)', () => {
    const stale = staleFigures();
    const message = stale.map((f) => `${f.state}: ${f.figure} (stale from ${f.staleOn}; also check ${f.alsoCheck ?? 'nothing else'})`).join('\n');
    expect(stale, message).toEqual([]);
  });
});
