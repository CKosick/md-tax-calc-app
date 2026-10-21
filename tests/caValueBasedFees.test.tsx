import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn()
}));

import { Calculator } from '../src/components/Calculator';
import { calculateVehicleCosts } from '../src/lib/calculator';
import { getDefaultInputs } from '../src/lib/shareParams';
import stateRulesData from '../src/config/stateRules.json';
import { CalculatorInputs, StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const ca = rules.california as StateRule;
const calc = (purchasePrice: number, overrides: Partial<CalculatorInputs> = {}, rule: StateRule = ca) =>
  calculateVehicleCosts(rule, { ...getDefaultInputs(rule, 2026), purchasePrice, ...overrides }, 2026);

afterEach(() => cleanup());

describe('California value-based registration fees (acceptance cases)', () => {
  it('config: 0.65% vehicle license fee and the five DMV transportation improvement tiers', () => {
    expect(ca.registration.valueBasedFees).toEqual({
      licenseFeeRate: 0.0065,
      improvementFeeTiers: [
        { minValue: 0, fee: 33 },
        { minValue: 5000, fee: 66 },
        { minValue: 25000, fee: 132 },
        { minValue: 35000, fee: 198 },
        { minValue: 60000, fee: 231 }
      ]
    });
  });

  it.each([
    // price, VLF, TIF, registration ($110 + VLF + TIF), total (7.25% tax + $15 transfer + registration)
    [4000, 26, 33, 169, 474],
    [15000, 97.5, 66, 273.5, 1376],
    [25000, 162.5, 132, 404.5, 2232],
    [40000, 260, 198, 568, 3483],
    [60000, 390, 231, 731, 5096]
  ])('$%i car: VLF $%d, TIF $%d, registration $%d, total $%d', (price, vlf, tif, registration, total) => {
    const b = calc(price);
    expect(b.vehicleLicenseFee).toBe(vlf);
    expect(b.transportationImprovementFee).toBe(tif);
    expect(b.registrationTotal).toBe(registration);
    expect(b.totalFirstYearCost).toBe(total);
  });

  it.each([
    [4999, 33],
    [5000, 66],
    [24999, 66],
    [25000, 132],
    [34999, 132],
    [35000, 198],
    [59999, 198],
    [60000, 231]
  ])('tier boundary: $%i -> $%i', (price, tif) => {
    expect(calc(price).transportationImprovementFee).toBe(tif);
  });

  it('VLF rounds to cents', () => {
    expect(calc(12345).vehicleLicenseFee).toBe(80.24); // 12,345 x 0.65% = 80.2425
  });

  it('zero-emission vehicles add the $121 road improvement fee on top', () => {
    const b = calc(15000, { fuelType: 'ev' });
    expect(b.evSurcharge).toBe(121);
    expect(b.registrationTotal).toBe(394.5);
  });

  it('applies to motorcycles too ($112 base)', () => {
    const b = calc(8000, { vehicleType: 'motorcycle' });
    expect(b.registrationTotal).toBe(112 + 52 + 66);
  });

  it('a $0 price (gift, new resident) adds no value-based fees', () => {
    const b = calc(0);
    expect(b.vehicleLicenseFee).toBe(0);
    expect(b.transportationImprovementFee).toBe(0);
    expect(b.registrationTotal).toBe(110);
  });

  it('the registration line explains the breakdown', () => {
    const line = calc(15000).itemizedList.find((i) => i.id === 'registration-fee');
    expect(line?.description).toBe(
      'Base tag fee ($110.00) + vehicle license fee ($97.50, 0.65% of price) + transportation improvement fee ($66.00)'
    );
  });

  it('no other state changes', () => {
    for (const [key, rule] of Object.entries(rules)) {
      if (key === 'california') continue;
      expect(rule.registration.valueBasedFees).toBeUndefined();
      const b = calc(15000, {}, rule);
      expect(b.vehicleLicenseFee).toBe(0);
      expect(b.transportationImprovementFee).toBe(0);
    }
  });

  it('the California calculator page shows the estimate and updates with the price', () => {
    const { container } = render(<Calculator initialRule={ca} />);
    const results = () => container.querySelector('#calculator-results')?.textContent ?? '';
    expect(results()).toContain('$273.50');
    fireEvent.change(container.querySelector('#purchase-price-input')!, { target: { value: '40000' } });
    expect(results()).toContain('$568.00');
    expect(results()).toContain('+ $260.00 vehicle license fee (0.65% of price)');
    expect(results()).toContain('+ $198.00 transportation improvement fee');
  });
});
