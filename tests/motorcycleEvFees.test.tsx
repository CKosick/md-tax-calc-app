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
const moto = (key: string, fuelType: CalculatorInputs['fuelType'], registrationTerm?: CalculatorInputs['registrationTerm']) => {
  const r = rule(key);
  const defaults = getDefaultInputs(r, 2026);
  return calculateVehicleCosts(r, { ...defaults, purchasePrice: 10000, vehicleType: 'motorcycle', fuelType, registrationTerm: registrationTerm ?? defaults.registrationTerm }, 2026);
};
/** The state's motorcycle registration with no fuel fee, on its default term. */
const gasTotal = (key: string) => moto(key, 'gasoline').registrationTotal;

afterEach(() => cleanup());

const EXCLUDED_EV = ['virginia', 'texas', 'ohio', 'north-carolina', 'michigan', 'wisconsin', 'oregon', 'utah', 'montana', 'south-dakota', 'vermont', 'wyoming', 'arkansas', 'new-jersey', 'tennessee'];
const EXCLUDED_PHEV = ['ohio', 'michigan', 'wisconsin', 'utah', 'montana', 'vermont', 'wyoming', 'kansas', 'arkansas', 'tennessee'];
const SILENT_EV = ['maryland', 'california', 'illinois', 'georgia', 'missouri', 'colorado', 'minnesota', 'south-carolina', 'alabama', 'louisiana', 'mississippi', 'idaho', 'west-virginia', 'hawaii', 'new-hampshire'];
const SILENT_PHEV = ['maryland', 'missouri', 'colorado', 'minnesota', 'south-carolina', 'alabama', 'louisiana', 'mississippi', 'idaho', 'west-virginia', 'new-hampshire', 'north-dakota', 'washington'];

describe('Motorcycle EV and plug-in hybrid fees (Option D)', () => {
  it('every state with an EV or plug-in hybrid fee rules on motorcycles for each fee it has', () => {
    const feeStates = Object.keys(rules).filter((k) => rules[k].registration.evSurchargeAnnual || rules[k].registration.phevSurchargeAnnual);
    expect(feeStates).toHaveLength(38);
    for (const k of feeStates) {
      const reg = rules[k].registration;
      if (reg.evSurchargeAnnual) expect(reg.motorcycleFuelFees?.ev, `${k} EV`).toBeDefined();
      if (reg.phevSurchargeAnnual) expect(reg.motorcycleFuelFees?.phev, `${k} PHEV`).toBeDefined();
    }
  });

  it.each(EXCLUDED_EV)('%s adds no EV fee for a motorcycle', (key) => {
    expect(moto(key, 'ev').evSurcharge).toBe(0);
  });

  it.each(EXCLUDED_PHEV)('%s adds no plug-in hybrid fee for a motorcycle', (key) => {
    expect(moto(key, 'phev').evSurcharge).toBe(0);
  });

  it.each(SILENT_EV)('%s leaves the EV fee out for a motorcycle', (key) => {
    expect(rules[key].registration.motorcycleFuelFees?.ev?.outcome).toBe('silent');
    expect(moto(key, 'ev').evSurcharge).toBe(0);
    expect(moto(key, 'ev').registrationTotal).toBe(gasTotal(key));
  });

  it.each(SILENT_PHEV)('%s leaves the plug-in hybrid fee out for a motorcycle', (key) => {
    expect(rules[key].registration.motorcycleFuelFees?.phev?.outcome).toBe('silent');
    expect(moto(key, 'phev').evSurcharge).toBe(0);
  });

  it.each([
    ['washington', 'ev', 30],
    ['kentucky', 'ev', 60],
    ['kentucky', 'phev', 60],
    ['iowa', 'ev', 9],
    ['iowa', 'phev', 9],
    ['kansas', 'ev', 14],
    ['nebraska', 'ev', 75],
    ['nebraska', 'phev', 75],
    ['oklahoma', 'ev', 100],
    ['oklahoma', 'phev', 30],
    ['indiana', 'ev', 242],
    ['indiana', 'phev', 81],
    ['north-dakota', 'ev', 20],
    ['north-carolina', 'phev', 107.25]
  ] as const)('%s charges a motorcycle on %s $%d', (key, fuel, amount) => {
    expect(moto(key, fuel).evSurcharge).toBe(amount);
  });

  it('uses the base fee a state sets for an electric motorcycle', () => {
    expect(moto('south-dakota', 'gasoline').registrationTotal).toBe(18);
    expect(moto('south-dakota', 'ev').registrationTotal).toBe(24);
    expect(moto('kansas', 'gasoline').registrationTotal).toBe(16);
    expect(moto('kansas', 'ev').registrationTotal).toBe(30);
    expect(moto('kansas', 'phev').registrationTotal).toBe(16);
    expect(moto('vermont', 'gasoline', 1).registrationTotal).toBe(58);
    expect(moto('vermont', 'ev', 1).registrationTotal).toBe(56);
    expect(moto('vermont', 'ev', 2).registrationTotal).toBe(112);
    expect(moto('vermont', 'phev', 1).registrationTotal).toBe(58);
  });

  it('a two-year state keeps its term arithmetic', () => {
    expect(moto('virginia', 'ev', 2).evSurcharge).toBe(0);
    expect(moto('oregon', 'ev').registrationTotal).toBe(88);
  });

  it('cars still pay the car amounts', () => {
    const car = (key: string, fuelType: CalculatorInputs['fuelType']) => {
      const r = rule(key);
      return calculateVehicleCosts(r, { ...getDefaultInputs(r, 2026), purchasePrice: 10000, fuelType, registrationTerm: 1 }, 2026).evSurcharge;
    };
    expect(car('texas', 'ev')).toBe(200);
    expect(car('iowa', 'phev')).toBe(65);
    expect(car('nebraska', 'ev')).toBe(150);
    expect(car('maryland', 'ev')).toBe(125);
  });

  it.each([
    ['texas', 'Not charged', '$0 state fee'],
    ['ohio', 'Not charged', 'Not charged'],
    ['maryland', 'Not in estimate', 'Not in estimate'],
    ['north-carolina', 'Not charged', '+$107.25/yr'],
    ['washington', '+$30/yr', 'Not in estimate'],
    ['nebraska', '+$75/yr', '+$75/yr'],
    ['indiana', '+$242/yr', '+$81/yr'],
    ['nevada', 'Not in estimate', 'Not in estimate'],
    ['arkansas', 'Not charged', 'Not charged'],
    ['new-jersey', 'Not charged', '$0 state fee'],
    ['tennessee', 'Not charged', 'Not charged'],
    ['north-dakota', '+$20/yr', 'Not in estimate']
  ])('%s form labels for a motorcycle', (key, ev, phev) => {
    const { container } = render(<Calculator initialRule={rule(key)} />);
    fireEvent.click(screen.getByText('Motorcycle'));
    const label = (name: string) => [...container.querySelectorAll('button')].find((b) => b.textContent?.startsWith(name))?.textContent?.replace(name, '');
    expect(label('Battery EV')).toBe(ev);
    expect(label('Plug-in Hybrid')).toBe(phev);
  });

  it.each(Object.keys(rules).filter((k) => rules[k].registration.motorcycleFuelFees))('%s explains the motorcycle treatment on the page', (key) => {
    const { container } = render(<Calculator initialRule={rule(key)} />);
    expect((container.textContent ?? '').toLowerCase()).toMatch(/motorcycle/);
    const copy = rule(key).disclaimers.join(' ').toLowerCase();
    expect(copy, key).toMatch(/motorcycle/);
  });

  it('Nevada has no fee to apply to a motorcycle', () => {
    expect(rule('nevada').registration.motorcycleFuelFees).toBeUndefined();
    expect(moto('nevada', 'ev').evSurcharge).toBe(0);
  });

});
