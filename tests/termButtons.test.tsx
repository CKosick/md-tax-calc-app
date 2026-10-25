import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';

let currentSearchParams = new URLSearchParams();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => currentSearchParams,
  notFound: vi.fn()
}));

import { Calculator } from '../src/components/Calculator';
import { getDefaultInputs, getDefaultTerm, getOfferedTerms, inputsFromSearchParams } from '../src/lib/shareParams';
import stateRulesData from '../src/config/stateRules.json';
import { StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const termButtons = (container: HTMLElement) =>
  [1, 2, 3].filter((t) => container.querySelector(`button#term-${t}-year`)).map(Number);
const termOption = (container: HTMLElement) =>
  [1, 2, 3].filter((t) => container.querySelector(`#term-${t}-year`)).map(Number);

afterEach(() => {
  cleanup();
  currentSearchParams = new URLSearchParams();
});

describe('Registration term options follow each state’s config', () => {
  it('every state shows exactly the terms it offers', () => {
    for (const [key, rule] of Object.entries(rules)) {
      const offered = getOfferedTerms(rule as StateRule);
      expect(offered.length).toBeGreaterThan(0);
      const { container } = render(<Calculator initialRule={rule as StateRule} />);
      expect(termOption(container), key).toEqual(offered);
      // One term is shown as the only option, not a toggle
      expect(termButtons(container), key).toEqual(offered.length > 1 ? offered : []);
      cleanup();
    }
  });

  it('1 and 2 years (Maryland): two buttons, 2-year by default, 1-year selectable', () => {
    const md = rules.maryland as StateRule;
    expect(getOfferedTerms(md)).toEqual([1, 2]);
    const { container } = render(<Calculator initialRule={md} />);
    expect(termButtons(container)).toEqual([1, 2]);
    fireEvent.click(container.querySelector('#term-1-year')!);
    expect(container.querySelector('#term-1-year')?.className).toContain('text-indigo-600');
  });

  it('1 year only (Texas): no 2-year option', () => {
    const tx = rules.texas as StateRule;
    const { container } = render(<Calculator initialRule={tx} />);
    expect(container.querySelector('#term-2-year')).toBeNull();
    expect(container.querySelector('#term-1-year')?.textContent).toContain('Texas registers for one year');
    expect(getDefaultTerm(tx)).toBe(1);
  });

  it('2 years only (New York): no 1-year option', () => {
    const ny = rules['new-york'] as StateRule;
    const { container } = render(<Calculator initialRule={ny} />);
    expect(container.querySelector('#term-1-year')).toBeNull();
    expect(container.querySelector('#term-2-year')?.textContent).toContain('New York registers for two years');
    expect(getDefaultTerm(ny)).toBe(2);
  });

  it('3 years (Connecticut): only the 3-year option', () => {
    const ct = rules.connecticut as StateRule;
    const { container } = render(<Calculator initialRule={ct} />);
    expect(termOption(container)).toEqual([3]);
    expect(container.querySelector('#term-3-year')?.textContent).toContain('Connecticut registers for three years');
  });
});

describe('Share links only use offered terms', () => {
  it('an offered ?term= wins; one the state does not offer falls back to its default', () => {
    const md = rules.maryland as StateRule;
    const tx = rules.texas as StateRule;
    const ny = rules['new-york'] as StateRule;
    const parse = (rule: StateRule, qs: string) =>
      inputsFromSearchParams(rule, new URLSearchParams(qs), getDefaultInputs(rule, 2026)).registrationTerm;
    expect(parse(md, 'price=15000&term=1')).toBe(1);
    expect(parse(md, 'price=15000&term=2')).toBe(2);
    expect(parse(md, 'price=15000&term=3')).toBe(2);
    expect(parse(tx, 'price=15000&term=2')).toBe(1);
    expect(parse(ny, 'price=15000&term=1')).toBe(2);
    expect(parse(ny, 'price=15000&term=abc')).toBe(2);
  });

  it('a link with an unoffered term renders the state’s own term', () => {
    currentSearchParams = new URLSearchParams('price=15000&term=2');
    const { container } = render(<Calculator initialRule={rules.texas as StateRule} />);
    expect(termOption(container)).toEqual([1]);
    expect(container.textContent).toContain('1-Year Term');
  });
});
