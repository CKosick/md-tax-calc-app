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
import { getDefaultInputs } from '../src/lib/shareParams';
import { getVisibleSources } from '../src/lib/sources';
import stateRulesData from '../src/config/stateRules.json';
import sourceLinkStatus from '../src/config/sourceLinkStatus.json';
import { StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const tx = rules.texas as StateRule;
const ca = rules.california as StateRule;
const fl = rules.florida as StateRule;
const calc = (rule: StateRule) =>
  calculateVehicleCosts(rule, { ...getDefaultInputs(rule, 2026), purchasePrice: 15000, registrationTerm: 1 }, 2026);

afterEach(() => cleanup());

describe('Texas re-check (October 2026)', () => {
  it('uses the verified rate, title, registration tiers, and EV fee', () => {
    expect(tx.exciseTaxRate).toBe(0.0625);
    expect(tx.titleFee).toBe(33);
    expect(tx.registration.passenger.under3700lbs).toEqual({ '1': 51.75 }); // $50.75 + $1 TexasSure
    expect(tx.registration.passenger.over3700lbs).toEqual({ '1': 55 }); // $54 + $1 TexasSure (was $54)
    expect(tx.registration.passengerWeightSplitLbs).toBe(6000);
    expect(tx.registration.motorcycle).toEqual({ '1': 30 });
    expect(tx.registration.evSurchargeAnnual).toBe(200);
  });

  it('no longer claims an annual safety inspection, and lists the fees not included', () => {
    const text = JSON.stringify([tx.disclaimers, tx.faqs]);
    expect(text).not.toMatch(/Annual inspection/);
    expect(text).toContain('no longer requires safety inspections');
    expect(text).toContain('$7.50 inspection program replacement fee');
    expect(text).toContain('Form 14-317');
    expect(text).toContain('Form 14-128');
  });
});

describe('California re-check (October 2026)', () => {
  it('uses the $15 transfer fee, $76 + $34 registration, $121 ZEV fee, and 7.25% to 11.75%', () => {
    expect(ca.titleFee).toBe(15);
    expect(ca.registration.passenger.under3700lbs).toEqual({ '1': 110 });
    expect(ca.registration.motorcycle).toEqual({ '1': 112 });
    expect(ca.registration.evSurchargeAnnual).toBe(121);
    const b = calc(ca);
    expect(b.combinedTaxMin).toBe(1087.5); // 7.25%
    expect(b.combinedTaxMax).toBe(1762.5); // 11.75%
  });

  it('discloses the value-based fees it does not include', () => {
    expect(ca.disclaimers.join(' ')).toContain('vehicle license fee (0.65% of value)');
    expect(ca.disclaimers.join(' ')).toContain('transportation improvement fee ($33 to $231 by value)');
  });
});

describe('Florida re-check (October 2026)', () => {
  it('uses the HSMV 83140 registration amounts split at 3,500 lbs', () => {
    expect(fl.registration.passenger.under3700lbs).toEqual({ '1': 35.6, '2': 71.2 });
    expect(fl.registration.passenger.over3700lbs).toEqual({ '1': 45.6, '2': 91.2 });
    expect(fl.registration.passengerWeightSplitLbs).toBe(3499);
    expect(fl.registration.motorcycle).toEqual({ '1': 24.1, '2': 48.2 });
    expect(fl.titleFee).toBe(75.25);
    expect(fl.lienFilingFee).toBe(2);
  });

  it('states the surtax range, the $5,000 cap, the $225 fee, and the under-2,500 lb rate', () => {
    const text = JSON.stringify([fl.disclaimers, fl.faqs, fl.localTaxNote]);
    expect(text).toContain('0.5% to 2%');
    expect(text).toContain('first $5,000');
    expect(text).toContain('$225');
    expect(text).toContain('$27.60');
    expect(text).toContain('$85.25');
  });
});

describe('Weight selector shows only where the fee depends on weight', () => {
  const weightButtons = (rule: StateRule) => {
    const { container } = render(<Calculator initialRule={rule} />);
    const labels = [...container.querySelectorAll('button')].map((b) => b.textContent ?? '').filter((t) => /lbs/.test(t));
    cleanup();
    return labels;
  };

  it('California (not weight-based) has no weight buttons', () => {
    expect(weightButtons(ca)).toEqual([]);
  });

  it('Texas and Florida show their own split labels; Maryland keeps its three tiers', () => {
    expect(weightButtons(tx).join(' ')).toMatch(/≤ 6,000 lbs.*> 6,000 lbs/);
    expect(weightButtons(fl).join(' ')).toMatch(/≤ 3,499 lbs.*> 3,499 lbs/);
    expect(weightButtons(rules.maryland as StateRule)).toHaveLength(3);
  });

  it('every state that hides the selector really charges the same at every weight', () => {
    for (const rule of Object.values(rules)) {
      const p = rule.registration.passenger;
      const flat = !p.under3500lbs && JSON.stringify(p.under3700lbs) === JSON.stringify(p.over3700lbs);
      if (!flat) continue;
      const light = calculateVehicleCosts(rule, { ...getDefaultInputs(rule, 2026), weightClass: 'under3700lbs' }, 2026);
      const heavy = calculateVehicleCosts(rule, { ...getDefaultInputs(rule, 2026), weightClass: 'over3700lbs' }, 2026);
      expect(heavy.totalFirstYearCost).toBe(light.totalFirstYearCost);
    }
  });
});

describe('Texas, California, and Florida sources', () => {
  it('are verified October 2026, all sources visible, and recorded as repaired', () => {
    for (const rule of [tx, ca, fl]) {
      expect(rule.lastVerified).toBe('October 2026');
      expect(getVisibleSources(rule).map((s) => s.url)).toEqual(rule.sources);
    }
    expect(sourceLinkStatus.repaired.map((r) => r.state)).toEqual(expect.arrayContaining(['texas', 'california', 'florida']));
  });
});
