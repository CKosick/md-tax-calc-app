import React from 'react';
import fs from 'fs';
import path from 'path';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Calculator } from '../src/components/Calculator';
import CalculatorSlugPage from '../src/app/calculator/[slug]/page';
import { calculateVehicleCosts } from '../src/lib/calculator';
import { buildShareSearchParams, getDefaultInputs, getEffectiveTerm, getOfferedTerms, inputsFromSearchParams } from '../src/lib/shareParams';
import stateRulesData from '../src/config/stateRules.json';
import { CalculatorInputs, StateRule, StateRulesConfig } from '../src/lib/types';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn()
}));

afterEach(() => cleanup());

const rules = stateRulesData as StateRulesConfig;
const rule = (key: string) => rules[key] as StateRule;
const calc = (key: string, extra: Partial<CalculatorInputs> = {}) =>
  calculateVehicleCosts(rule(key), { ...getDefaultInputs(rule(key), 2026), purchasePrice: 15000, ...extra }, 2026);
const regLine = (key: string, extra: Partial<CalculatorInputs> = {}) => calc(key, extra).itemizedList.find((i) => i.id === 'registration-fee');

describe('Motorcycle registration terms (RMV fee table; WisDOT fee chart)', () => {
  it('Massachusetts: car $60 for two years; motorcycle $20 for one year', () => {
    expect(regLine('massachusetts')?.amount).toBe(60);
    expect(regLine('massachusetts')?.label).toContain('2-Year Term');
    expect(regLine('massachusetts', { vehicleType: 'motorcycle' })?.amount).toBe(20);
    expect(regLine('massachusetts', { vehicleType: 'motorcycle' })?.label).toContain('1-Year Term');
    expect(getOfferedTerms(rule('massachusetts'), 'motorcycle')).toEqual([1]);
  });

  it('Wisconsin: car $85 for one year; motorcycle $23 for two years (biennial)', () => {
    expect(regLine('wisconsin')?.amount).toBe(85);
    expect(regLine('wisconsin')?.label).toContain('1-Year Term');
    expect(regLine('wisconsin', { vehicleType: 'motorcycle' })?.amount).toBe(23);
    expect(regLine('wisconsin', { vehicleType: 'motorcycle' })?.label).toContain('2-Year Term');
    expect(getOfferedTerms(rule('wisconsin'), 'motorcycle')).toEqual([2]);
  });

  it('only a motorcycle in a state with its own motorcycle period is moved; cars and other states keep the chosen term', () => {
    expect(getEffectiveTerm(rule('south-carolina'), { vehicleType: 'passenger', registrationTerm: 1 })).toBe(1);
    expect(getEffectiveTerm(rule('maryland'), { vehicleType: 'motorcycle', registrationTerm: 1 })).toBe(1);
    expect(getEffectiveTerm(rule('wisconsin'), { vehicleType: 'motorcycle', registrationTerm: 1 })).toBe(2);
  });

  it('the form shows the motorcycle period once Motorcycle is picked', () => {
    const { container } = render(<Calculator initialRule={rule('wisconsin')} />);
    expect(container.querySelector('#term-1-year')).not.toBeNull();
    fireEvent.click(container.querySelector('#type-motorcycle')!);
    expect(container.querySelector('#term-2-year')?.textContent).toContain('2-Year Term');
    expect(container.querySelector('#term-1-year')).toBeNull();
    expect(container.querySelector('#calculator-results')?.textContent).toContain('$23.00');
  });
});

describe('Missouri taxable horsepower (DOR fee table)', () => {
  const tiers: [string, number][] = [
    ['under-12', 27.25],
    ['12-23', 30.25],
    ['24-35', 33.25],
    ['36-47', 42.25],
    ['48-59', 48.25],
    ['60-71', 54.25],
    ['72-plus', 60.25]
  ];

  it('each tier is the published 1-year fee plus the $9 processing fee; 24 to 35 hp stays the default', () => {
    for (const [id, fee] of tiers) expect(calc('missouri', { horsepowerTier: id }).registrationTotal).toBe(fee);
    expect(calc('missouri').registrationTotal).toBe(33.25);
  });

  it('an electric vehicle uses the under-12-hp-or-electric tier, plus the $150 decal; plug-in hybrids keep the chosen tier', () => {
    expect(calc('missouri', { fuelType: 'ev', horsepowerTier: '72-plus' }).registrationTotal).toBe(27.25 + 150);
    expect(calc('missouri', { fuelType: 'phev', horsepowerTier: '72-plus' }).registrationTotal).toBe(60.25 + 75);
  });

  it('motorcycles are unaffected ($8.75 + $9)', () => {
    expect(calc('missouri', { vehicleType: 'motorcycle', horsepowerTier: '72-plus' }).registrationTotal).toBe(17.75);
  });

  it('the share link keeps the tier and ignores an unknown one', () => {
    const inputs = { ...getDefaultInputs(rule('missouri'), 2026), purchasePrice: 15000, horsepowerTier: '48-59' };
    const params = buildShareSearchParams(rule('missouri'), 15000, inputs);
    expect(params.get('hp')).toBe('48-59');
    expect(inputsFromSearchParams(rule('missouri'), params, getDefaultInputs(rule('missouri'), 2026)).horsepowerTier).toBe('48-59');
    params.set('hp', 'bogus');
    expect(inputsFromSearchParams(rule('missouri'), params, getDefaultInputs(rule('missouri'), 2026)).horsepowerTier).toBeUndefined();
  });

  it('the form offers all seven tiers, updates the estimate, and locks to the lowest tier for an EV', () => {
    const { container } = render(<Calculator initialRule={rule('missouri')} />);
    const select = container.querySelector('#horsepower-select') as HTMLSelectElement;
    expect(select).not.toBeNull();
    expect(select.options).toHaveLength(7);
    expect(select.options[0].textContent).toContain('$18.25');
    expect(select.options[6].textContent).toContain('$51.25');
    fireEvent.change(select, { target: { value: '72-plus' } });
    expect(container.querySelector('#calculator-results')?.textContent).toContain('$60.25');
    expect(container.textContent).toContain('$18.25 (under 12 horsepower or electric) to $51.25');
  });

  it('other states show no horsepower selector', () => {
    const { container } = render(<Calculator initialRule={rule('kansas')} />);
    expect(container.querySelector('#horsepower-select')).toBeNull();
  });
});

describe('Print stylesheet for the estimate', () => {
  it('prints the heading, results, and disclaimers; hides the form, partner offers, sharing, and the sections below', () => {
    const { container } = render(<Calculator initialRule={rule('maryland')} />);
    const results = container.querySelector('#calculator-results') as HTMLElement;
    expect(results.className).toContain('print:static');
    expect(container.querySelector('#vehicle-form, form')?.closest('.print\\:hidden')).not.toBeNull();
    expect(container.querySelector('nav[aria-label="Breadcrumb"]')?.className).toContain('print:hidden');
    expect([...container.querySelectorAll('button')].find((b) => b.textContent?.includes('Save / Share'))?.className).toContain('print:hidden');
    // The first section on the page is now the checklist, which prints; the FAQ is hidden
    expect(container.querySelector('section[aria-labelledby="faq-section-title"]')?.closest('.print\\:hidden')).not.toBeNull();
    const printOnly = [...container.querySelectorAll('.print\\:block')].map((el) => el.textContent ?? '').join(' ');
    expect(printOnly).toContain('Printed estimate from cartaxhub.com/calculator/maryland-private-sale-tax-calculator');
  });

  it('the pre-purchase checklist prints with the estimate; the FAQ, guides, and related states do not (ruled 2026-11-25)', async () => {
    const { container } = render(await CalculatorSlugPage({ params: Promise.resolve({ slug: rule('wyoming').slug }) }));
    const hiddenInPrint = (el: Element | null) => el?.closest('.print\\:hidden') ?? null;
    const checklist = container.querySelector('#pre-purchase-checklist');
    expect(checklist).not.toBeNull();
    expect(hiddenInPrint(checklist)).toBeNull();
    expect(hiddenInPrint(container.querySelector('#calculator-results'))).toBeNull();
    const faq = container.querySelector('section[aria-labelledby="faq-section-title"]');
    expect(faq).not.toBeNull();
    expect(hiddenInPrint(faq)).not.toBeNull();
    expect(hiddenInPrint(container.querySelector('#state-guides'))).not.toBeNull();
    // Related states and every other section after the checklist sit in the same hidden block
    const after = [...container.querySelectorAll('section')].filter((s) => s !== checklist && checklist!.compareDocumentPosition(s) & Node.DOCUMENT_POSITION_FOLLOWING);
    expect(after.length).toBeGreaterThanOrEqual(3);
    for (const section of after) expect(hiddenInPrint(section)).not.toBeNull();
  });

  it('the global stylesheet has the print rules', () => {
    const css = fs.readFileSync(path.join(__dirname, '../src/app/globals.css'), 'utf8');
    expect(css).toContain('@media print');
    expect(css).toContain('@page');
  });
});
