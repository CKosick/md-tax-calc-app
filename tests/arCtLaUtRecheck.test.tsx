import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

let currentSearchParams = new URLSearchParams();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => currentSearchParams,
  notFound: vi.fn()
}));

import { Calculator } from '../src/components/Calculator';
import { calculateVehicleCosts } from '../src/lib/calculator';
import { getDefaultInputs, inputsFromSearchParams } from '../src/lib/shareParams';
import stateRulesData from '../src/config/stateRules.json';
import { CalculatorInputs, StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const ar = rules.arkansas as StateRule;
const ct = rules.connecticut as StateRule;
const la = rules.louisiana as StateRule;
const ut = rules.utah as StateRule;
const calc = (rule: StateRule, extra: Partial<CalculatorInputs> = {}) =>
  calculateVehicleCosts(rule, { ...getDefaultInputs(rule, 2026), purchasePrice: 15000, ...extra }, 2026);

afterEach(() => {
  cleanup();
  currentSearchParams = new URLSearchParams();
});

describe('Arkansas re-check', () => {
  it('local tax runs 0% to 6.125% and applies to the first $2,500 only', () => {
    const b = calc(ar);
    expect(b.exciseTax).toBe(975); // 6.5% state
    expect(b.localTaxMin).toBe(0);
    expect(b.localTaxMax).toBe(153.13); // 6.125% of $2,500
    expect(b.itemizedList[0].description).toContain('on the first $2,500.00');
  });

  it('under $4,000 owes no state or local tax; $4,000 to $9,999 is 3.5% state plus full local', () => {
    const cheap = calc(ar, { purchasePrice: 3000 });
    expect(cheap.exciseTax).toBe(0);
    expect(cheap.hasLocalTax).toBe(false);
    const mid = calc(ar, { purchasePrice: 8000 });
    expect(mid.exciseTax).toBe(280);
    expect(mid.localTaxMax).toBe(153.13);
  });

  it('registration by weight from the DFA schedule, plus the $2.50 decal', () => {
    expect(calc(ar, { vehicleWeight: 2800 }).registrationTotal).toBe(19.5);
    expect(calc(ar).registrationTotal).toBe(27.5); // 3,500 lb default
    expect(calc(ar, { vehicleWeight: 4500 }).registrationTotal).toBe(27.5);
    expect(calc(ar, { vehicleWeight: 4501 }).registrationTotal).toBe(32.5);
    expect(calc(ar, { vehicleType: 'motorcycle' }).registrationTotal).toBe(9.5);
    expect(calc(ar, { fuelType: 'ev' }).registrationTotal).toBe(227.5);
  });

  it('selling the old vehicle within 60 days works like a trade-in', () => {
    expect(calc(ar, { tradeInValue: 5000 }).exciseTax).toBe(650);
  });
});

describe('Connecticut re-check', () => {
  it('registers for three years: $120 plus Clean Air, Passport to the Parks, and administrative fees', () => {
    expect(getDefaultInputs(ct, 2026).registrationTerm).toBe(3);
    const b = calc(ct);
    expect(b.registrationTotal).toBe(169);
    expect(calc(ct, { vehicleType: 'motorcycle' }).registrationTotal).toBe(112);
    expect(b.itemizedList.find((i) => i.id === 'registration-fee')?.label).toContain('3-Year Term');
  });

  it('a share link cannot switch Connecticut to a 1- or 2-year term', () => {
    const parsed = inputsFromSearchParams(ct, new URLSearchParams('price=15000&term=1'), getDefaultInputs(ct, 2026));
    expect(parsed.registrationTerm).toBe(3);
    // Arkansas offers only a 1-year term, so a 2-year link falls back to it
    const other = inputsFromSearchParams(ar, new URLSearchParams('price=15000&term=2'), getDefaultInputs(ar, 2026));
    expect(other.registrationTerm).toBe(1);
  });

  it('6.35%, or 7.75% on the whole price over $50,000; no private trade-in credit', () => {
    expect(calc(ct).exciseTax).toBe(952.5);
    expect(calc(ct, { purchasePrice: 60000 }).exciseTax).toBe(4650);
    expect(calc(ct, { tradeInValue: 5000 }).exciseTax).toBe(952.5);
  });

  it('the form shows only the 3-year term', () => {
    const { container } = render(<Calculator initialRule={ct} />);
    expect(container.querySelector('#term-3-year')).not.toBeNull();
    expect(container.querySelector('#term-1-year')).toBeNull();
    expect(container.querySelector('#term-2-year')).toBeNull();
  });
});

describe('Louisiana re-check', () => {
  it('5% state rate plus 2% to 8.5% local', () => {
    const b = calc(la);
    expect(b.exciseTax).toBe(750);
    expect(b.combinedTaxMin).toBe(1050);
    expect(b.combinedTaxMax).toBe(2025);
  });

  it('plate: 0.1% of the sale price per year, nearest $1,000, $10,000 minimum, two years', () => {
    expect(calc(la).registrationTotal).toBe(30);
    expect(calc(la, { purchasePrice: 10499 }).registrationTotal).toBe(20);
    expect(calc(la, { purchasePrice: 10500 }).registrationTotal).toBe(22);
    expect(calc(la, { purchasePrice: 4000 }).registrationTotal).toBe(20);
    expect(calc(la, { purchasePrice: 40600 }).registrationTotal).toBe(82);
    expect(calc(la, { vehicleType: 'motorcycle' }).registrationTotal).toBe(12);
  });

  it('title includes the $8 handling fee', () => {
    expect(la.titleFee).toBe(76.5);
  });
});

describe('Utah re-check', () => {
  it('registration fee plus the 2026 uniform age-based fee by model year', () => {
    expect(calc(ut, { vehicleYear: 2026 }).registrationTotal).toBe(222.5);
    expect(calc(ut, { vehicleYear: 2024 }).registrationTotal).toBe(222.5);
    expect(calc(ut, { vehicleYear: 2023 }).registrationTotal).toBe(182.5);
    expect(calc(ut, { vehicleYear: 2018 }).registrationTotal).toBe(152.5);
    expect(calc(ut, { vehicleYear: 2015 }).registrationTotal).toBe(122.5);
    expect(calc(ut, { vehicleYear: 2014 }).registrationTotal).toBe(82.5);
    expect(calc(ut, { vehicleYear: 2026, vehicleType: 'motorcycle' }).registrationTotal).toBe(168.25);
    expect(calc(ut, { vehicleYear: 2026, fuelType: 'ev' }).registrationTotal).toBe(402.5);
  });

  it('4.85% plus local, combined 6.35% to 10.05%; a vehicle-for-vehicle trade lowers the price', () => {
    const b = calc(ut);
    expect(b.combinedTaxMin).toBe(952.5);
    expect(b.combinedTaxMax).toBe(1507.5);
    expect(calc(ut, { tradeInValue: 5000 }).exciseTax).toBe(485);
  });
});

describe('Weight labels (repair batch check)', () => {
  it('Arkansas asks for the weight in lbs; Connecticut, Louisiana, and Utah ask no weight question', () => {
    const arPage = render(<Calculator initialRule={ar} />);
    expect(arPage.container.querySelector('#vehicle-weight-input')).not.toBeNull();
    expect(arPage.container.querySelector('#weight-over-3700')).toBeNull();
    cleanup();
    for (const rule of [ct, la, ut]) {
      const { container } = render(<Calculator initialRule={rule} />);
      expect(container.querySelector('#vehicle-weight-input')).toBeNull();
      expect(container.querySelector('#weight-under-3700')).toBeNull();
      expect(container.querySelector('#weight-over-3700')).toBeNull();
      cleanup();
    }
  });
});

describe('Batch 6 states are verified for October 2026', () => {
  it('no generic FAQs, no em dashes, October 2026', () => {
    for (const rule of [ar, ct, la, ut]) {
      expect(rule.lastVerified).toBe('October 2026');
      const text = JSON.stringify([rule.faqs, rule.notes, rule.disclaimers, rule.localTaxNote, rule.bookValueRule]);
      expect(text).not.toMatch(/vary significantly by state|vary by jurisdiction|reciprocal tax credit/i);
      expect(text).not.toContain('—');
    }
  });
});
