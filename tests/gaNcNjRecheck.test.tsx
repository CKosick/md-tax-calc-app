import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn()
}));

import { Calculator } from '../src/components/Calculator';
import { calculateVehicleCosts } from '../src/lib/calculator';
import { getDefaultInputs } from '../src/lib/shareParams';
import stateRulesData from '../src/config/stateRules.json';
import sourceLinkStatus from '../src/config/sourceLinkStatus.json';
import { CalculatorInputs, StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const ga = rules.georgia as StateRule;
const nc = rules['north-carolina'] as StateRule;
const nj = rules['new-jersey'] as StateRule;
const calc = (rule: StateRule, extra: Partial<CalculatorInputs> = {}) =>
  calculateVehicleCosts(rule, { ...getDefaultInputs(rule, 2026), purchasePrice: 15000, ...extra }, 2026);

afterEach(() => cleanup());

describe('Georgia re-check', () => {
  it('7.0% TAVT, $18 title with no separate lien fee, $20 plate for cars and motorcycles', () => {
    const b = calc(ga);
    expect(b.exciseTax).toBe(1050);
    expect(b.titleFee).toBe(18);
    expect(calc(ga, { isFinanced: true }).lienFilingFee).toBe(0);
    expect(b.registrationTotal).toBe(20);
    expect(calc(ga, { vehicleType: 'motorcycle' }).registrationTotal).toBe(20);
    expect(b.totalFirstYearCost).toBe(1088);
  });

  it('no trade-in reduction on a private sale; EVs add the $238.59 alternative fuel fee', () => {
    expect(calc(ga, { tradeInValue: 5000 }).exciseTax).toBe(1050);
    expect(calc(ga, { fuelType: 'ev' }).registrationTotal).toBe(258.59);
    expect(calc(ga, { fuelType: 'phev' }).registrationTotal).toBe(20);
  });

  it('says the DOR taxes its assessed value, not the price, and drops the unsupported "if higher" claim', () => {
    const text = [...ga.disclaimers, ...ga.notes, ...ga.faqs.map((f) => f.answer)].join(' ');
    expect(text).toContain('assessment manual');
    expect(text).toContain('TAVT estimator');
    expect(text).not.toMatch(/purchase price if higher/i);
    expect(text).toContain('3%');
    expect(text).toContain('0.5%');
    expect(text).toContain('within 7 days');
    expect(text).toContain('within 30 days');
  });
});

describe('North Carolina re-check', () => {
  it('3% highway use tax, $66.75 title, $46.25 registration', () => {
    const b = calc(nc);
    expect(b.exciseTax).toBe(450);
    expect(b.titleFee).toBe(66.75);
    expect(b.registrationTotal).toBe(46.25);
    expect(b.totalFirstYearCost).toBe(563);
    expect(calc(nc, { vehicleType: 'motorcycle' }).registrationTotal).toBe(29.5);
  });

  it('no $2,000 cap on passenger vehicles', () => {
    expect(nc.maxExciseTax).toBeUndefined();
    expect(calc(nc, { purchasePrice: 100000 }).exciseTax).toBe(3000);
  });

  it('a trade-in the seller allows lowers the tax; EV $214.50 and plug-in hybrid $107.25 fees', () => {
    expect(calc(nc, { tradeInValue: 5000 }).exciseTax).toBe(300);
    expect(calc(nc, { fuelType: 'ev' }).registrationTotal).toBe(260.75);
    expect(calc(nc, { fuelType: 'phev' }).registrationTotal).toBe(153.5);
  });

  it('no unsourced lien fee, and the copy names the $250 and $2,000 caps for what they cover', () => {
    expect(calc(nc, { isFinanced: true }).lienFilingFee).toBe(0);
    const text = [...nc.disclaimers, ...nc.faqs.map((f) => f.answer)].join(' ');
    expect(text).toContain('at least 90 days');
    expect(text).toContain('commercial vehicles over 26,000 pounds');
    expect(text).toContain('MVR-613');
    expect(text).toContain('28 days');
  });
});

describe('New Jersey re-check', () => {
  it('6.625% of the price, $60 title, $25 more with a lien, no private trade-in credit', () => {
    const b = calc(nj);
    expect(b.exciseTax).toBe(993.75);
    expect(b.titleFee).toBe(60);
    expect(calc(nj, { isFinanced: true }).lienFilingFee).toBe(25);
    expect(calc(nj, { tradeInValue: 5000 }).exciseTax).toBe(993.75);
  });

  it('registration by weight (3,500 lbs) and by model year: $12.50 more within 2 years', () => {
    expect(calc(nj).registrationTotal).toBe(46.5); // 2019 model
    expect(calc(nj, { weightClass: 'over3700lbs' }).registrationTotal).toBe(71.5);
    expect(calc(nj, { vehicleYear: 2024 }).registrationTotal).toBe(59);
    expect(calc(nj, { vehicleYear: 2026, weightClass: 'over3700lbs' }).registrationTotal).toBe(84);
    expect(calc(nj, { vehicleYear: 2023 }).registrationTotal).toBe(46.5);
    expect(calc(nj, { vehicleType: 'motorcycle', vehicleYear: 2026 }).registrationTotal).toBe(65);
  });

  it('ZEV fee is $270, and the copy says it is derived from the statutory schedule', () => {
    expect(calc(nj, { fuelType: 'ev' }).registrationTotal).toBe(316.5);
    const text = [...nj.notes, ...nj.disclaimers, ...nj.faqs.map((f) => f.answer)].join(' ');
    expect(text).toContain('statutory schedule');
    expect(text).toContain('not a figure the MVC publishes');
  });

  it('labels the weight split at 3,500 lbs', () => {
    const { container } = render(<Calculator initialRule={nj} />);
    expect(container.textContent).toContain('3,500 lbs');
    expect(container.textContent).not.toContain('3,700 lbs');
  });
});

describe('Batch 7 source repair', () => {
  it('no hidden links remain for the three states, each has a repaired entry and verified sources', () => {
    for (const key of ['georgia', 'north-carolina', 'new-jersey']) {
      expect(sourceLinkStatus.hidden.some((h) => h.state === key)).toBe(false);
      expect(sourceLinkStatus.repaired.some((r) => r.state === key)).toBe(true);
      expect(rules[key].lastVerified).toBe('October 2026');
      expect(rules[key].sources.length).toBeGreaterThanOrEqual(5);
    }
  });

  it('new copy for the three states has no em dashes', () => {
    for (const rule of [ga, nc, nj]) {
      const text = JSON.stringify([rule.localTaxNote, rule.notes, rule.disclaimers, rule.faqs]);
      expect(text).not.toContain('—');
    }
  });
});
