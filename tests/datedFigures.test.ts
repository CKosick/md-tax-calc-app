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
      const r = rules[f.state];
      // The form shows EV and plug-in hybrid fees as these labels (VehicleInputForm).
      const formLabels = [r.registration.evSurchargeAnnual, r.registration.phevSurchargeAnnual].filter((fee): fee is number => Boolean(fee)).map((fee) => `+$${Number.isInteger(fee) ? fee : fee.toFixed(2)}/yr`);
      const shown = [r.localTaxNote ?? '', r.tradeInNote ?? '', ...formLabels, ...r.disclaimers, ...r.faqs.map((q) => `${q.question} ${q.answer}`)].join(' ');
      expect(shown, `${f.state}: "${f.contains}" (${f.figure}) must be in copy the page shows, not in notes`).toContain(f.contains);
    }
  });

  it('flags each figure on and after its stale date, not before', () => {
    expect(staleFigures(new Date('2026-12-31T12:00:00Z'))).toEqual([]);
    expect(staleFigures(new Date('2027-01-01T12:00:00Z')).map((f) => f.state)).toEqual(['washington', 'missouri', 'tennessee', 'colorado', 'kentucky', 'kentucky', 'vermont']);
    expect(staleFigures(new Date('2027-07-01T12:00:00Z')).map((f) => f.state)).toEqual(['washington', 'missouri', 'tennessee', 'colorado', 'colorado', 'washington', 'georgia', 'kentucky', 'kentucky', 'alabama', 'alabama', 'oregon', 'vermont']);
    expect(staleFigures(new Date('2027-09-01T12:00:00Z'))).toHaveLength(DATED_FIGURES.length);
  });

  it('no figure is stale today (re-check and update the entry when this fails)', () => {
    const stale = staleFigures();
    const message = stale.map((f) => `${f.state}: ${f.figure} (stale from ${f.staleOn}; also check ${f.alsoCheck ?? 'nothing else'})`).join('\n');
    expect(stale, message).toEqual([]);
  });
});
