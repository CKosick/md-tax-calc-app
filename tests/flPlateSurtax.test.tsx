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
const fl = rules.florida as StateRule;
// 1-year term so the registration line is $35.60 (Florida defaults to 2 years)
const calc = (purchasePrice: number, extra: Partial<CalculatorInputs> = {}, rule: StateRule = fl) =>
  calculateVehicleCosts(rule, { ...getDefaultInputs(rule, 2026), registrationTerm: 1, purchasePrice, ...extra }, 2026);

afterEach(() => {
  cleanup();
  currentSearchParams = new URLSearchParams();
});

describe('Florida plate to transfer', () => {
  it('No (the default): adds the $225 initial registration fee and $28 plate as their own lines', () => {
    const b = calc(15000);
    expect(b.initialRegistrationFee).toBe(225);
    expect(b.newPlateFee).toBe(28);
    expect(b.registrationTotal).toBe(35.6); // the base registration line is unchanged
    expect(b.totalFirstYearCost).toBe(1263.85);
    const ids = b.itemizedList.map((i) => i.id);
    expect(ids).toContain('initial-registration-fee');
    expect(ids).toContain('new-plate-fee');
  });

  it('Yes: neither fee', () => {
    const b = calc(15000, { hasPlateToTransfer: true });
    expect(b.initialRegistrationFee).toBe(0);
    expect(b.newPlateFee).toBe(0);
    expect(b.totalFirstYearCost).toBe(1010.85);
    const ids = b.itemizedList.map((i) => i.id);
    expect(ids).not.toContain('initial-registration-fee');
    expect(ids).not.toContain('new-plate-fee');
  });

  it('acceptance: $15,000 car, surtax on $5,000, and Yes drops the total by exactly $253', () => {
    const no = calc(15000);
    const yes = calc(15000, { hasPlateToTransfer: true });
    // Surtax is figured on the first $5,000 only: 0% to 2% of $5,000
    expect(no.localTaxMin).toBe(0);
    expect(no.localTaxMax).toBe(5000 * 0.02);
    expect(no.totalFirstYearCost - yes.totalFirstYearCost).toBeCloseTo(253, 2);
    expect((no.totalFirstYearCostMin ?? 0) - (yes.totalFirstYearCostMin ?? 0)).toBeCloseTo(253, 2);
    expect((no.totalFirstYearCostMax ?? 0) - (yes.totalFirstYearCostMax ?? 0)).toBeCloseTo(253, 2);
  });

  it('only Florida and Washington have the question; other states are unchanged by the answer', () => {
    const others = Object.entries(rules).filter(([k, r]) => !['florida', 'washington'].includes(k) && r.registration.newPlateFees);
    expect(others).toEqual([]);
    for (const [key, rule] of Object.entries(rules)) {
      if (key === 'florida' || key === 'washington') continue;
      const b = calc(15000, {}, rule);
      expect(calc(15000, { hasPlateToTransfer: true }, rule)).toEqual(b);
      expect(b.initialRegistrationFee).toBeUndefined();
      expect(b.newPlateFee).toBeUndefined();
    }
  });

  it('the form asks, defaults to No, and the card lines follow the answer', () => {
    const { container } = render(<Calculator initialRule={fl} />);
    expect(container.textContent).toContain('Do you have a Florida license plate to transfer?');
    expect(container.querySelector('#plate-transfer-no')?.getAttribute('aria-pressed')).toBe('true');
    expect(container.querySelector('#initial-registration-fee')?.textContent).toContain('$225.00');
    expect(container.querySelector('#new-plate-fee')?.textContent).toContain('$28.00');
    fireEvent.click(container.querySelector('#plate-transfer-yes')!);
    expect(container.querySelector('#initial-registration-fee')).toBeNull();
    expect(container.querySelector('#new-plate-fee')).toBeNull();
    fireEvent.click(container.querySelector('#plate-transfer-no')!);
    expect(container.querySelector('#initial-registration-fee')).not.toBeNull();
  });

  it('other states do not show the question', () => {
    const { container } = render(<Calculator initialRule={rules.maryland as StateRule} />);
    expect(container.querySelector('#plate-transfer-no')).toBeNull();
    expect(container.querySelector('#initial-registration-fee')).toBeNull();
  });

  it('share links carry plate=yes, and a link without it means No', async () => {
    const defaults = getDefaultInputs(fl, 2026);
    expect(inputsFromSearchParams(fl, new URLSearchParams('price=15000&plate=yes'), defaults).hasPlateToTransfer).toBe(true);
    expect(inputsFromSearchParams(fl, new URLSearchParams('price=15000'), defaults).hasPlateToTransfer).toBe(false);
    // Invalid values fall back to the default (No)
    for (const bad of ['true', 'YES', '1', 'maybe']) {
      expect(inputsFromSearchParams(fl, new URLSearchParams(`price=15000&plate=${bad}`), defaults).hasPlateToTransfer).toBe(false);
    }

    const { container, getByRole } = render(<Calculator initialRule={fl} />);
    fireEvent.click(container.querySelector('#plate-transfer-yes')!);
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    await act(async () => {
      fireEvent.click(getByRole('button', { name: /save \/ share result/i }));
    });
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('plate=yes'));
  });
});

describe('Florida county surtax on the first $5,000 only', () => {
  it('config: none to 2%, capped at $5,000; only Florida, Arkansas, and Tennessee have a cap', () => {
    expect(fl.localTaxMinRate).toBe(0);
    expect(fl.localTaxMaxRate).toBe(0.02);
    expect(fl.localTaxBaseCap).toBe(5000);
    const others = Object.entries(rules).filter(([k, r]) => !['florida', 'arkansas', 'tennessee'].includes(k) && r.localTaxBaseCap !== undefined);
    expect(others).toEqual([]);
  });

  it('above $5,000 the surtax stops growing ($15,000 and $40,000 both top out at $100)', () => {
    for (const price of [15000, 40000]) {
      const b = calc(price);
      expect(b.localTaxMin).toBe(0);
      expect(b.localTaxMax).toBe(100);
      expect(b.combinedTaxMax).toBe(price * 0.06 + 100);
      expect(b.itemizedList[0].description).toContain('on the first $5,000.00');
    }
  });

  it('at or below $5,000 the surtax applies to the whole price', () => {
    const b = calc(4000);
    expect(b.localTaxMax).toBe(80);
    expect(b.itemizedList[0].description).not.toContain('on the first');
  });

  it('a $0 price (gift) has no surtax range', () => {
    const b = calc(0);
    expect(b.hasLocalTax).toBe(false);
    expect(b.totalFirstYearCost).toBe(363.85);
  });
});
