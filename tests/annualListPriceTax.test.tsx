import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn()
}));

import { Calculator } from '../src/components/Calculator';
import { calculateVehicleCosts, listPriceAnnualTaxFor } from '../src/lib/calculator';
import { buildShareSearchParams, getDefaultInputs, inputsFromSearchParams } from '../src/lib/shareParams';
import stateRulesData from '../src/config/stateRules.json';
import { CalculatorInputs, StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const ind = rules.indiana as StateRule;
const co = rules.colorado as StateRule;
const inTax = ind.registration.listPriceAnnualTax!;
const coTax = co.registration.listPriceAnnualTax!;
const calc = (rule: StateRule, extra: Partial<CalculatorInputs> = {}) =>
  calculateVehicleCosts(rule, { ...getDefaultInputs(rule, 2026), purchasePrice: 15000, ...extra }, 2026);
const copy = (rule: StateRule) =>
  [rule.localTaxNote ?? '', ...rule.disclaimers, ...rule.faqs.map((f) => `${f.question} ${f.answer}`)].join(' ');

afterEach(() => cleanup());

describe('Indiana vehicle excise tax (BMV passenger table)', () => {
  it('has 17 classes with ten ages each, the last class open-ended', () => {
    expect(inTax.classTable).toHaveLength(17);
    for (const row of inTax.classTable!) expect(row.feesByYear).toHaveLength(10);
    expect(inTax.classTable!.at(-1)!.maxPrice).toBeUndefined();
  });

  it('picks the class by list price and the amount by age (model year = age 0)', () => {
    expect(listPriceAnnualTaxFor(inTax, 30000, 1)).toBe(406); // class 15, age 0
    expect(listPriceAnnualTaxFor(inTax, 29999, 1)).toBe(350); // class 14
    expect(listPriceAnnualTaxFor(inTax, 42500, 1)).toBe(532); // class 17
    expect(listPriceAnnualTaxFor(inTax, 42500, 10)).toBe(50); // age 9+
    expect(listPriceAnnualTaxFor(inTax, 42500, 25)).toBe(50);
    expect(listPriceAnnualTaxFor(inTax, 1000, 1)).toBe(12); // class 1
  });

  it('adds a year of excise tax to registration for passenger vehicles only, from the entered list price', () => {
    const b = calc(ind, { vehicleYear: 2026, listPrice: 45000 });
    expect(b.annualValueTax).toBe(532);
    expect(b.registrationTotal).toBe(568.35);
    expect(b.listPriceUsed).toBe(45000);
    expect(calc(ind).annualValueTax).toBe(91); // $30,000 default, 2019 model year (age 7)
    expect(calc(ind, { vehicleType: 'motorcycle' }).annualValueTax).toBe(0);
  });
});

describe('Colorado specific ownership tax (Class C)', () => {
  it('is 85% of MSRP at 2.1%, 1.5%, 1.2%, 0.9%, then 0.45%, and $3 from the tenth year', () => {
    expect(listPriceAnnualTaxFor(coTax, 40000, 1)).toBe(714);
    expect(listPriceAnnualTaxFor(coTax, 40000, 2)).toBe(510);
    expect(listPriceAnnualTaxFor(coTax, 40000, 3)).toBe(408);
    expect(listPriceAnnualTaxFor(coTax, 40000, 4)).toBe(306);
    expect(listPriceAnnualTaxFor(coTax, 40000, 5)).toBe(153);
    expect(listPriceAnnualTaxFor(coTax, 40000, 9)).toBe(153);
    expect(listPriceAnnualTaxFor(coTax, 40000, 10)).toBe(3);
  });

  it('adds the tax to registration for passenger vehicles only', () => {
    const b = calc(co, { vehicleYear: 2026, listPrice: 40000 });
    expect(b.annualValueTax).toBe(714);
    expect(b.registrationTotal).toBe(781.19);
    expect(calc(co, { vehicleType: 'motorcycle' }).annualValueTax).toBe(0);
  });
});

describe('List price input and sharing', () => {
  it('the eight annual-tax states use the list-price annual tax', () => {
    const using = Object.entries(rules).filter(([, r]) => r.registration.listPriceAnnualTax).map(([k]) => k).sort();
    expect(using).toEqual(['colorado', 'indiana', 'iowa', 'maine', 'nebraska', 'nevada', 'new-hampshire', 'wyoming']);
  });

  it('the form asks for the MSRP and the result names the tax', () => {
    for (const [rule, label] of [[ind, 'Indiana vehicle excise tax'], [co, 'Colorado specific ownership tax']] as const) {
      const { container } = render(<Calculator initialRule={rule} />);
      const input = container.querySelector('#list-price-input') as HTMLInputElement;
      expect(input).not.toBeNull();
      expect(container.textContent).toContain(`The ${label} is figured from the price when new`);
      fireEvent.change(input, { target: { value: '40000' } });
      expect(container.querySelector('#calculator-results')?.textContent).toContain(`${label} for a $40,000.00 list price`);
      cleanup();
    }
  });

  it('the share link keeps the entered MSRP', () => {
    const inputs = { ...getDefaultInputs(co, 2026), purchasePrice: 15000, listPrice: 38000 };
    const params = buildShareSearchParams(co, 15000, inputs);
    expect(params.get('msrp')).toBe('38000');
    expect(inputsFromSearchParams(co, params, getDefaultInputs(co, 2026)).listPrice).toBe(38000);
  });
});

describe('Tax line name', () => {
  it('Indiana calls the tax on the sale a sales tax, so it cannot be read as the vehicle excise tax', () => {
    expect(calc(ind).itemizedList[0].label).toBe('Vehicle Sales Tax (7%)');
    const { container } = render(<Calculator initialRule={ind} />);
    fireEvent.change(container.querySelector('#list-price-input') as HTMLInputElement, { target: { value: '40000' } });
    const text = container.querySelector('#calculator-results')?.textContent ?? '';
    expect(text).toContain('Vehicle Sales Tax (7%)');
    expect(text).toContain('Sales Tax + Title Certificate');
    expect(text).not.toContain('Sales/Excise');
    expect(text).not.toContain('Sales / Excise');
    expect(text).toContain('Indiana vehicle excise tax');
    expect(container.textContent).toContain('Includes 7% sales tax,');
    expect(container.textContent).not.toContain('excise/sales tax');
  });

  it('other states keep the default name', () => {
    expect(calc(co).itemizedList[0].label).toContain('Vehicle Sales / Excise Tax');
    const named = Object.entries(rules).filter(([, r]) => r.taxLineName).map(([k]) => k);
    expect(named).toEqual(['indiana', 'maine']);
  });
});

describe('Copy matches the estimate', () => {
  it('Indiana and Colorado no longer say the yearly tax is left out', () => {
    expect(copy(ind)).not.toMatch(/yearly vehicle excise tax and any county or municipal vehicle tax are not included/);
    expect(copy(ind)).toContain('The estimate shows a full year of the excise tax');
    expect(copy(ind)).toContain('IC 6-6-5-7.2');
    expect(copy(co)).not.toMatch(/The specific ownership tax, county fees/);
    expect(copy(co)).toContain('The calculator includes it for passenger vehicles');
    for (const rule of [ind, co]) expect(JSON.stringify([rule.localTaxNote, rule.notes, rule.disclaimers, rule.faqs])).not.toContain('—');
  });
});
