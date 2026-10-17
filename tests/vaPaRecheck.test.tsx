import React from 'react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn()
}));

import { Calculator } from '../src/components/Calculator';
import { calculateVehicleCosts } from '../src/lib/calculator';
import { getDefaultInputs } from '../src/lib/shareParams';
import { getVisibleSources } from '../src/lib/sources';
import stateRulesData from '../src/config/stateRules.json';
import sourceLinkStatus from '../src/config/sourceLinkStatus.json';
import { CalculatorInputs, StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const va = rules.virginia as StateRule;
const pa = rules.pennsylvania as StateRule;
const calc = (rule: StateRule, overrides: Partial<CalculatorInputs> = {}) =>
  calculateVehicleCosts(rule, { ...getDefaultInputs(rule, 2026), purchasePrice: 15000, ...overrides }, 2026);

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-17T12:00:00'));
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('Virginia re-check (October 2026)', () => {
  it('keeps the verified rate, minimum, title, lien, registration, and 2-year amounts', () => {
    expect(va.exciseTaxRate).toBe(0.0415);
    expect(va.minExciseTax).toBe(75);
    expect(va.titleFee).toBe(15);
    expect(va.lienFilingFee).toBe(15);
    expect(va.registration.passenger.under3700lbs).toEqual({ '1': 30.75, '2': 59.5 });
    expect(va.registration.passenger.over3700lbs).toEqual({ '1': 35.75, '2': 69.5 });
    expect(va.registration.motorcycle).toEqual({ '1': 24.75, '2': 47.5 });
  });

  it('uses the current EV Highway Use Fee ($135.63 a year)', () => {
    expect(va.registration.evSurchargeAnnual).toBe(135.63);
    expect(calc(va, { fuelType: 'ev', registrationTerm: 1 }).evSurcharge).toBe(135.63);
  });

  it('labels the passenger weight split at 4,000 lbs (other two-tier states stay at 3,700)', () => {
    const { container } = render(<Calculator initialRule={va} />);
    expect(container.textContent).toContain('≤ 4,000 lbs');
    expect(container.textContent).toContain('> 4,000 lbs');
    expect(container.textContent).not.toContain('3,700 lbs');
    cleanup();

    const twoTier = Object.values(rules).find(
      (r) => r !== va && r.registration.passenger.under3700lbs && !r.registration.passenger.under3500lbs
    ) as StateRule;
    const other = render(<Calculator initialRule={twoTier} />);
    expect(other.container.textContent).toContain('≤ 3,700 lbs');
  });

  it('shows the under-5 SUT-1A notice instead of the general 7-year notice', () => {
    expect(calc(va, { vehicleYear: 2022 }).bookValueApplies).toBe(true);
    expect(calc(va, { vehicleYear: 2021 }).bookValueApplies).toBe(false);

    const { container } = render(<Calculator initialRule={va} />);
    fireEvent.change(container.querySelector('#model-year-input')!, { target: { value: '2022' } });
    const results = container.querySelector('#calculator-results')?.textContent ?? '';
    expect(results).toContain('Price Check Rule (Under 5 Years Old)');
    expect(results).toContain('not within $1,500 of the NADA trade-in value');
    expect(results).not.toMatch(/notari|7 years old or newer/i);
  });
});

describe('Pennsylvania re-check (October 2026)', () => {
  it('keeps the verified rate, title, lien, and registration amounts', () => {
    expect(pa.exciseTaxRate).toBe(0.06);
    expect(pa.titleFee).toBe(72);
    expect(pa.lienFilingFee).toBe(36);
    expect(pa.registration.passenger.under3700lbs).toEqual({ '1': 48, '2': 96 });
    expect(pa.registration.motorcycle).toEqual({ '1': 25, '2': 50 });
  });

  it('shows the 6% to 8% range for Allegheny County (7%) and Philadelphia (8%)', () => {
    const b = calc(pa);
    expect(b.hasLocalTax).toBe(true);
    expect(b.combinedTaxMin).toBe(900);
    expect(b.combinedTaxMax).toBe(1200);
    expect(b.totalFirstYearCostMin).toBe(1068);
    expect(b.totalFirstYearCostMax).toBe(1368);
    expect(pa.localTaxNote).toContain('Allegheny County residents pay 7%');
    expect(pa.localTaxNote).toContain('City of Philadelphia residents pay 8%');
  });
});

describe('Virginia and Pennsylvania sources and dates', () => {
  it('are verified October 2026 with working sources and nothing hidden or homepage-only', () => {
    for (const rule of [va, pa]) {
      expect(rule.lastVerified).toBe('October 2026');
      expect(getVisibleSources(rule).map((s) => s.url)).toEqual(rule.sources);
    }
    const listed = [...sourceLinkStatus.hidden, ...sourceLinkStatus.homepageOnly].map((e) => e.state);
    expect(listed).not.toContain('virginia');
    expect(listed).not.toContain('pennsylvania');
    expect(sourceLinkStatus.repaired.map((r) => r.state)).toEqual(['virginia', 'pennsylvania']);
  });

  it('FAQs and disclaimers carry the verified facts, without the old generic answers', () => {
    const vaText = JSON.stringify([va.faqs, va.disclaimers]);
    expect(vaText).toContain('46.2-630');
    expect(vaText).toContain('SUT 3');
    expect(vaText).not.toMatch(/vary significantly by state|typically ranging between 10 to 30 days/);
    const paText = JSON.stringify([pa.faqs, pa.disclaimers]);
    expect(paText).toContain('MV-13ST');
    expect(paText).toContain('20 days');
    expect(paText).not.toMatch(/vary significantly by state|typically ranging between 10 to 30 days|optional \$5/);
  });
});
