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
const tx = rules.texas as StateRule;
const calc = (purchasePrice: number, extra: Partial<CalculatorInputs> = {}, rule: StateRule = tx) =>
  calculateVehicleCosts(rule, { ...getDefaultInputs(rule, 2026), purchasePrice, ...extra }, 2026);

afterEach(() => {
  cleanup();
  currentSearchParams = new URLSearchParams();
});

describe('Texas Standard Presumptive Value (acceptance cases)', () => {
  it('config: Texas only, 80% of SPV', () => {
    expect(tx.presumptiveValueRule).toEqual({ minShareOfValue: 0.8 });
    const others = Object.entries(rules).filter(([k, r]) => k !== 'texas' && r.presumptiveValueRule);
    expect(others).toEqual([]);
  });

  it('price below 80% of SPV: taxed on 80% of SPV ($10,000 price, $15,000 SPV -> $12,000 base)', () => {
    const b = calc(10000, { presumptiveValue: 15000 });
    expect(b.presumptiveValueApplied).toBe('presumptive');
    expect(b.exciseTax).toBe(750); // 6.25% of $12,000
    expect(b.itemizedList[0].description).toContain('80% of Standard Presumptive Value ($12,000)');
  });

  it('price above 80% of SPV: taxed on the price ($13,000 price, $15,000 SPV)', () => {
    const b = calc(13000, { presumptiveValue: 15000 });
    expect(b.presumptiveValueApplied).toBeUndefined();
    expect(b.exciseTax).toBe(812.5);
  });

  it('price exactly 80% of SPV: taxed on the price, rule not flagged', () => {
    const b = calc(12000, { presumptiveValue: 15000 });
    expect(b.presumptiveValueApplied).toBeUndefined();
    expect(b.exciseTax).toBe(750);
  });

  it('a certified appraisal above the price replaces the SPV test ($11,000 appraisal -> $11,000 base)', () => {
    const b = calc(10000, { presumptiveValue: 15000, appraisedValue: 11000 });
    expect(b.presumptiveValueApplied).toBe('appraisal');
    expect(b.exciseTax).toBe(687.5);
  });

  it('a certified appraisal below the price never lowers the tax below the price', () => {
    const b = calc(10000, { presumptiveValue: 15000, appraisedValue: 9000 });
    expect(b.presumptiveValueApplied).toBeUndefined();
    expect(b.exciseTax).toBe(625);
  });

  it('blank SPV gives the same result as today', () => {
    expect(calc(10000, { presumptiveValue: undefined })).toEqual(calc(10000));
    expect(calc(10000).exciseTax).toBe(625);
  });

  it('a $0 price (eligible gift) is not taxed on SPV', () => {
    const b = calc(0, { presumptiveValue: 15000 });
    expect(b.presumptiveValueApplied).toBeUndefined();
    expect(b.exciseTax).toBe(0);
  });

  it('other states ignore an SPV entry', () => {
    for (const [key, rule] of Object.entries(rules)) {
      if (key === 'texas') continue;
      expect(calc(10000, { presumptiveValue: 50000 }, rule)).toEqual(calc(10000, {}, rule));
    }
  });

  it('share links carry spv= and appraisal=, ignoring invalid values', () => {
    const defaults = getDefaultInputs(tx, 2026);
    const parsed = inputsFromSearchParams(tx, new URLSearchParams('price=10000&spv=15000&appraisal=11000'), defaults);
    expect(parsed.presumptiveValue).toBe(15000);
    expect(parsed.appraisedValue).toBe(11000);
    const bad = inputsFromSearchParams(tx, new URLSearchParams('price=10000&spv=-5&appraisal=abc'), defaults);
    expect(bad.presumptiveValue).toBeUndefined();
    expect(bad.appraisedValue).toBeUndefined();
  });
});

describe('Texas SPV in the calculator UI', () => {
  it('shows the SPV field on Texas only, and the appraisal field once SPV is entered', () => {
    const { container } = render(<Calculator initialRule={tx} />);
    expect(container.querySelector('#spv-input')).not.toBeNull();
    expect(container.querySelector('#appraisal-input')).toBeNull();
    fireEvent.change(container.querySelector('#spv-input')!, { target: { value: '15000' } });
    expect(container.querySelector('#appraisal-input')).not.toBeNull();
    cleanup();
    const other = render(<Calculator initialRule={rules.maryland as StateRule} />);
    expect(other.container.querySelector('#spv-input')).toBeNull();
  });

  it('explains when the tax is on SPV or on the appraisal', () => {
    const { container } = render(<Calculator initialRule={tx} />);
    const notice = () => container.querySelector('#presumptive-value-applied')?.textContent ?? '';
    fireEvent.change(container.querySelector('#purchase-price-input')!, { target: { value: '10000' } });
    fireEvent.change(container.querySelector('#spv-input')!, { target: { value: '15000' } });
    expect(notice()).toContain('Taxed on Standard Presumptive Value');
    expect(notice()).toContain('taxes $12,000.00 instead');
    expect(notice()).toContain('Form 14-128');
    fireEvent.change(container.querySelector('#appraisal-input')!, { target: { value: '11000' } });
    expect(notice()).toContain('Taxed on the certified appraisal');
    fireEvent.change(container.querySelector('#purchase-price-input')!, { target: { value: '13000' } });
    expect(container.querySelector('#presumptive-value-applied')).toBeNull();
  });

  it('a share link restores SPV, and the share button includes it', async () => {
    currentSearchParams = new URLSearchParams('price=10000&spv=15000');
    const { container, getByRole } = render(<Calculator initialRule={tx} />);
    expect((container.querySelector('#spv-input') as HTMLInputElement).value).toBe('15000');
    expect(container.querySelector('#presumptive-value-applied')).not.toBeNull();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    await act(async () => {
      fireEvent.click(getByRole('button', { name: /save or share calculation result/i }));
    });
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('spv=15000'));
  });
});
