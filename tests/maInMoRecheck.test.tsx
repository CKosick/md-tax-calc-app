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
const ma = rules.massachusetts as StateRule;
const ind = rules.indiana as StateRule;
const mo = rules.missouri as StateRule;
const calc = (rule: StateRule, extra: Partial<CalculatorInputs> = {}) =>
  calculateVehicleCosts(rule, { ...getDefaultInputs(rule, 2026), purchasePrice: 15000, ...extra }, 2026);
afterEach(() => cleanup());

const copy = (rule: StateRule) =>
  [rule.localTaxNote ?? '', ...rule.notes, ...rule.disclaimers, ...rule.faqs.map((f) => `${f.question} ${f.answer}`)].join(' ');

describe('Massachusetts re-check', () => {
  it('6.25%, $75 title, no lien fee, $60 two-year plates, no private trade-in credit', () => {
    const b = calc(ma);
    expect(b.exciseTax).toBe(937.5);
    expect(b.titleFee).toBe(75);
    expect(calc(ma, { isFinanced: true }).lienFilingFee).toBe(0);
    expect(b.registrationTotal).toBe(60);
    expect(b.totalFirstYearCost).toBe(1072.5);
    expect(calc(ma, { tradeInValue: 5000 }).exciseTax).toBe(937.5);
    expect(calc(ma, { vehicleType: 'motorcycle' }).registrationTotal).toBe(40);
  });

  it('copy covers the book value rule, the exemptions, the deadlines, and the excise', () => {
    const text = copy(ma);
    for (const fact of ['clean trade-in', 'mileage', 'MVU-26', 'MVU-24', 'MVU-29', 'grandparent', '10 days', '7 days', '$25 per $1,000', '$20 a year', 'no grace period']) expect(text).toContain(fact);
  });
});

describe('Indiana re-check', () => {
  it('7%, $15 title, $36.35 registration with the TIIF, motorcycle $41.35, EV $242 and hybrid $81', () => {
    const b = calc(ind);
    expect(b.exciseTax).toBe(1050);
    expect(b.titleFee).toBe(15);
    expect(b.registrationTotal).toBe(36.35);
    expect(b.totalFirstYearCost).toBe(1101.35);
    expect(calc(ind, { vehicleType: 'motorcycle' }).registrationTotal).toBe(41.35);
    expect(calc(ind, { fuelType: 'ev' }).registrationTotal).toBe(278.35);
    expect(calc(ind, { fuelType: 'phev' }).registrationTotal).toBe(117.35);
  });

  it('copy covers the 45-day and 60-day deadlines, ST-108E exemptions, and the excise tax', () => {
    const text = copy(ind);
    for (const fact of ['45 days', '$30', '60 days', 'ST-108E', 'security agreement', 'VIN inspection', '$532']) expect(text).toContain(fact);
  });
});

describe('Missouri re-check', () => {
  it('4.225% plus the 1.0% to 7.263% local range, $17.50 title, no lien fee, $33.25 plates', () => {
    const b = calc(mo);
    expect(b.exciseTax).toBe(633.75);
    expect(b.localTaxMin).toBe(150);
    expect(b.localTaxMax).toBe(1089.45);
    expect(b.titleFee).toBe(17.5);
    expect(calc(mo, { isFinanced: true }).lienFilingFee).toBe(0);
    expect(b.registrationTotal).toBe(33.25);
    expect(b.totalFirstYearCostMin).toBe(834.5);
    expect(b.totalFirstYearCostMax).toBe(1773.95);
  });

  it('motorcycle $17.75, EV decal $150 and plug-in hybrid $75, the 180-day credit through the trade-in field', () => {
    expect(calc(mo, { vehicleType: 'motorcycle' }).registrationTotal).toBe(17.75);
    expect(calc(mo, { fuelType: 'ev' }).registrationTotal).toBe(183.25);
    expect(calc(mo, { fuelType: 'phev' }).registrationTotal).toBe(108.25);
    expect(calc(mo, { tradeInValue: 5000 }).exciseTax).toBe(422.5);
  });

  it('copy discloses the derived decal and the trade-in rule conflict', () => {
    const text = copy(mo);
    for (const fact of ['worked out from', 'RSMo 142.869', '12 CSR 10-103.350', '180 days', 'Form 5049', '30 days', '$200', '90 days', 'taxable horsepower']) expect(text).toContain(fact);
  });
});

describe('Trade-in notices', () => {
  it('Missouri and Massachusetts show their own trade-in notice, not the generic one', () => {
    const moPage = render(<Calculator initialRule={mo} />).container.textContent ?? '';
    expect(moPage).toContain('12 CSR 10-103.350');
    expect(moPage).not.toContain('allows trade-in value on private sales');
    cleanup();
    const maPage = render(<Calculator initialRule={ma} />).container.textContent ?? '';
    expect(maPage).toContain('gives no trade-in credit on a private sale');
    expect(maPage).not.toContain('taxes the full agreed vehicle price');
  });
});

describe('Batch 9 source repair', () => {
  it('no hidden links remain for the three states, each has a repaired entry and verified sources', () => {
    for (const key of ['massachusetts', 'indiana', 'missouri']) {
      expect(sourceLinkStatus.hidden.some((h) => h.state === key)).toBe(false);
      expect(sourceLinkStatus.repaired.some((r) => r.state === key)).toBe(true);
      expect(rules[key].lastVerified).toBe('October 2026');
      expect(rules[key].sources.length).toBeGreaterThanOrEqual(5);
    }
  });

  it('new copy for the three states has no em dashes', () => {
    for (const rule of [ma, ind, mo]) {
      const text = JSON.stringify([rule.localTaxNote, rule.notes, rule.disclaimers, rule.faqs]);
      expect(text).not.toContain('—');
    }
  });
});
