import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn()
}));

import { Calculator } from '../src/components/Calculator';
import { calculateVehicleCosts } from '../src/lib/calculator';
import { getDefaultInputs } from '../src/lib/shareParams';
import { labelForSource } from '../src/lib/sources';
import stateRulesData from '../src/config/stateRules.json';
import { CalculatorInputs, StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const rule = (key: string) => rules[key] as StateRule;
const calc = (key: string, extra: Partial<CalculatorInputs>) =>
  calculateVehicleCosts(rule(key), { ...getDefaultInputs(rule(key), 2026), purchasePrice: 15000, registrationTerm: 1, ...extra }, 2026);
/** Text the real page component renders for the state, which leaves out rule.notes. */
const page = (key: string) => {
  const { container } = render(<Calculator initialRule={rule(key)} />);
  const text = (container.textContent ?? '').replace(/\s+/g, ' ');
  cleanup();
  return text;
};

afterEach(() => cleanup());

describe('Car EV and plug-in hybrid fee re-check, November 2026', () => {
  it.each([
    ['wyoming', 100, 50],
    ['nebraska', 150, 75],
    ['south-dakota', 100, 0],
    ['montana', 130, 70],
    ['vermont', 87, 44.5]
  ])('%s charges a car the source amount', (state, ev, phev) => {
    expect(calc(state, { fuelType: 'ev' }).evSurcharge).toBe(ev);
    expect(calc(state, { fuelType: 'phev' }).evSurcharge).toBe(phev);
    expect(calc(state, { fuelType: 'gasoline' }).evSurcharge).toBe(0);
  });

  it('Vermont matches the DMV totals for one and two years', () => {
    const total = (fuelType: CalculatorInputs['fuelType'], registrationTerm: CalculatorInputs['registrationTerm']) =>
      calc('vermont', { fuelType, registrationTerm }).registrationTotal;
    expect(total('gasoline', 1)).toBe(91);
    expect(total('gasoline', 2)).toBe(167);
    expect(total('ev', 1)).toBe(178);
    expect(total('ev', 2)).toBe(341);
    expect(total('phev', 1)).toBe(135.5);
    expect(total('phev', 2)).toBe(256);
  });

  it.each(['wyoming', 'south-dakota', 'montana', 'vermont'])('%s does not add these fees to a motorcycle', (state) => {
    expect(calc(state, { fuelType: 'ev', vehicleType: 'motorcycle' }).evSurcharge).toBe(0);
    expect(calc(state, { fuelType: 'phev', vehicleType: 'motorcycle' }).evSurcharge).toBe(0);
  });

  it.each([
    ['wyoming', '$100 for an all-electric vehicle and $50 for a plug-in hybrid'],
    ['nebraska', '$150 for an electric vehicle and $75 for a plug-in hybrid'],
    ['south-dakota', 'annual electric vehicle fee is $100'],
    ['montana', 'From 6,000 to 10,000 lbs the fees are $190 and $100'],
    ['vermont', '$178 for one year or $341 for two']
  ])('%s explains the fee on the rendered page', (state, text) => {
    expect(page(state)).toContain(text);
  });

  it('Nevada charges no EV or plug-in hybrid fee and tells buyers to confirm with the DMV', () => {
    expect(calc('nevada', { fuelType: 'ev' }).evSurcharge).toBe(0);
    expect(calc('nevada', { fuelType: 'phev' }).evSurcharge).toBe(0);
    expect(page('nevada')).toContain('Confirm any EV fee with the Nevada DMV');
  });

  it('Nevada’s fuel buttons say Not in estimate, not $0 state fee', () => {
    const { container } = render(<Calculator initialRule={rule('nevada')} />);
    const label = (name: string) => [...container.querySelectorAll('button')].find((b) => b.textContent?.startsWith(name))?.textContent?.replace(name, '');
    expect(label('Battery EV')).toBe('Not in estimate');
    expect(label('Plug-in Hybrid')).toBe('Not in estimate');
  });

  it('Mississippi keeps its base amounts and says they adjust for inflation', () => {
    expect(calc('mississippi', { fuelType: 'ev' }).evSurcharge).toBe(150);
    expect(calc('mississippi', { fuelType: 'phev' }).evSurcharge).toBe(75);
    expect(page('mississippi')).toContain('raises them each July for inflation, and the county figure may be higher');
  });

  it.each([
    ['https://wyoleg.gov/2026/Enroll/HB0145.pdf', 'wyoleg.gov: 2026 Wyo. HB 145'],
    ['https://nebraskalegislature.gov/laws/statutes.php?statute=60-3,191', 'nebraskalegislature.gov: Neb. Rev. Stat. 60-3,191'],
    ['https://sdlegislature.gov/Statutes/32-5-188', 'sdlegislature.gov: SDCL 32-5-188'],
    ['https://mca.legmt.gov/bills/mca/title_0610/chapter_0030/part_0050/section_0720/0610-0030-0050-0720.html', 'mca.legmt.gov: MCA 61-3-572'],
    ['https://legislature.vermont.gov/statutes/section/23/007/00361', 'legislature.vermont.gov: 23 V.S.A. 361']
  ])('%s is labeled by its citation', (url, label) => {
    expect(labelForSource(url)).toBe(label);
  });

  it('the form shows cents on a fee label only when the fee has them', () => {
    render(<Calculator initialRule={rule('vermont')} />);
    expect(screen.getByText('+$87/yr')).toBeTruthy();
    expect(screen.getByText('+$44.50/yr')).toBeTruthy();
  });
});
