import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn()
}));

import { Calculator } from '../src/components/Calculator';
import { resolvePartnerHrefs } from '../src/lib/partnerLinks';
import partnerSlots from '../src/config/partnerSlots.json';
import stateRulesData from '../src/config/stateRules.json';
import { PartnerSlotConfig, StateRule, StateRulesConfig } from '../src/lib/types';

afterEach(() => cleanup());

const rules = stateRulesData as StateRulesConfig;
const md = rules.maryland as StateRule;
const allHrefs = resolvePartnerHrefs(partnerSlots as PartnerSlotConfig[], {
  NEXT_PUBLIC_PARTNER_INSURANCE_URL: 'https://example.com/insurance',
  NEXT_PUBLIC_PARTNER_LOAN_URL: 'https://example.com/loans',
  NEXT_PUBLIC_PARTNER_VIN_CHECK_URL: 'https://epicvin.com?a_aid=test'
});

describe('Results hero row (UI fixes, item 1)', () => {
  it('wraps, so the Save / Share button drops under the total when the two-column layout is too narrow', () => {
    const { container } = render(<Calculator initialRule={md} />);
    const row = container.querySelector('#results-hero-row') as HTMLElement;
    expect(row).not.toBeNull();
    expect(row.className).toContain('sm:flex-wrap');
    // The total block can shrink instead of forcing the row wider than the card
    expect((row.firstElementChild as HTMLElement).className).toContain('min-w-0');
    const share = [...row.querySelectorAll('button')].find((b) => b.textContent?.includes('Save / Share'));
    expect(share).toBeDefined();
    expect(share!.className).toContain('print:hidden');
  });
});

describe('Sticky bar "See breakdown" label (UI fixes, item 2)', () => {
  it('shows a visible See breakdown label inside the total button; the total tap and Adjust details still work', () => {
    const scroll = vi.fn();
    Element.prototype.scrollIntoView = scroll;
    render(<Calculator initialRule={md} />);
    const label = document.getElementById('sticky-see-breakdown')!;
    expect(label).not.toBeNull();
    expect(label.textContent).toContain('See breakdown');
    const totalButton = screen.getByRole('button', { name: /see the breakdown/i });
    expect(totalButton.contains(label)).toBe(true);
    expect(totalButton.closest('.fixed.bottom-0')?.className).toContain('lg:hidden');
    fireEvent.click(label);
    expect(scroll.mock.contexts[0]).toBe(document.getElementById('calculator-results'));
    fireEvent.click(screen.getByRole('button', { name: 'Adjust vehicle and sale details' }));
    expect(scroll.mock.contexts[1]).toBe(document.getElementById('calculator-form'));
  });
});

describe('VIN card placement (UI fixes, item 3)', () => {
  it('the estimate is the first element in the right column; the VIN card and its disclosure follow it, the sidebar slot stays last', () => {
    render(<Calculator initialRule={md} partnerHrefs={allHrefs} />);
    fireEvent.click(document.getElementById('financed-yes')!);
    const results = document.getElementById('calculator-results')!;
    const column = results.parentElement!;
    expect(column.firstElementChild).toBe(results);
    const vin = screen.getByRole('link', { name: /check the vin/i });
    const vinCard = [...column.children].find((c) => c.contains(vin))!;
    expect(vinCard.className).toContain('print:hidden');
    expect(vinCard.previousElementSibling).toBe(results);
    expect(vinCard.nextElementSibling?.id).toBe('partner-disclosure');
    expect(document.querySelectorAll('#partner-disclosure')).toHaveLength(1);
    const loans = screen.getByRole('link', { name: /check auto loan rates/i });
    expect(column.lastElementChild?.contains(loans)).toBe(true);
  });

  it('without the VIN offer, the disclosure stays inside the results block', () => {
    const noVin = { ...allHrefs };
    delete noVin['vin-check'];
    render(<Calculator initialRule={md} partnerHrefs={noVin} />);
    const disclosure = document.getElementById('partner-disclosure')!;
    expect(document.getElementById('calculator-results')!.contains(disclosure)).toBe(true);
  });
});
