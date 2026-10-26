import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn()
}));

import CalculatorSlugPage from '../src/app/calculator/[slug]/page';
import GuidePage from '../src/app/guides/[slug]/page';
import { Calculator } from '../src/components/Calculator';
import { getStateOptions } from '../src/lib/stateOptions';
import stateRulesData from '../src/config/stateRules.json';
import { StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
afterEach(() => cleanup());

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? sourceFiles(p) : /\.tsx?$/.test(f) ? [p] : [];
  });

describe('unused-javascript: the full rules file stays out of the browser bundle', () => {
  it('no client component imports stateRules.json', () => {
    const clientFiles = sourceFiles('src').filter((p) => /^['"]use client['"]/.test(readFileSync(p, 'utf8').trimStart()));
    expect(clientFiles.length).toBeGreaterThan(0);
    for (const p of clientFiles) {
      const src = readFileSync(p, 'utf8');
      expect(src, p).not.toMatch(/from ['"][^'"]*stateRules\.json['"]/);
      // stateOptions imports the rules, so client code may only import its types
      expect(src, p).not.toMatch(/^import \{[^}]*\} from ['"]@\/lib\/stateOptions['"]/m);
    }
  });

  it('getStateOptions lists all 51 states, sorted, with only key, label, and slug', () => {
    const options = getStateOptions();
    expect(options).toHaveLength(51);
    expect(options.map((o) => o.label)).toEqual([...options.map((o) => o.label)].sort((a, b) => a.localeCompare(b)));
    for (const o of options) {
      expect(Object.keys(o).sort()).toEqual(['key', 'label', 'slug']);
      expect(rules[o.key].slug).toBe(o.slug);
    }
  });

  it('the calculator and guide pages still offer all 51 states in the state menu', async () => {
    const calc = render(await CalculatorSlugPage({ params: Promise.resolve({ slug: 'maryland-private-sale-tax-calculator' }) }));
    expect(calc.container.querySelectorAll('#state-select option')).toHaveLength(51);
    cleanup();
    const guide = render(await GuidePage({ params: Promise.resolve({ slug: 'how-to-title-a-private-car-sale-in-maryland' }) }));
    expect(guide.container.querySelectorAll('#state-select option')).toHaveLength(51);
  });
});

describe('accessibility audit fixes', () => {
  it('label-content-name-mismatch: the share button’s name is its visible text', () => {
    const { getByRole } = render(<Calculator initialRule={rules.maryland as StateRule} />);
    const button = getByRole('button', { name: /save \/ share result/i });
    expect(button.getAttribute('aria-label')).toBeNull();
  });

  it('heading-order: the VEIP note is an h3 under the results h2', () => {
    const { container } = render(<Calculator initialRule={rules.maryland as StateRule} />);
    const veip = [...container.querySelectorAll('h3, h4')].find((h) => /VEIP Vehicle Emissions Inspection/.test(h.textContent ?? ''));
    expect(veip?.tagName).toBe('H3');
  });

  it('color-contrast: the flagged muted text uses slate-500 (light) and slate-400 (dark)', () => {
    for (const p of ['src/app/layout.tsx', 'src/components/CostSummaryCard.tsx', 'src/components/VehicleTaxComparisonTables.tsx']) {
      expect(readFileSync(p, 'utf8'), p).not.toContain('text-slate-400 dark:text-slate-500');
    }
    // The comparison page's "0%" badge: white on emerald-700 (emerald-600 was 3.65:1)
    const comparison = readFileSync('src/app/vehicle-tax-by-state/page.tsx', 'utf8');
    expect(comparison).not.toContain('bg-emerald-600 text-white');
    expect(comparison).toContain('bg-emerald-700 text-white');
  });
});
