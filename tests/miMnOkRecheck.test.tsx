import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, fireEvent, act } from '@testing-library/react';

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
const mi = rules.michigan as StateRule;
const mn = rules.minnesota as StateRule;
const ok = rules.oklahoma as StateRule;
// Calculation year 2026: a 2026 model is in its 1st registration year, a 2019 model in its 8th
const calc = (rule: StateRule, extra: Partial<CalculatorInputs> = {}) =>
  calculateVehicleCosts(rule, { ...getDefaultInputs(rule, 2026), purchasePrice: 15000, registrationTerm: 1, ...extra }, 2026);

afterEach(() => {
  cleanup();
  currentSearchParams = new URLSearchParams();
});

describe('Michigan registration by list price (MCL 257.801)', () => {
  it('first registration follows the list price brackets', () => {
    expect(calc(mi, { vehicleYear: 2026, listPrice: 5000 }).registrationTotal).toBe(36);
    expect(calc(mi, { vehicleYear: 2026, listPrice: 6500 }).registrationTotal).toBe(40);
    expect(calc(mi, { vehicleYear: 2026, listPrice: 25000 }).registrationTotal).toBe(148);
    expect(calc(mi, { vehicleYear: 2026, listPrice: 30000 }).registrationTotal).toBe(178);
    // Over $30,000: +$6 per $1,000 or part of $1,000
    expect(calc(mi, { vehicleYear: 2026, listPrice: 30001 }).registrationTotal).toBe(184);
    expect(calc(mi, { vehicleYear: 2026, listPrice: 45000 }).registrationTotal).toBe(268);
  });

  it('drops 10% a year for three years, then stays level', () => {
    expect(calc(mi, { vehicleYear: 2025, listPrice: 30000 }).registrationTotal).toBe(160.2);
    expect(calc(mi, { vehicleYear: 2024, listPrice: 30000 }).registrationTotal).toBe(144.18);
    expect(calc(mi, { vehicleYear: 2023, listPrice: 30000 }).registrationTotal).toBe(129.76);
    expect(calc(mi, { vehicleYear: 2010, listPrice: 30000 }).registrationTotal).toBe(129.76);
  });

  it('EV and PHEV fees, motorcycles, title and tax', () => {
    expect(calc(mi, { vehicleYear: 2026, listPrice: 30000, fuelType: 'ev' }).registrationTotal).toBe(178 + 267);
    expect(calc(mi, { vehicleYear: 2026, listPrice: 30000, fuelType: 'phev' }).registrationTotal).toBe(178 + 113);
    expect(calc(mi, { vehicleType: 'motorcycle' }).registrationTotal).toBe(25);
    expect(mi.titleFee).toBe(15);
    expect(calc(mi).exciseTax).toBe(900);
  });
});

describe('Minnesota re-check', () => {
  it('registration tax: $10 + 1.575% of MSRP x the year-of-life share, $30 from year 11', () => {
    expect(calc(mn, { vehicleYear: 2026, listPrice: 30000 }).registrationTotal).toBe(482.5);
    expect(calc(mn, { vehicleYear: 2025, listPrice: 30000 }).registrationTotal).toBe(458.88); // 95%
    expect(calc(mn, { vehicleYear: 2017, listPrice: 30000 }).registrationTotal).toBe(57.25); // year 10, 10%
    expect(calc(mn, { vehicleYear: 2016, listPrice: 30000 }).registrationTotal).toBe(30); // year 11
    expect(calc(mn, { vehicleType: 'motorcycle' }).registrationTotal).toBe(10);
    expect(calc(mn, { vehicleYear: 2016, fuelType: 'ev' }).registrationTotal).toBe(180);
  });

  it('a vehicle 10+ years old sold under $3,000 pays the $10 tax', () => {
    const b = calc(mn, { vehicleYear: 2016, purchasePrice: 2500 });
    expect(b.exciseTax).toBe(10);
    expect(b.itemizedList[0].description).toContain('$10 flat tax');
    expect(calc(mn, { vehicleYear: 2016, purchasePrice: 3000 }).exciseTax).toBe(206.25);
    expect(calc(mn, { vehicleYear: 2017, purchasePrice: 2500 }).exciseTax).toBe(171.88); // 9 years old
  });

  it('title transfer is $36 and a trade-in reduces the taxed price', () => {
    expect(mn.titleFee).toBe(36);
    expect(calc(mn, { tradeInValue: 5000 }).exciseTax).toBe(687.5);
  });
});

describe('Oklahoma re-check', () => {
  it('excise tax: $20 on the first $1,500, 3.25% of the rest, plus 1.25% sales tax', () => {
    const b = calc(ok);
    expect(b.exciseTax).toBe(646.25);
    expect(b.itemizedList[0].description).toContain('$20 on the first $1,500');
    expect(b.itemizedList[0].description).toContain('1.25% sales tax ($187.50)');
    expect(calc(ok, { purchasePrice: 1000 }).exciseTax).toBe(32.5); // $20 + $12.50 sales tax
    expect(calc(ok, { purchasePrice: 0 }).exciseTax).toBe(0);
  });

  it('registration by registration year, including motorcycles', () => {
    expect(calc(ok, { vehicleYear: 2026 }).registrationTotal).toBe(96);
    expect(calc(ok, { vehicleYear: 2023 }).registrationTotal).toBe(96); // year 4
    expect(calc(ok, { vehicleYear: 2022 }).registrationTotal).toBe(86); // year 5
    expect(calc(ok, { vehicleYear: 2015 }).registrationTotal).toBe(66); // year 12
    expect(calc(ok, { vehicleYear: 2014 }).registrationTotal).toBe(46); // year 13
    expect(calc(ok, { vehicleYear: 2010 }).registrationTotal).toBe(26); // year 17
  });

  it('fees: $29.50 title transfer, EV $210, PHEV $112', () => {
    expect(ok.titleFee).toBe(29.5);
    expect(calc(ok, { vehicleYear: 2026, fuelType: 'ev' }).registrationTotal).toBe(96 + 210);
    expect(calc(ok, { vehicleYear: 2026, fuelType: 'phev' }).registrationTotal).toBe(96 + 112);
    expect(calc(ok, { vehicleYear: 2026, vehicleType: 'motorcycle' }).registrationTotal).toBe(99);
    expect(calc(ok, { vehicleYear: 2005, vehicleType: 'motorcycle' }).registrationTotal).toBe(29);
  });
});

describe('Only these states use the new rules', () => {
  it('list price, registration-year, excise floor, sales tax, and older-vehicle rules', () => {
    const using = (pick: (r: StateRule) => unknown) =>
      Object.entries(rules).filter(([, r]) => pick(r) !== undefined).map(([k]) => k).sort();
    expect(using((r) => r.registration.listPriceRegistration)).toEqual(['michigan', 'minnesota']);
    expect(using((r) => r.registration.feesByRegistrationYear)).toEqual(['oklahoma', 'utah']);
    expect(using((r) => r.usedVehicleExcise)).toEqual(['oklahoma']);
    expect(using((r) => r.additionalSalesTaxRate)).toEqual(['oklahoma']);
    expect(using((r) => r.olderVehicleFlatTax)).toEqual(['minnesota']);
  });
});

describe('Weight labels (repair batch check)', () => {
  it('Michigan and Minnesota ask for the list price, not weight', () => {
    for (const rule of [mi, mn]) {
      const { container } = render(<Calculator initialRule={rule} />);
      expect(container.querySelector('#list-price-input')).not.toBeNull();
      expect(container.querySelector('#weight-under-3700')).toBeNull();
      expect(container.querySelector('#weight-over-3700')).toBeNull();
      expect(container.textContent).toContain('Blank uses $30,000.');
      expect(container.textContent).toContain('for a $30,000.00 list price');
      cleanup();
    }
  });

  it('Oklahoma asks neither weight nor list price', () => {
    const { container } = render(<Calculator initialRule={ok} />);
    expect(container.querySelector('#list-price-input')).toBeNull();
    expect(container.querySelector('#weight-under-3700')).toBeNull();
    expect(container.querySelector('#vehicle-weight-input')).toBeNull();
  });

  it('a list price entry updates the card and the share link carries msrp=', async () => {
    const { container, getByRole } = render(<Calculator initialRule={mi} />);
    fireEvent.change(container.querySelector('#list-price-input')!, { target: { value: '45000' } });
    expect(container.textContent).toContain('for a $45,000.00 list price');
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    await act(async () => {
      fireEvent.click(getByRole('button', { name: /save \/ share result/i }));
    });
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('msrp=45000'));
    const parsed = inputsFromSearchParams(mi, new URLSearchParams('price=15000&msrp=45000'), getDefaultInputs(mi, 2026));
    expect(parsed.listPrice).toBe(45000);
    const other = inputsFromSearchParams(ok, new URLSearchParams('price=15000&msrp=45000'), getDefaultInputs(ok, 2026));
    expect(other.listPrice).toBeUndefined();
  });
});

describe('Batch 5 states are verified for October 2026', () => {
  it('no generic FAQs, no em dashes, October 2026', () => {
    for (const rule of [mi, mn, ok]) {
      expect(rule.lastVerified).toBe('October 2026');
      const text = JSON.stringify([rule.faqs, rule.notes, rule.disclaimers, rule.localTaxNote]);
      expect(text).not.toMatch(/vary significantly by state|vary by jurisdiction|reciprocal tax credit/i);
      expect(text).not.toContain('—');
    }
  });
});
