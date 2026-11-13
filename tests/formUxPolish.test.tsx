import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn()
}));

import { Calculator } from '../src/components/Calculator';
import stateRulesData from '../src/config/stateRules.json';
import { formatDollars } from '../src/lib/formatters';
import HomePage from '../src/app/page';
import { generateMetadata as calculatorMetadata } from '../src/app/calculator/[slug]/page';
import { StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const rule = (key: string) => rules[key] as StateRule;
const pageText = (key: string) => {
  const { container } = render(<Calculator initialRule={rule(key)} />);
  return (container.textContent ?? '').replace(/\s+/g, ' ');
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Form UX polish, November 2026', () => {
  it('Maryland labels the book value field NADA Retail, matching the rest of the page', () => {
    render(<Calculator initialRule={rule('maryland')} />);
    expect(screen.getByLabelText('Book Value (NADA Retail)')).toBeTruthy();
    expect(document.body.textContent).not.toContain('J.D. Power');
  });

  it('the state, locality, model year, trade-in, email and home state fields are 16px on phones and 14px from sm up', () => {
    const phone16 = (id: string) => {
      const el = document.getElementById(id);
      expect(el, id).not.toBeNull();
      const cls = el?.className ?? '';
      expect(cls, id).toMatch(/(^|\s)text-base(\s|$)/);
      expect(cls, id).toContain('sm:text-sm');
      expect(cls, id).not.toMatch(/(^|\s)text-sm(\s|$)/);
    };
    render(<Calculator initialRule={rule('vermont')} emailEnabled />);
    for (const id of ['state-select', 'model-year-input', 'trade-in-input', 'email-estimate-input']) phone16(id);
    cleanup();
    render(<Calculator initialRule={rule('pennsylvania')} />);
    phone16('locality-select');
    cleanup();
    render(<HomePage />);
    phone16('home-state-select');
  });

  it('Purchase Price selects its whole value on focus, so typing replaces it', () => {
    const select = vi.spyOn(HTMLInputElement.prototype, 'select');
    render(<Calculator initialRule={rule('maryland')} />);
    const price = document.getElementById('purchase-price-input') as HTMLInputElement;
    fireEvent.focus(price);
    expect(select).toHaveBeenCalledTimes(1);
    // the mouseup from the same click does not undo the selection
    const up = new MouseEvent('mouseup', { bubbles: true, cancelable: true });
    price.dispatchEvent(up);
    expect(up.defaultPrevented).toBe(true);
    // a later click inside the focused field places the caret as usual
    const later = new MouseEvent('mouseup', { bubbles: true, cancelable: true });
    price.dispatchEvent(later);
    expect(later.defaultPrevented).toBe(false);
  });

  it('numeric fields ask phones for a numeric keypad', () => {
    render(<Calculator initialRule={rule('vermont')} emailEnabled />);
    expect(document.getElementById('model-year-input')?.getAttribute('inputmode')).toBe('numeric');
    for (const id of ['purchase-price-input', 'trade-in-input']) {
      expect(document.getElementById(id)?.getAttribute('inputmode'), id).toBe('decimal');
    }
    expect(document.getElementById('email-estimate-input')?.getAttribute('inputmode')).toBe('email');
    cleanup();
    render(<Calculator initialRule={rule('maryland')} />);
    expect(document.getElementById('book-value-input')?.getAttribute('inputmode')).toBe('decimal');
  });

  it('tapping the sticky total scrolls to the breakdown and moves focus to its heading', () => {
    const scroll = vi.fn();
    Element.prototype.scrollIntoView = scroll;
    render(<Calculator initialRule={rule('maryland')} />);
    const button = screen.getByRole('button', { name: /see the breakdown/i });
    expect(button.closest('.fixed.bottom-0')).not.toBeNull();
    fireEvent.click(button);
    expect(scroll).toHaveBeenCalledTimes(1);
    expect(scroll.mock.contexts[0]).toBe(document.getElementById('calculator-results'));
    expect(document.activeElement?.id).toBe('calculator-results-heading');
    // Adjust details is unchanged
    expect(screen.getByRole('button', { name: 'Adjust vehicle and sale details' }).textContent).toContain('Adjust details');
  });

  it.each(['maryland', 'florida', 'nevada', 'texas'])('%s: the intro estimates rather than overclaims, with cents only when needed', (key) => {
    const r = rule(key);
    const text = pageText(key);
    expect(text).toContain(`Estimate your first-year out-of-pocket costs for a private vehicle sale in ${r.label}. Includes `);
    expect(text).toContain(`${formatDollars(r.titleFee)} certificate of title fee`);
    expect(text).not.toContain('Calculate your true');
    expect(text).not.toContain('Accurately');
  });

  it('formatDollars drops cents only for whole dollars', () => {
    expect(formatDollars(200)).toBe('$200');
    expect(formatDollars(1500)).toBe('$1,500');
    expect(formatDollars(75.25)).toBe('$75.25');
    expect(formatDollars(39.5)).toBe('$39.50');
  });

  it('the calculator meta descriptions and the home page hero no longer overclaim', async () => {
    for (const key of ['maryland', 'florida', 'texas']) {
      const meta = await calculatorMetadata({ params: Promise.resolve({ slug: rule(key).slug }) });
      const description = String(meta.description ?? '');
      expect(description, key).toContain(`Estimate your first-year costs for a private car purchase in ${rule(key).label}. Covers `);
      expect(description, key).not.toContain('true first-year');
      expect(description, key).not.toContain('Accurately');
      expect(description, key).not.toContain('Accurate calculation');
    }
    const { container } = render(<HomePage />);
    const hero = (container.textContent ?? '').replace(/\s+/g, ' ');
    expect(hero).toContain('Estimate your first-year out-of-pocket costs in seconds. Covers vehicle sales & use taxes,');
    expect(hero).not.toContain('true first-year');
    expect(hero).not.toContain('Accurately');
  });
});
