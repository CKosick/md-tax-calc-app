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
import { getVisibleSources, labelForSource } from '../src/lib/sources';
import stateRulesData from '../src/config/stateRules.json';
import sourceLinkStatus from '../src/config/sourceLinkStatus.json';
import { CalculatorInputs, StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const al = rules.alabama as StateRule;
const ky = rules.kentucky as StateRule;
const or = rules.oregon as StateRule;
const calc = (rule: StateRule, extra: Partial<CalculatorInputs> = {}) =>
  calculateVehicleCosts(rule, { ...getDefaultInputs(rule, 2026), purchasePrice: 15000, ...extra }, 2026);
const copy = (rule: StateRule) =>
  [rule.localTaxNote ?? '', rule.tradeInNote ?? '', ...rule.notes, ...rule.disclaimers, ...rule.faqs.map((f) => `${f.question} ${f.answer}`)].join(' ');

afterEach(() => cleanup());

describe('Alabama re-check', () => {
  it('2% state tax plus the 0% to 5.25% local range, $15 title, $15 lien, $23 registration', () => {
    const b = calc(al);
    expect(b.exciseTax).toBe(300);
    expect(b.localTaxMin).toBe(0);
    expect(b.localTaxMax).toBe(787.5);
    expect(b.titleFee).toBe(15);
    expect(calc(al, { isFinanced: true }).lienFilingFee).toBe(15);
    expect(b.registrationTotal).toBe(23);
    expect(b.totalFirstYearCostMin).toBe(338);
    expect(b.totalFirstYearCostMax).toBe(1125.5);
  });

  it('trade-in credit lowers the price (Ala. Code 40-23-103); EV $203, plug-in hybrid $103, motorcycle $15', () => {
    expect(calc(al, { tradeInValue: 5000 }).exciseTax).toBe(200);
    expect(calc(al, { fuelType: 'ev' }).registrationTotal).toBe(226);
    expect(calc(al, { fuelType: 'phev' }).registrationTotal).toBe(126);
    expect(calc(al, { vehicleType: 'motorcycle' }).registrationTotal).toBe(15);
  });

  it('copy covers the local rate file, ad valorem tax, gifts, new residents, and the 20-day deadline', () => {
    const text = copy(al);
    for (const fact of ['November 2026', 'Monroe County', 'Shorter', 'ad valorem', '810-6-1-.150', 'substantially used', '30 days', '20 calendar days', '$1.25 issuance fee', 'July 1, 2023']) expect(text).toContain(fact);
  });
});

describe('Kentucky re-check', () => {
  it('6% usage tax with no local tax, $9 title, $12 lien, $20.50 registration', () => {
    const b = calc(ky);
    expect(b.exciseTax).toBe(900);
    expect(b.hasLocalTax).toBe(false);
    expect(b.titleFee).toBe(9);
    expect(calc(ky, { isFinanced: true }).lienFilingFee).toBe(12);
    expect(b.registrationTotal).toBe(20.5);
    expect(b.totalFirstYearCost).toBe(929.5);
  });

  it('trade-in deducted; $120 electric vehicle fee for EVs and plug-in hybrids; motorcycle $18', () => {
    expect(calc(ky, { tradeInValue: 5000 }).exciseTax).toBe(600);
    expect(calc(ky, { fuelType: 'ev' }).registrationTotal).toBe(140.5);
    expect(calc(ky, { fuelType: 'phev' }).registrationTotal).toBe(140.5);
    expect(calc(ky, { vehicleType: 'motorcycle' }).registrationTotal).toBe(18);
  });

  it('copy covers the affidavit floor, family exemptions, gifts, the new resident credit, deadlines, and the dated fees', () => {
    const text = copy(ky);
    for (const fact of ['TC 96-182', '50%', 'grandchildren', '71A101', 'average trade-in value', 'substantially identical', '10 days', '15 days', 'until January 1, 2027', '$120 statutory base', 'property tax']) expect(text).toContain(fact);
  });
});

describe('Oregon re-check', () => {
  it('no sales tax; 20 to 39 MPG tier: $106 title and $136 two-year registration', () => {
    const b = calc(or);
    expect(b.exciseTax).toBe(0);
    expect(b.titleFee).toBe(106);
    expect(b.registrationTotal).toBe(136);
    expect(b.totalFirstYearCost).toBe(242);
    expect(or.registration.terms).toEqual([2]);
  });

  it('electric $376 for two years, motorcycle $88', () => {
    expect(calc(or, { fuelType: 'ev' }).registrationTotal).toBe(376);
    expect(calc(or, { vehicleType: 'motorcycle' }).registrationTotal).toBe(88);
  });

  it('copy covers the MPG tiers, the current-plates rule, county fees, and the late title fees', () => {
    const text = copy(or);
    for (const fact of ['$101', '$116', '$126', '$216', '$192', 'current Oregon plates', 'Multnomah', '$112', '$60', '$25', '$50', '30 days', 'July 1, 2027', '7,500 miles']) expect(text).toContain(fact);
  });

  it('shows only the two-year registration term', () => {
    const { container } = render(<Calculator initialRule={or} />);
    expect(container.textContent).toContain('2-Year');
    expect(container.textContent).not.toContain('1-Year Term');
  });
});

describe('Batch 11 source repair', () => {
  it('no hidden links remain for the three states, each has a repaired entry and verified sources', () => {
    for (const key of ['alabama', 'kentucky', 'oregon']) {
      expect(sourceLinkStatus.hidden.some((h) => h.state === key)).toBe(false);
      expect(sourceLinkStatus.repaired.some((r) => r.state === key)).toBe(true);
      expect(rules[key].lastVerified).toBe('November 2026');
      expect(rules[key].sources.length).toBeGreaterThanOrEqual(4);
      expect(getVisibleSources(rules[key])).toHaveLength(rules[key].sources.length);
    }
    expect(ky.sources).not.toContain('https://drive.ky.gov/motor-vehicle-licensing/Pages/Vehicle-Taxes.aspx');
  });

  it('Alabama and Kentucky statute links get readable citations', () => {
    expect(labelForSource('https://alison.legislature.state.al.us/code-of-alabama?section=40-23-103')).toBe('alison.legislature.state.al.us: Ala. Code 40-23-103');
    expect(labelForSource('https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=55787')).toBe('apps.legislature.ky.gov: KRS 138.475');
    for (const url of ky.sources.filter((u) => u.includes('apps.legislature.ky.gov'))) expect(labelForSource(url)).toMatch(/: KRS \d/);
  });

  it('new copy for the three states has no em dashes', () => {
    for (const rule of [al, ky, or]) {
      const text = JSON.stringify([rule.localTaxNote, rule.tradeInNote, rule.notes, rule.disclaimers, rule.faqs]);
      expect(text).not.toContain('—');
    }
  });
});
