import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn()
}));

import { Calculator } from '../src/components/Calculator';
import { calculateVehicleCosts } from '../src/lib/calculator';
import { labelForSource } from '../src/lib/sources';
import { getDefaultInputs } from '../src/lib/shareParams';
import stateRulesData from '../src/config/stateRules.json';
import { CalculatorInputs, StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const rule = (key: string) => rules[key] as StateRule;
const calc = (key: string, extra: Partial<CalculatorInputs> = {}) =>
  calculateVehicleCosts(rule(key), { ...getDefaultInputs(rule(key), 2026), purchasePrice: 15000, ...extra }, 2026);
/** Text the real page component renders for the state, which leaves out rule.notes. */
const rendered = (key: string) => {
  const { container } = render(<Calculator initialRule={rule(key)} />);
  const text = (container.textContent ?? '').replace(/\s+/g, ' ');
  cleanup();
  return text;
};

afterEach(() => cleanup());

describe('Plug-in hybrid fees (RSA 261:141-c, N.D.C.C. 39-04-19.2)', () => {
  it('adds $50 for a plug-in hybrid and leaves gas vehicles alone', () => {
    for (const key of ['new-hampshire', 'north-dakota']) {
      const gas = calc(key).registrationTotal;
      expect(calc(key, { fuelType: 'phev' }).registrationTotal).toBe(gas + 50);
    }
    expect(calc('new-hampshire', { fuelType: 'ev' }).registrationTotal).toBe(calc('new-hampshire').registrationTotal + 100);
    expect(calc('north-dakota', { fuelType: 'ev' }).registrationTotal).toBe(calc('north-dakota').registrationTotal + 120);
  });

  it('the form no longer says the fee is $0', () => {
    for (const key of ['new-hampshire', 'north-dakota']) {
      const { container } = render(<Calculator initialRule={rule(key)} />);
      expect(container.textContent).toContain('+$50/yr');
      cleanup();
    }
  });
});

describe('Facts moved out of notes are on the rendered page', () => {
  const moved: [string, string][] = [
    ['indiana', 'can change the amount due (IC 6-6-5-7.2)'],
    ['indiana', '$26.35 plus the $15 fee'],
    ['alabama', 'Licensing officials may also add small commissions'],
    ['california', 'district taxes add up to 4.50%'],
    ['colorado', 'figured at 3,500 lbs'],
    ['colorado', '$19.30 road safety surcharge'],
    ['colorado', '$26 ($13 for plug-in hybrids)'],
    ['district-of-columbia', '3,499 lbs or less with 21 to 25 city MPG'],
    ['florida', 'A paper title is $77.75'],
    ['georgia', 'only if they choose the alternative fuel plate'],
    ['kansas', 'within 120 days before or after the sale'],
    ['maine', '24, 17.5, 13.5, 10, 6.5, then 4 mills'],
    ['massachusetts', '90% in the model year'],
    ['massachusetts', 'shown here as $40 for the two-year view'],
    ['nebraska', 'ends after the 13th year'],
    ['nevada', 'the minimum tax is $16'],
    ['new-hampshire', 'which has a $5 minimum'],
    ['new-hampshire', '3,001 to 5,000 lbs'],
    ['new-mexico', 'shipping weight over 3,000 lbs'],
    ['oregon', 'new plate fees ($26)'],
    ['south-carolina', '$36 instead of $40 at age 65'],
    ['virginia', '$3 less online'],
    ['washington', 'Other hybrids pay $75']
  ];

  it.each(moved)('%s shows "%s"', (key, text) => {
    expect(rendered(key)).toContain(text);
  });

  it('the moved text is no longer in that state’s notes', () => {
    for (const [key, text] of moved) {
      if (key === 'colorado' && text.startsWith('$19.30')) continue; // the fee breakdown stays as research
      expect(rule(key).notes.join(' ')).not.toContain(text);
    }
  });

  it('adds no em dash in the moved text', () => {
    for (const [key, text] of moved) {
      const line = rule(key).disclaimers.find((d) => d.includes(text));
      expect(line, `${key}: ${text}`).toBeDefined();
      expect(line).not.toContain('—');
    }
  });
});

describe('Corrections', () => {
  it('Kansas cites K.S.A. 79-3697 and 120 days, with no 180-day or 79-3602 claim', () => {
    const k = rule('kansas');
    const all = JSON.stringify([k.notes, k.disclaimers, k.faqs]);
    expect(all).not.toContain('120/180');
    expect(all).not.toContain('79-3602');
    expect(k.faqs.some((f) => f.answer.includes('K.S.A. 79-3697'))).toBe(true);
    expect(labelForSource('https://ksrevisor.gov/statutes/chapters/ch79/079_036_0097.html')).toBe('ksrevisor.gov: K.S.A. 79-3697');
  });

  it('Alaska no longer limits the $100 fee to under 4,000 lbs, which the DMV chart does not', () => {
    expect(JSON.stringify(rule('alaska'))).not.toContain('under 4,000 lbs');
  });

  it('North Dakota’s statute source has a readable label', () => {
    expect(labelForSource('https://ndlegis.gov/cencode/t39c04.pdf')).toBe('ndlegis.gov: N.D.C.C. Chapter 39-04');
  });
});
