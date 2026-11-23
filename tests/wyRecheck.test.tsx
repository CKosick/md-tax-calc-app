import React from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Calculator } from '../src/components/Calculator';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn()
}));
import { calculateVehicleCosts } from '../src/lib/calculator';
import { getDefaultInputs } from '../src/lib/shareParams';
import { getVisibleSources, labelForSource } from '../src/lib/sources';
import stateRulesData from '../src/config/stateRules.json';
import sourceLinkStatus from '../src/config/sourceLinkStatus.json';
import { DATED_FIGURES } from '../src/lib/datedFigures';
import { CalculatorInputs, StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const wy = rules.wyoming as StateRule;
const calc = (rule: StateRule, extra: Partial<CalculatorInputs> = {}) =>
  calculateVehicleCosts(rule, { ...getDefaultInputs(rule, 2026), purchasePrice: 15000, ...extra }, 2026);
const copy = (rule: StateRule) =>
  [rule.localTaxNote ?? '', rule.tradeInNote ?? '', ...rule.disclaimers, ...rule.faqs.map((f) => `${f.question} ${f.answer}`)].join(' ');

describe('Wyoming re-check and rulings (November 2026)', () => {
  it('4% state tax with a 0% to 3% county range (DOR chart October 1, 2026), registered as a dated figure', () => {
    expect(calc(wy).exciseTax).toBe(600);
    expect(wy.localTaxMinRate).toBe(0);
    expect(wy.localTaxMaxRate).toBe(0.03);
    expect(copy(wy)).toContain('4% to 7%');
    expect(copy(wy)).toContain('Park and Sublette');
    expect(DATED_FIGURES.some((f) => f.state === 'wyoming' && f.contains === '4% to 7%')).toBe(true);
  });

  it('county registration fee under W.S. 31-3-101(a)(i) from the MSRP entered, plus the $30 state fee; $5 minimum', () => {
    expect(calc(wy, { vehicleYear: 2026, listPrice: 30000 }).registrationTotal).toBe(30 + 540); // 3% of 60%
    expect(calc(wy, { vehicleYear: 2025, listPrice: 30000 }).registrationTotal).toBe(30 + 450); // 3% of 50%
    expect(calc(wy, { vehicleYear: 2021, listPrice: 30000 }).registrationTotal).toBe(30 + 135); // 6th year: 3% of 15%
    expect(calc(wy, { vehicleYear: 2010, listPrice: 1000 }).registrationTotal).toBe(30 + 5); // $4.50 -> $5 minimum
    expect(copy(wy)).toContain('MSRP you enter ($30,000 if blank)');
    expect(copy(wy)).toContain('national price guide');
  });

  it('$15 title; $20 lien; motorcycle pays the $25 state fee (31-3-101(a)(ii)(D)) and the county fee from the MSRP entered or $30,000', () => {
    expect(calc(wy).titleFee).toBe(15);
    expect(calc(wy, { isFinanced: true }).lienFilingFee).toBe(20);
    expect(calc(wy, { vehicleType: 'motorcycle', vehicleYear: 2026, listPrice: 12000 }).registrationTotal).toBe(25 + 216); // 3% of 60% of $12,000
    expect(calc(wy, { vehicleType: 'motorcycle', vehicleYear: 2021, listPrice: 12000 }).registrationTotal).toBe(25 + 54); // 3% of 15%
    expect(calc(wy, { vehicleType: 'motorcycle', vehicleYear: 2021 }).registrationTotal).toBe(25 + 135); // $30,000 default
    expect(calc(wy, { vehicleType: 'motorcycle', vehicleYear: 2010, listPrice: 1000 }).registrationTotal).toBe(25 + 5); // $5 minimum
    expect(wy.registration.listPriceAnnualTax?.appliesToMotorcycles).toBe(true);
    expect(copy(wy)).toContain('for cars and motorcycles');
    expect(copy(wy)).not.toContain('shown without the county fee');
  });

  it('EV decal $100 and plug-in hybrid $50 (31-3-102); both definitions exclude motorcycles (39-17-301)', () => {
    expect(calc(wy, { fuelType: 'ev', vehicleYear: 2021, listPrice: 30000 }).registrationTotal).toBe(30 + 135 + 100);
    expect(calc(wy, { fuelType: 'phev', vehicleYear: 2021, listPrice: 30000 }).registrationTotal).toBe(30 + 135 + 50);
    expect(calc(wy, { vehicleType: 'motorcycle', fuelType: 'ev', vehicleYear: 2021 }).registrationTotal).toBe(25 + 135); // no decal
    expect(calc(wy, { vehicleType: 'motorcycle', fuelType: 'phev', vehicleYear: 2021 }).registrationTotal).toBe(25 + 135);
    expect(copy(wy)).toContain('W.S. 39-17-301(a)(l) and (xxxviii)');
  });

  it('trade-ins in the same transaction are deductible (39-15-105(a)(ix)(A)); states the verified family, gift, credit, and deadline answers; verified November 2026', () => {
    expect(calc(wy, { tradeInValue: 5000 }).exciseTax).toBe(400); // 4% of $15,000 - $5,000
    expect(wy.tradeInDeductible).toBe(true);
    expect(copy(wy)).toContain('W.S. 39-15-105(a)(ix)(A)');
    expect(copy(wy)).not.toMatch(/dealer transactions|not available for private party/);
    const text = copy(wy);
    for (const fact of ['39-15-105(a)(xi)', 'stepsibling', 'fair market value', '39-15-109(d)(v)', 'within 45 days', '31-2-201(a)(ii)(D)', 'temporary worker permit']) expect(text).toContain(fact);
    expect(wy.lastVerified).toBe('November 2026');
  });
});

afterEach(() => cleanup());

describe('Wyoming form after the motorcycle county fee ruling', () => {
  it('shows the MSRP input for a motorcycle and adds the county fee to the results', () => {
    const { container } = render(<Calculator initialRule={wy} />);
    fireEvent.click(container.querySelector('#type-motorcycle')!);
    const input = container.querySelector('#list-price-input') as HTMLInputElement;
    expect(input).not.toBeNull();
    fireEvent.change(input, { target: { value: '12000' } });
    expect(container.querySelector('#calculator-results')?.textContent).toContain('Wyoming county registration fee for a $12,000.00 list price');
  });

  it('shows the Deductible trade-in badge with the (a)(ix)(A) notice', () => {
    const { container } = render(<Calculator initialRule={wy} />);
    expect(container.textContent).toContain('Wyoming: Deductible');
    expect(container.textContent).toContain('W.S. 39-15-105(a)(ix)(A)');
  });
});

describe('Sources after batch 18', () => {
  it('no hidden or homepage-only Wyoming links remain; a repair note is recorded; bill links get labels', () => {
    expect(sourceLinkStatus.homepageOnly.some((h) => h.state === 'wyoming')).toBe(false);
    expect(sourceLinkStatus.repaired.some((r) => r.state === 'wyoming' && r.on === '2026-11-22')).toBe(true);
    expect(getVisibleSources(wy)).toHaveLength(wy.sources.length);
    expect(wy.sources).not.toContain('https://revenue.wyo.gov');
    expect(labelForSource('https://www.wyoleg.gov/2026/Enroll/SF0079.pdf')).toBe('wyoleg.gov: 2026 Wyo. SF 79');
    expect(labelForSource('https://wyoleg.gov/2026/Enroll/HB0145.pdf')).toBe('wyoleg.gov: 2026 Wyo. HB 145');
    expect(labelForSource('https://www.wyoleg.gov/statutes/compress/title39.pdf')).toBe('wyoleg.gov: Wyo. Stat. Title 39');
  });
});
