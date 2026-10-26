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
const ny = rules['new-york'] as StateRule;
const il = rules.illinois as StateRule;
const oh = rules.ohio as StateRule;
const calc = (rule: StateRule, extra: Partial<CalculatorInputs> = {}) =>
  calculateVehicleCosts(rule, { ...getDefaultInputs(rule, 2026), purchasePrice: 15000, ...extra }, 2026);

afterEach(() => {
  cleanup();
  currentSearchParams = new URLSearchParams();
});

describe('New York registration by weight (DMV 2-year fee chart)', () => {
  it('looks up the entered weight on the chart', () => {
    expect(calc(ny, { vehicleWeight: 3400 }).registrationTotal).toBe(55); // 3,351 to 3,450 lbs
    expect(calc(ny, { vehicleWeight: 3550 }).registrationTotal).toBe(56.5); // top of 3,451 to 3,550
    expect(calc(ny, { vehicleWeight: 3551 }).registrationTotal).toBe(59); // 3,551 to 3,650
    expect(calc(ny, { vehicleWeight: 4000 }).registrationTotal).toBe(69); // 3,951 to 4,050
    expect(calc(ny, { vehicleWeight: 1500 }).registrationTotal).toBe(26); // 1,650 lbs or less
    expect(calc(ny, { vehicleWeight: 7200 }).registrationTotal).toBe(140); // 6,951 lbs or more
  });

  it('a blank weight uses the 3,500 lb default ($56.50)', () => {
    expect(calc(ny).registrationTotal).toBe(56.5);
    expect(calc(ny).totalFirstYearCost).toBe(706.5);
  });

  it('motorcycles are $17.50 a year ($35 for the 2-year term shown)', () => {
    expect(ny.registration.motorcycle).toEqual({ '1': 17.5 });
    expect(calc(ny, { vehicleType: 'motorcycle' }).registrationTotal).toBe(35);
  });

  it('only New York and Arkansas use a weight chart', () => {
    const others = Object.entries(rules).filter(([k, r]) => !['new-york', 'arkansas'].includes(k) && r.registration.passengerWeightChart);
    expect(others).toEqual([]);
  });

  it('share links carry lbs= for New York only, ignoring invalid values', () => {
    const parsed = inputsFromSearchParams(ny, new URLSearchParams('price=15000&lbs=4000'), getDefaultInputs(ny, 2026));
    expect(parsed.vehicleWeight).toBe(4000);
    const bad = inputsFromSearchParams(ny, new URLSearchParams('price=15000&lbs=-1'), getDefaultInputs(ny, 2026));
    expect(bad.vehicleWeight).toBeUndefined();
    const other = inputsFromSearchParams(oh, new URLSearchParams('price=15000&lbs=4000'), getDefaultInputs(oh, 2026));
    expect(other.vehicleWeight).toBeUndefined();
  });
});

describe('Weight labels (repair batch check)', () => {
  it('New York asks for the weight in lbs instead of weight classes', () => {
    const { container } = render(<Calculator initialRule={ny} />);
    expect(container.querySelector('#vehicle-weight-input')).not.toBeNull();
    expect(container.querySelector('#weight-under-3700')).toBeNull();
    expect(container.querySelector('#weight-over-3700')).toBeNull();
    expect(container.textContent).toContain('Blank uses 3,500 lbs.');
    expect(container.textContent).toContain('Base license plates & tags for 3,500 lbs');
    fireEvent.change(container.querySelector('#vehicle-weight-input')!, { target: { value: '4000' } });
    expect(container.textContent).toContain('Base license plates & tags for 4,000 lbs');
    expect(container.textContent).toContain('$69.00');
  });

  it('Illinois and Ohio fees do not vary by weight, so no weight question is shown', () => {
    for (const rule of [il, oh]) {
      const { container } = render(<Calculator initialRule={rule} />);
      expect(container.querySelector('#vehicle-weight-input')).toBeNull();
      expect(container.querySelector('#weight-under-3700')).toBeNull();
      expect(container.querySelector('#weight-over-3700')).toBeNull();
      cleanup();
    }
  });

  it('the share button includes lbs= once a New York weight is entered', async () => {
    const { container, getByRole } = render(<Calculator initialRule={ny} />);
    fireEvent.change(container.querySelector('#vehicle-weight-input')!, { target: { value: '4000' } });
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    await act(async () => {
      fireEvent.click(getByRole('button', { name: /save \/ share result/i }));
    });
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('lbs=4000'));
  });
});

describe('Illinois RUT-50 re-check', () => {
  it('motorcycles pay the flat $25 instead of Tables A and B', () => {
    const b = calc(il, { vehicleType: 'motorcycle' });
    expect(b.exciseTax).toBe(25);
    expect(b.itemizedList[0].description).toContain('flat tax for motorcycles');
    expect(calc(il, { vehicleType: 'motorcycle', purchasePrice: 0 }).exciseTax).toBe(0);
    expect(calc(il, { vehicleType: 'motorcycle', purchasePrice: 60000 }).exciseTax).toBe(25);
  });

  it('passenger vehicles still use Table B at $15,000 ($850)', () => {
    expect(calc(il).exciseTax).toBe(850);
  });

  it('the Chicago and Cook County note gives the age-based amounts, not a flat $15', () => {
    expect(il.localTaxNote).not.toContain('additional $15');
    expect(il.localTaxNote).toContain('Chicago $50 to $80');
    expect(il.localTaxNote).toContain('Cook County $90 to $225');
  });
});

describe('Ohio re-check', () => {
  it('uses the 2026 BMV and R.C. 4505.09 fees', () => {
    expect(oh.titleFee).toBe(18);
    expect(oh.lienFilingFee).toBe(0);
    expect(calc(oh).registrationTotal).toBe(36);
    expect(calc(oh, { vehicleType: 'motorcycle' }).registrationTotal).toBe(30);
    expect(calc(oh, { fuelType: 'ev' }).registrationTotal).toBe(236);
    expect(calc(oh, { fuelType: 'phev' }).registrationTotal).toBe(186);
  });

  it('county rates run 6.50% to 8.25% combined', () => {
    expect(oh.localTaxMinRate).toBe(0.0075);
    expect(oh.localTaxMaxRate).toBe(0.025);
    const b = calc(oh);
    expect(b.combinedTaxMin).toBe(975); // 6.50% of $15,000
    expect(b.combinedTaxMax).toBe(1237.5); // 8.25% of $15,000
  });
});

describe('Batch 4 states are verified for October 2026', () => {
  it('no generic FAQs, no em dashes, October 2026', () => {
    for (const rule of [ny, il, oh]) {
      expect(rule.lastVerified).toBe('October 2026');
      const text = JSON.stringify([rule.faqs, rule.notes, rule.disclaimers, rule.localTaxNote]);
      expect(text).not.toMatch(/vary significantly by state|vary by jurisdiction|reciprocal tax credit/i);
      expect(text).not.toContain('—');
    }
  });
});
