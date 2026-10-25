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
const pa = rules.pennsylvania as StateRule;
const calc = (rule: StateRule, extra: Partial<CalculatorInputs> = {}) =>
  calculateVehicleCosts(rule, { ...getDefaultInputs(rule, 2026), purchasePrice: 15000, ...extra }, 2026);

afterEach(() => {
  cleanup();
  currentSearchParams = new URLSearchParams();
});

describe('Pennsylvania localities (seed data)', () => {
  it('three verified options, each with its PA Department of Revenue source', () => {
    expect(pa.localities?.map((l) => [l.id, l.label, l.localRate])).toEqual([
      ['rest-of-pennsylvania', 'Rest of Pennsylvania', 0],
      ['allegheny-county', 'Allegheny County', 0.01],
      ['philadelphia', 'Philadelphia', 0.02]
    ]);
    for (const l of pa.localities ?? []) {
      expect(pa.sources).toContain(l.source);
      expect(new URL(l.source).hostname).toBe('www.pa.gov');
    }
  });

  it('only Pennsylvania has localities; the many-locality states stay ranged', () => {
    const withLocalities = Object.entries(rules).filter(([, r]) => r.localities).map(([k]) => k);
    expect(withLocalities).toEqual(['pennsylvania']);
    for (const key of ['california', 'florida', 'louisiana', 'utah']) {
      expect(rules[key].localities).toBeUndefined();
      expect(calc(rules[key] as StateRule, { localityId: 'philadelphia' })).toEqual(calc(rules[key] as StateRule));
    }
  });
});

describe('Choosing a locality gives one exact total', () => {
  it('acceptance: $15,000 car in Philadelphia is taxed at exactly 8%, with no range', () => {
    const b = calc(pa, { localityId: 'philadelphia' });
    expect(b.exciseTax).toBe(1200);
    expect(b.localityTax).toBe(300);
    expect(b.localityLabel).toBe('Philadelphia');
    expect(b.hasLocalTax).toBe(false);
    expect(b.totalFirstYearCostMin).toBeUndefined();
    expect(b.totalFirstYearCostMax).toBeUndefined();
    expect(b.itemizedList[0].label).toContain('8% in Philadelphia');
    expect(b.itemizedList[0].description).toContain('Philadelphia local tax $300.00 (2%)');
    expect(b.itemizedList[0].amountRangeFormatted).toBeUndefined();
  });

  it('Allegheny County is 7%, the rest of Pennsylvania 6%', () => {
    expect(calc(pa, { localityId: 'allegheny-county' }).exciseTax).toBe(1050);
    expect(calc(pa, { localityId: 'rest-of-pennsylvania' }).exciseTax).toBe(900);
  });

  it('acceptance: no locality keeps today’s 6% to 8% range, unchanged', () => {
    const b = calc(pa);
    expect(b.exciseTax).toBe(900);
    expect(b.hasLocalTax).toBe(true);
    expect(b.combinedTaxMin).toBe(900);
    expect(b.combinedTaxMax).toBe(1200);
    expect(b).toEqual(calc(pa, { localityId: undefined }));
  });

  it('no other state’s totals change', () => {
    for (const [key, rule] of Object.entries(rules)) {
      if (key === 'pennsylvania') continue;
      expect(calc(rule as StateRule, { localityId: 'allegheny-county' })).toEqual(calc(rule as StateRule));
    }
  });
});

describe('Share links carry loc=', () => {
  const parse = (qs: string) => inputsFromSearchParams(pa, new URLSearchParams(qs), getDefaultInputs(pa, 2026));

  it('a known slug is kept; a bogus one falls back to no locality', () => {
    expect(parse('price=15000&loc=philadelphia').localityId).toBe('philadelphia');
    expect(parse('price=15000&loc=pittsburgh').localityId).toBeUndefined();
    expect(parse('price=15000&loc=').localityId).toBeUndefined();
    expect(parse('price=15000').localityId).toBeUndefined();
    const other = inputsFromSearchParams(rules.texas as StateRule, new URLSearchParams('price=15000&loc=philadelphia'), getDefaultInputs(rules.texas as StateRule, 2026));
    expect(other.localityId).toBeUndefined();
  });

  it('acceptance: a bogus loc renders the same as no locality', () => {
    currentSearchParams = new URLSearchParams('price=15000&loc=bogus');
    const bogus = render(<Calculator initialRule={pa} />).container.textContent;
    cleanup();
    currentSearchParams = new URLSearchParams('price=15000');
    const plain = render(<Calculator initialRule={pa} />).container.textContent;
    expect(bogus).toBe(plain);
  });
});

describe('The locality select', () => {
  it('shows for Pennsylvania only, defaulting to no locality', () => {
    const { container } = render(<Calculator initialRule={pa} />);
    const select = container.querySelector('#locality-select') as HTMLSelectElement;
    expect(select).not.toBeNull();
    expect(select.value).toBe('');
    expect(container.textContent).toContain('Where will the vehicle be registered?');
    cleanup();
    const tx = render(<Calculator initialRule={rules.texas as StateRule} />);
    expect(tx.container.querySelector('#locality-select')).toBeNull();
  });

  it('choosing Philadelphia collapses the range to one total and the share link carries it', async () => {
    const { container, getByRole } = render(<Calculator initialRule={pa} />);
    expect(container.textContent).toContain('–');
    fireEvent.change(container.querySelector('#locality-select')!, { target: { value: 'philadelphia' } });
    const hero = container.querySelector('.rounded-2xl.bg-gradient-to-br');
    expect(hero?.textContent).not.toContain('–');
    expect(container.textContent).toContain('8% in Philadelphia');
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    await act(async () => {
      fireEvent.click(getByRole('button', { name: /save or share calculation result/i }));
    });
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('loc=philadelphia'));
  });
});
