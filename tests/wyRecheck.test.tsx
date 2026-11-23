import { describe, it, expect } from 'vitest';
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

describe('Wyoming re-check (November 2026, items for ruling)', () => {
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

  it('$15 title; $20 lien; motorcycle state fee $25 (31-3-101(a)(ii)(D)), shown without the county fee', () => {
    expect(calc(wy).titleFee).toBe(15);
    expect(calc(wy, { isFinanced: true }).lienFilingFee).toBe(20);
    expect(calc(wy, { vehicleType: 'motorcycle' }).registrationTotal).toBe(25);
    expect(copy(wy)).toContain('Motorcycles are shown without the county fee');
  });

  it('EV decal $100 and plug-in hybrid $50 (31-3-102); both definitions exclude motorcycles (39-17-301)', () => {
    expect(calc(wy, { fuelType: 'ev', vehicleYear: 2021, listPrice: 30000 }).registrationTotal).toBe(30 + 135 + 100);
    expect(calc(wy, { fuelType: 'phev', vehicleYear: 2021, listPrice: 30000 }).registrationTotal).toBe(30 + 135 + 50);
    expect(calc(wy, { vehicleType: 'motorcycle', fuelType: 'ev' }).registrationTotal).toBe(25);
    expect(calc(wy, { vehicleType: 'motorcycle', fuelType: 'phev' }).registrationTotal).toBe(25);
    expect(copy(wy)).toContain('W.S. 39-17-301(a)(l) and (xxxviii)');
  });

  it('keeps the dealer-only trade-in rule pending the ruling; states the verified family, gift, credit, and deadline answers; date held', () => {
    expect(calc(wy, { tradeInValue: 5000 }).exciseTax).toBe(600);
    const text = copy(wy);
    for (const fact of ['39-15-105(a)(xi)', 'stepsibling', 'fair market value', '39-15-109(d)(v)', 'within 45 days', '31-2-201(a)(ii)(D)', 'temporary worker permit']) expect(text).toContain(fact);
    expect(wy.lastVerified).toBe('September 2026');
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
