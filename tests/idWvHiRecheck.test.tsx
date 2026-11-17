import { describe, it, expect } from 'vitest';
import { calculateVehicleCosts } from '../src/lib/calculator';
import { getDefaultInputs } from '../src/lib/shareParams';
import { getVisibleSources, labelForSource } from '../src/lib/sources';
import stateRulesData from '../src/config/stateRules.json';
import sourceLinkStatus from '../src/config/sourceLinkStatus.json';
import { CalculatorInputs, StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const id = rules.idaho as StateRule;
const wv = rules['west-virginia'] as StateRule;
const hi = rules.hawaii as StateRule;
const calc = (rule: StateRule, extra: Partial<CalculatorInputs> = {}) =>
  calculateVehicleCosts(rule, { ...getDefaultInputs(rule, 2026), purchasePrice: 15000, ...extra }, 2026);
const copy = (rule: StateRule) =>
  [rule.localTaxNote ?? '', rule.tradeInNote ?? '', ...rule.disclaimers, ...rule.faqs.map((f) => `${f.question} ${f.answer}`)].join(' ');

describe('Idaho re-check (November 2026, registration items for ruling)', () => {
  it('6% tax, no private trade-ins, $14 title, EV $140 and plug-in hybrid $75', () => {
    expect(calc(id).exciseTax).toBe(900);
    expect(calc(id, { tradeInValue: 5000 }).exciseTax).toBe(900);
    expect(calc(id).titleFee).toBe(14);
    expect(id.registration.evSurchargeAnnual).toBe(140);
    expect(id.registration.phevSurchargeAnnual).toBe(75);
  });

  it('keeps the figures that wait on a ruling, and the verified date, as they were', () => {
    expect(calc(id, { vehicleYear: 2026 }).registrationTotal).toBe(45);
    expect(calc(id, { vehicleType: 'motorcycle' }).registrationTotal).toBe(19);
    expect(id.lastVerified).toBe('September 2026');
  });

  it('deadline, family, and out-of-state answers are the verified ones', () => {
    const text = copy(id);
    for (const fact of ['within 30 days', '$20 late-filing penalty', '90 days', 'ST-133', 'ST-133GT', 'siblings', 'VIN inspection', 'receipt']) expect(text).toContain(fact);
  });
});

describe('West Virginia re-check (November 2026, private trade-ins for ruling)', () => {
  it('6% sales tax (W. Va. Code 11-15-3c), $30 under a $500 price, $15 title, $10 lien', () => {
    expect(calc(wv).exciseTax).toBe(900);
    expect(calc(wv, { purchasePrice: 300 }).exciseTax).toBe(30);
    expect(calc(wv).titleFee).toBe(15);
    expect(calc(wv, { isFinanced: true }).lienFilingFee).toBe(10);
    expect(copy(wv)).toContain('6% sales tax');
    expect(copy(wv)).not.toMatch(/5(\.0)?% (Motor Vehicle )?Privilege Tax/i);
  });

  it('registration $51.50 for a car, $16 for a motorcycle; EV +$200 and hybrid +$100', () => {
    expect(calc(wv).registrationTotal).toBe(51.5);
    expect(calc(wv, { vehicleType: 'motorcycle' }).registrationTotal).toBe(16);
    expect(wv.registration.evSurchargeAnnual).toBe(200);
    expect(wv.registration.phevSurchargeAnnual).toBe(100);
  });

  it('keeps the trade-in rule that waits on a ruling, and the verified date, as they were', () => {
    expect(wv.tradeInDeductible).toBe(false);
    expect(wv.lastVerified).toBe('September 2026');
  });

  it('book value, gift, deadline, and out-of-state answers are the verified ones', () => {
    const text = copy(wv);
    for (const fact of ['50% of the NADA Clean Loan value', 'two years old or newer', 'DMV-5-TR', 'parent and child or spouses', 'does not give credit', 'within 10 days', 'New residents have 30 days']) expect(text).toContain(fact);
  });

  it('statute links get citations', () => {
    expect(labelForSource('https://code.wvlegislature.gov/11-15-3C/')).toBe('code.wvlegislature.gov: W. Va. Code 11-15-3c');
    expect(labelForSource('https://code.wvlegislature.gov/17A-3-4/')).toBe('code.wvlegislature.gov: W. Va. Code 17A-3-4');
  });
});

describe('Hawaii re-check (November 2026, county registration for ruling)', () => {
  it('no tax on a casual sale; $10 transfer; registration still the $46 state fee pending the ruling', () => {
    expect(calc(hi).exciseTax).toBe(0);
    expect(calc(hi).titleFee).toBe(10);
    expect(calc(hi).registrationTotal).toBe(46);
    expect(hi.lastVerified).toBe('September 2026');
  });

  it('copy gives the verified state weight tax and no longer states unverified county rates', () => {
    const text = copy(hi);
    expect(text).toContain('1.75¢ a pound');
    expect(text).toContain('HRS 249-33');
    expect(text).toContain('The estimate shows the $46 state registration fee only');
    expect(text).not.toMatch(/7\.0¢|up to 7\.0/);
  });

  it('transfer and out-of-state answers are the verified ones', () => {
    const text = copy(hi);
    for (const fact of ['$50 penalty', 'Form G-27', '4.5% use tax', 'landed value']) expect(text).toContain(fact);
  });

  it('statute links get citations', () => {
    expect(labelForSource('https://data.capitol.hawaii.gov/hrscurrent/Vol04_Ch0201-0257/HRS0249/HRS_0249-0033.htm')).toBe('data.capitol.hawaii.gov: HRS 249-33');
  });
});

describe('Sources after batch 14', () => {
  it('no hidden or homepage-only links remain for the three states, and each has a repair note', () => {
    for (const [key, rule] of [['idaho', id], ['west-virginia', wv], ['hawaii', hi]] as const) {
      expect(sourceLinkStatus.hidden.some((h) => h.state === key)).toBe(false);
      expect(sourceLinkStatus.homepageOnly.some((h) => h.state === key)).toBe(false);
      expect(sourceLinkStatus.repaired.some((r) => r.state === key && r.on === '2026-11-16')).toBe(true);
      expect(getVisibleSources(rule)).toHaveLength(rule.sources.length);
    }
  });
});
