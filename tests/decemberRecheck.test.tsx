import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';

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
const rule = (key: string) => rules[key] as StateRule;
const calc = (key: string, extra: Partial<CalculatorInputs> = {}) =>
  calculateVehicleCosts(rule(key), { ...getDefaultInputs(rule(key), 2026), purchasePrice: 15000, ...extra }, 2026);
/** Text the real page component renders for the state, which leaves out rule.notes. */
const page = (key: string) => {
  const { container } = render(<Calculator initialRule={rule(key)} />);
  const text = (container.textContent ?? '').replace(/\s+/g, ' ');
  cleanup();
  return text;
};

afterEach(() => cleanup());

describe('New Mexico registration (NMSA 66-6-2, Laws 2026, chapter 4)', () => {
  it('uses the July 1, 2026 fee for a vehicle over 3,000 lbs, plus the $1.50 tire fee', () => {
    expect(calc('new-mexico', { vehicleYear: 2026 }).registrationTotal).toBe(71.5);
    expect(calc('new-mexico', { vehicleYear: 2022 }).registrationTotal).toBe(71.5);
    expect(calc('new-mexico', { vehicleYear: 2021 }).registrationTotal).toBe(57.75);
    expect(calc('new-mexico', { vehicleType: 'motorcycle' }).registrationTotal).toBe(15);
  });

  it('shows the lighter classes and no longer says $34', () => {
    const text = page('new-mexico');
    for (const fact of ['$56.25', '$48.75', '$38.75', '$33.75', '$26.25', '$1.50 tire recycling fee']) expect(text).toContain(fact);
    expect(text).not.toContain('$34');
  });

  it('electric vehicle fees for 2027', () => {
    expect(calc('new-mexico', { fuelType: 'ev' }).registrationTotal).toBe(calc('new-mexico').registrationTotal + 70);
    expect(calc('new-mexico', { fuelType: 'phev' }).registrationTotal).toBe(calc('new-mexico').registrationTotal + 35);
    expect(page('new-mexico')).toContain('The estimate includes the 2027 amount');
  });
});

describe('New Hampshire EV fee by weight (RSA 261:141-c)', () => {
  it('explains the classes on the page and keeps the $100 class in the estimate', () => {
    const text = page('new-hampshire');
    for (const fact of ['$0 up to 1,000 lbs', '$50 from 1,001 to 3,000 lbs', '$100 from 3,001 to 8,000 lbs', '$150 over 8,000 lbs', 'Plug-in hybrids stay at $50', 'The estimate uses $100']) expect(text).toContain(fact);
    expect(calc('new-hampshire', { fuelType: 'ev' }).registrationTotal).toBe(calc('new-hampshire').registrationTotal + 100);
  });
});

describe('Kansas sold vehicle wording (K.S.A. 79-3697)', () => {
  it('names a sold vehicle on the form, FAQ, and breakdown', () => {
    const text = page('kansas');
    for (const fact of ['Trade-in or Sold Vehicle Value', 'a used vehicle you sell instead of trading in', 'Can a trade-in or a vehicle I sold lower the tax']) expect(text).toContain(fact);
    expect(text).not.toContain('Can I deduct my trade-in');
  });

  it('names a sold vehicle when the credit is applied', () => {
    render(<Calculator initialRule={rule('kansas')} />);
    fireEvent.change(screen.getByLabelText(/Trade-in or Sold Vehicle Value/i), { target: { value: '5000' } });
    expect(document.body.textContent).toContain('Trade-in or Sold Vehicle Credit Applied');
  });

  it('other states keep the trade-in wording', () => {
    expect(page('missouri')).toContain('Trade-in Value');
    expect(page('missouri')).not.toContain('Sold Vehicle Value');
    expect(calc('new-mexico', { tradeInValue: 5000 }).itemizedList[0].description).toContain('$5,000 trade-in credit');
  });
});

describe('North Dakota electric motorcycles (N.D.C.C. 39-04-19.2)', () => {
  it('discloses the $20 fee and leaves it out of the estimate', () => {
    expect(page('north-dakota')).toContain('Electric motorcycles also pay a $20 road use fee');
    const moto = { vehicleType: 'motorcycle' as const };
    expect(calc('north-dakota', { ...moto, fuelType: 'ev' }).registrationTotal).toBe(20);
    expect(calc('north-dakota', { fuelType: 'ev' }).registrationTotal).toBe(calc('north-dakota').registrationTotal + 120);
  });
});
