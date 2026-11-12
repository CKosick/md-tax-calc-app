import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn(), back: vi.fn(), forward: vi.fn() })
}));

import CalculatorHubPage from '../src/app/calculator/page';
import { GUIDES } from '../src/config/guides';
import stateRulesData from '../src/config/stateRules.json';

afterEach(() => cleanup());

const allStrings = (v: unknown): string[] =>
  typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(allStrings) : v && typeof v === 'object' ? Object.values(v).flatMap(allStrings) : [];

describe('Fair market value label and Tennessee threshold wording, November 2026', () => {
  it('the state table says Fair Market Value without naming NADA', () => {
    const { container } = render(<CalculatorHubPage />);
    const page = container.textContent ?? '';
    expect(page).toContain('Fair Market Value');
    expect(page).not.toContain('Fair Market Value (NADA)');
  });

  it('the Tennessee guide uses the form wording, 75% or less', () => {
    const text = allStrings(GUIDES.find((g) => g.slug === 'how-to-title-a-private-car-sale-in-tennessee')).join(' ');
    expect(text.split('75% or less of the value').length - 1).toBe(2);
    expect(text).not.toContain('under 75%');
  });

  it('the Tennessee state rules copy uses the form wording, 75% or less', () => {
    const text = allStrings((stateRulesData as Record<string, unknown>)['tennessee']).join(' ');
    expect(text).toContain('75% or less of the vehicle’s value in a pricing guide');
    expect(text).toContain('75% or less of the value in a pricing guide');
    expect(text).not.toContain('under 75%');
  });
});
