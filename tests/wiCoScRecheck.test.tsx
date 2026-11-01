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
const wi = rules.wisconsin as StateRule;
const co = rules.colorado as StateRule;
const sc = rules['south-carolina'] as StateRule;
const calc = (rule: StateRule, extra: Partial<CalculatorInputs> = {}) =>
  calculateVehicleCosts(rule, { ...getDefaultInputs(rule, 2026), purchasePrice: 15000, ...extra }, 2026);
const copy = (rule: StateRule) =>
  [rule.localTaxNote ?? '', ...rule.notes, ...rule.disclaimers, ...rule.faqs.map((f) => `${f.question} ${f.answer}`)].join(' ');

afterEach(() => cleanup());

describe('Wisconsin re-check', () => {
  it('5% plus the 0% to 2.9% local range, $214.50 title, $10 lien, $85 registration', () => {
    const b = calc(wi);
    expect(b.exciseTax).toBe(750);
    expect(b.localTaxMin).toBe(0);
    expect(b.localTaxMax).toBe(435);
    expect(b.titleFee).toBe(214.5);
    expect(calc(wi, { isFinanced: true }).lienFilingFee).toBe(10);
    expect(b.registrationTotal).toBe(85);
    expect(b.totalFirstYearCostMin).toBe(1049.5);
    expect(b.totalFirstYearCostMax).toBe(1484.5);
  });

  it('trade-in allowance lowers the price; EV $175 and hybrid $75; motorcycle $23', () => {
    expect(calc(wi, { tradeInValue: 5000 }).exciseTax).toBe(500);
    expect(calc(wi, { fuelType: 'ev' }).registrationTotal).toBe(260);
    expect(calc(wi, { fuelType: 'phev' }).registrationTotal).toBe(160);
    expect(calc(wi, { vehicleType: 'motorcycle' }).registrationTotal).toBe(23);
  });

  it('copy covers the county rates, family exemptions, and deadlines', () => {
    const text = copy(wi);
    for (const fact of ['Waukesha', '0.9%', '2%', 'stepchild', 'current Wisconsin title', '90 days', 'two business days', 'wheel tax']) expect(text).toContain(fact);
  });
});

describe('Colorado re-check', () => {
  it('2.9% state tax with the carried-over local range, $7.20 title, $40 lien, trade-in excluded', () => {
    const b = calc(co);
    expect(b.exciseTax).toBe(435);
    expect(b.localTaxMin).toBe(150);
    expect(b.localTaxMax).toBe(900);
    expect(b.titleFee).toBe(7.2);
    expect(calc(co, { isFinanced: true }).lienFilingFee).toBe(40);
    expect(calc(co, { tradeInValue: 5000 }).exciseTax).toBe(290);
  });

  it('registration follows the age fee: $67.19 under 7 years, $65.19 at 7 to 9, $62.19 at 10 and older', () => {
    expect(calc(co, { vehicleYear: 2024 }).registrationTotal).toBe(67.19);
    expect(calc(co, { vehicleYear: 2019 }).registrationTotal).toBe(65.19);
    expect(calc(co, { vehicleYear: 2015 }).registrationTotal).toBe(62.19);
    expect(calc(co, { vehicleType: 'motorcycle' }).registrationTotal).toBe(37.19);
    expect(calc(co, { fuelType: 'ev', vehicleYear: 2024 }).registrationTotal).toBe(156.24);
    expect(calc(co, { fuelType: 'phev', vehicleYear: 2024 }).registrationTotal).toBe(143.24);
    expect(calc(co).totalFirstYearCostMin).toBe(657.39);
  });

  it('copy discloses the missing local taxes, the specific ownership tax, and the deadlines', () => {
    const text = copy(co);
    for (const fact of ['Colorado Sales Tax Lookup Tool', 'not been re-verified', 'specific ownership tax', '85%', '60 days', '90 days', '$25', 'receipts', '3,500 lbs']) expect(text).toContain(fact);
  });
});

describe('South Carolina re-check', () => {
  it('5% IMF on fair market value capped at $500, trade-in deducted, $15 title, $40 two-year registration', () => {
    const b = calc(sc);
    expect(b.exciseTax).toBe(500);
    expect(calc(sc, { purchasePrice: 6000 }).exciseTax).toBe(300);
    expect(calc(sc, { tradeInValue: 7000 }).exciseTax).toBe(400);
    expect(b.titleFee).toBe(15);
    expect(b.registrationTotal).toBe(40);
    expect(b.totalFirstYearCost).toBe(555);
    expect(sc.registration.terms).toEqual([2]);
  });

  it('EV $120 and hybrid $60 every two years; motorcycle $10', () => {
    expect(calc(sc, { fuelType: 'ev' }).registrationTotal).toBe(160);
    expect(calc(sc, { fuelType: 'phev' }).registrationTotal).toBe(100);
    expect(calc(sc, { vehicleType: 'motorcycle' }).registrationTotal).toBe(10);
  });

  it('copy covers the family exclusion, property tax, the $250 new resident IMF, and 45 days', () => {
    const text = copy(sc);
    for (const fact of ['grandparents', 'heirs', 'property tax', '$250', '$305', '45 days']) expect(text).toContain(fact);
  });

  it('shows only the two-year registration term', () => {
    const { container } = render(<Calculator initialRule={sc} />);
    expect(container.textContent).toContain('2-Year');
    expect(container.textContent).not.toContain('1-Year Term');
  });
});

describe('Batch 10 source repair', () => {
  it('no hidden links remain for the three states, each has a repaired entry and verified sources', () => {
    for (const key of ['wisconsin', 'colorado', 'south-carolina']) {
      expect(sourceLinkStatus.hidden.some((h) => h.state === key)).toBe(false);
      expect(sourceLinkStatus.repaired.some((r) => r.state === key)).toBe(true);
      // Colorado's local range was not re-verified, so its date stays September 2026
      expect(rules[key].lastVerified).toBe(key === 'colorado' ? 'September 2026' : 'October 2026');
      expect(rules[key].sources.length).toBeGreaterThanOrEqual(4);
    }
  });

  it('new copy for the three states has no em dashes', () => {
    for (const rule of [wi, co, sc]) {
      const text = JSON.stringify([rule.localTaxNote, rule.notes, rule.disclaimers, rule.faqs]);
      expect(text).not.toContain('—');
    }
  });
});
