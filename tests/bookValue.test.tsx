import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';

let currentSearchParams = new URLSearchParams();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => currentSearchParams,
  notFound: vi.fn()
}));

import { Calculator } from '../src/components/Calculator';
import { calculateVehicleCosts } from '../src/lib/calculator';
import { getDefaultInputs, inputsFromSearchParams, parseBookValue } from '../src/lib/shareParams';
import stateRulesData from '../src/config/stateRules.json';
import { CalculatorInputs, StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const md = rules.maryland as StateRule;
const va = Object.values(rules).find((r) => r.label === 'Virginia') as StateRule;

const mdInputs = (purchasePrice: number, vehicleYear: number, bookValue?: number): CalculatorInputs => ({
  ...getDefaultInputs(md, 2026),
  purchasePrice,
  vehicleYear,
  bookValue
});
const calc = (inputs: CalculatorInputs, rule: StateRule = md) => calculateVehicleCosts(rule, inputs, 2026);
const taxBase = (b: ReturnType<typeof calc>) => Math.round((b.exciseTax / md.exciseTaxRate) * 100) / 100;

describe('Maryland book value rule (engine)', () => {
  it('config: only Maryland has the rule, under 7 years and $500 below book', () => {
    expect(md.bookValueAssessment).toEqual({ maxVehicleAge: 7, priceBelowBookThreshold: 500 });
    const others = Object.values(rules).filter((r) => r.bookValueAssessment && r !== md);
    expect(others).toEqual([]);
  });

  it('acceptance: 2024, $10,000 price, $12,000 book: taxed on $12,000', () => {
    const b = calc(mdInputs(10000, 2024, 12000));
    expect(b.bookValueApplied).toBe(true);
    expect(taxBase(b)).toBe(12000);
    expect(b.exciseTax).toBe(780);
    expect(b.itemizedList[0].description).toContain('book value of $12,000');
  });

  it('acceptance: 2024, $11,600 price, $12,000 book: within $500, taxed on $11,600', () => {
    const b = calc(mdInputs(11600, 2024, 12000));
    expect(b.bookValueApplied).toBe(false);
    expect(taxBase(b)).toBe(11600);
  });

  it('acceptance: 2018, $500 price, $9,000 book: 7+ years, $640 floor, book ignored', () => {
    const b = calc(mdInputs(500, 2018, 9000));
    expect(b.bookValueApplied).toBe(false);
    expect(b.minTaxApplied).toBe(true);
    expect(taxBase(b)).toBe(640);
    expect(b.itemizedList[0].description).not.toMatch(/book value/i);
  });

  it('acceptance: blank book value gives totals identical to today', () => {
    for (const [price, year] of [[15000, 2019], [10000, 2024], [500, 2018], [0, 2024], [42000, 2026]]) {
      const withField = calc(mdInputs(price, year, undefined));
      const { bookValue: _omit, ...withoutKey } = mdInputs(price, year);
      void _omit;
      const today = calc(withoutKey as CalculatorInputs);
      expect(withField.totalFirstYearCost).toBe(today.totalFirstYearCost);
      expect(withField.exciseTax).toBe(today.exciseTax);
      expect(withField.itemizedList).toEqual(today.itemizedList);
    }
  });

  it('boundaries: exactly $500 below stays on price, $501 below uses book', () => {
    expect(calc(mdInputs(11500, 2024, 12000)).bookValueApplied).toBe(false);
    expect(calc(mdInputs(11499, 2024, 12000)).bookValueApplied).toBe(true);
  });

  it('age boundary: 6 years old can use book value, 7 years old cannot', () => {
    expect(calc(mdInputs(5000, 2020, 12000)).bookValueApplied).toBe(true);
    expect(calc(mdInputs(5000, 2019, 12000)).bookValueApplied).toBe(false);
  });

  it('price above book, or invalid book values, stay on the price', () => {
    for (const bookValue of [9000, 0, -100, Number.NaN]) {
      const b = calc(mdInputs(10000, 2024, bookValue));
      expect(b.bookValueApplied).toBe(false);
      expect(taxBase(b)).toBe(10000);
    }
  });

  it('other states are unaffected by a book value', () => {
    const inputs = { ...getDefaultInputs(va, 2026), purchasePrice: 10000, vehicleYear: 2024 };
    expect(calc({ ...inputs, bookValue: 30000 }, va)).toEqual(calc(inputs, va));
  });
});

describe('Book value in share links', () => {
  it('parses positive numbers and ignores invalid, negative, zero, or blank values', () => {
    expect(parseBookValue('12000')).toBe(12000);
    for (const v of ['-5', '0', 'abc', '', '  ', 'Infinity', null]) {
      expect(parseBookValue(v)).toBeUndefined();
    }
  });

  it('reads ?book= and treats an invalid one as blank', () => {
    const defaults = getDefaultInputs(md, 2026);
    expect(inputsFromSearchParams(md, new URLSearchParams('price=10000&book=12000'), defaults).bookValue).toBe(12000);
    expect(inputsFromSearchParams(md, new URLSearchParams('price=10000&book=-1'), defaults).bookValue).toBeUndefined();
  });
});

describe('Maryland calculator UI', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-16T12:00:00'));
    currentSearchParams = new URLSearchParams();
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  const set = (id: string, value: string) => fireEvent.change(document.getElementById(id)!, { target: { value } });

  it('shows the optional field on Maryland only', () => {
    render(<Calculator initialRule={md} />);
    expect(screen.getByLabelText(/Book Value \(NADA Retail\)/i)).toBeDefined();
    cleanup();
    render(<Calculator initialRule={va} />);
    expect(screen.queryByLabelText(/Book Value \(NADA Retail\)/i)).toBeNull();
  });

  it('explains when the tax is on book value, and shows the regular warning otherwise', () => {
    render(<Calculator initialRule={md} />);
    set('model-year-input', '2024');
    set('purchase-price-input', '10000');
    expect(document.getElementById('book-value-applied')).toBeNull();

    set('book-value-input', '12000');
    const box = document.getElementById('book-value-applied');
    expect(box?.textContent).toContain('Taxed on book value');
    expect(box?.textContent).toContain('more than $500 below NADA retail');
    expect(box?.textContent).toContain('may assess');
    expect(document.getElementById('calculator-results')?.textContent).toContain('$780.00');

    set('purchase-price-input', '11600');
    expect(document.getElementById('book-value-applied')).toBeNull();
  });

  it('7+ year old vehicles: help text says the field is not used and nothing implies it was', () => {
    render(<Calculator initialRule={md} />);
    set('model-year-input', '2018');
    set('purchase-price-input', '500');
    set('book-value-input', '9000');
    expect(document.getElementById('book-value-help')?.textContent).toMatch(/Not used for vehicles 7 or more years old/);
    expect(document.getElementById('book-value-applied')).toBeNull();
    expect(document.getElementById('calculator-results')?.textContent).not.toMatch(/Taxed on book value/);
  });

  it('a share link with ?book= restores it, and the share button includes it', async () => {
    currentSearchParams = new URLSearchParams('price=10000&year=2024&book=12000');
    render(<Calculator initialRule={md} />);
    expect(screen.getByDisplayValue('12000')).toBeDefined();
    expect(document.getElementById('book-value-applied')).not.toBeNull();

    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /save or share calculation result/i }));
    });
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('book=12000'));
  });
});

describe('Maryland copy matches the under-7 rule (no notarized bill of sale)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-16T12:00:00'));
    currentSearchParams = new URLSearchParams();
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  const set = (id: string, value: string) => fireEvent.change(document.getElementById(id)!, { target: { value } });
  const ageLabel = () => document.querySelector('label[for="model-year-input"]')?.nextElementSibling?.textContent ?? '';
  const resultsText = () => document.getElementById('calculator-results')?.textContent ?? '';

  it('engine flag: a 7-year-old Maryland car is outside the book value window; Virginia uses its under-5 rule', () => {
    expect(calc(mdInputs(15000, 2019)).bookValueApplies).toBe(false);
    expect(calc(mdInputs(15000, 2020)).bookValueApplies).toBe(true);
    const vaInputs = (vehicleYear: number) => ({ ...getDefaultInputs(va, 2026), purchasePrice: 15000, vehicleYear });
    expect(calc(vaInputs(2022), va).bookValueApplies).toBe(true); // 4 years old
    expect(calc(vaInputs(2021), va).bookValueApplies).toBe(false); // 5 years old
  });

  it('config copy: no notarized bill of sale, no "7 years old or newer", under-7 wording present', () => {
    const allText = JSON.stringify(md);
    expect(allText).not.toMatch(/notari|VR-181|7 years old or newer|whichever is higher/i);
    expect(md.disclaimers.join(' ')).toContain('Vehicles under 7 years old may be assessed on book value');
    expect(md.disclaimers.join(' ')).toContain('Documentation of the lower sale price can support taxing it on your price.');
    expect(md.faqs.map((f) => f.answer).join(' ')).toContain('more than $500 below the NADA retail book value');
  });

  it('7-year-old car: label says 7+, no book value warning in results', () => {
    render(<Calculator initialRule={md} />);
    set('model-year-input', '2019');
    expect(ageLabel()).toContain('(7+ yrs)');
    expect(resultsText()).not.toMatch(/Book Value Assessment Rule/);
  });

  it('6-year-old car: label and warning use the under-7 rule and documentation wording', () => {
    render(<Calculator initialRule={md} />);
    set('model-year-input', '2020');
    expect(ageLabel()).toContain('(under 7 yrs rule)');
    const text = resultsText();
    expect(text).toContain('Book Value Assessment Rule (Under 7 Years Old)');
    expect(text).toContain('Because this vehicle is under 7 years old');
    expect(text).toContain('more than $500 below it');
    expect(text).toContain('Documentation of the lower sale price can support taxing it on your price.');
    expect(text).not.toMatch(/notari/i);
    expect(document.body.textContent).not.toMatch(/notari|7 years old or newer/i);
  });
});
