import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn()
}));

import { Calculator } from '../src/components/Calculator';
import stateRulesData from '../src/config/stateRules.json';
import { LAST_VERIFIED_DATE } from '../src/lib/constants';
import { StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const rule = (key: string) => rules[key] as StateRule;
const text = (key: string) => {
  const { container } = render(<Calculator initialRule={rule(key)} />);
  return (container.textContent ?? '').replace(/\s+/g, ' ');
};

afterEach(() => cleanup());

describe('Phone UI polish, November 2026', () => {
  it.each(['maryland', 'vermont', 'nevada', 'north-dakota'])('%s: the header badge and the summary footer give the same verified month', (key) => {
    const r = rule(key);
    const phrase = `${r.label} rates last verified: ${r.lastVerified ?? LAST_VERIFIED_DATE}`;
    const page = text(key);
    expect(page.split(phrase).length - 1).toBe(2);
    expect(page).not.toContain('Statutory Rates');
  });

  it('the state picker says 50 states + DC', () => {
    const page = text('maryland');
    expect(page).toContain('50 states + DC');
    expect(page).not.toContain('Jurisdictions Active');
  });

  it('the Motorcycle option no longer uses the dollar-sign icon', () => {
    render(<Calculator initialRule={rule('maryland')} />);
    const button = document.getElementById('type-motorcycle');
    const d = button?.querySelector('path')?.getAttribute('d') ?? '';
    expect(d).not.toContain('M12 6v12');
    expect(button?.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    expect(screen.getByText('Motorcycle')).toBeTruthy();
  });

  it('no 10px or 11px text on the calculator page', () => {
    const { container } = render(<Calculator initialRule={rule('maryland')} />);
    expect(container.innerHTML).not.toMatch(/text-\[1[01]px\]/);
  });
});
