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

describe('Idaho re-check and rulings (November 2026)', () => {
  it('6% tax, no private trade-ins, $14 title, EV $140 and plug-in hybrid $75', () => {
    expect(calc(id).exciseTax).toBe(900);
    expect(calc(id, { tradeInValue: 5000 }).exciseTax).toBe(900);
    expect(calc(id).titleFee).toBe(14);
    expect(id.registration.evSurchargeAnnual).toBe(140);
    expect(id.registration.phevSurchargeAnnual).toBe(75);
  });

  it('registration by model year plus $8 in statewide fees: $77, $65, $53; motorcycle $33', () => {
    for (const [vehicleYear, fee] of [[2026, 77], [2025, 77], [2024, 65], [2021, 65], [2020, 53], [2010, 53]]) {
      expect(calc(id, { vehicleYear }).registrationTotal, String(vehicleYear)).toBe(fee);
    }
    expect(calc(id, { vehicleType: 'motorcycle' }).registrationTotal).toBe(33);
    expect(calc(id, { vehicleYear: 2026, fuelType: 'ev' }).registrationTotal).toBe(217);
    const text = copy(id);
    for (const fact of ['$1.25 EMS fee', '$3 State Police fee', '$3.75 new plate fee', '$3 to $14', '$0 to $18.75', '$14 to $32.75']) expect(text).toContain(fact);
    expect(id.lastVerified).toBe('November 2026');
  });

  it('deadline, family, and out-of-state answers are the verified ones', () => {
    const text = copy(id);
    for (const fact of ['within 30 days', '$20 late-filing penalty', '90 days', 'ST-133', 'ST-133GT', 'siblings', 'VIN inspection', 'receipt']) expect(text).toContain(fact);
  });
});

describe('West Virginia re-check and ruling (November 2026)', () => {
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

  it('private trade-ins titled in West Virginia in the buyer’s name, tax paid, are deducted', () => {
    expect(wv.tradeInDeductible).toBe(true);
    expect(calc(wv, { tradeInValue: 5000 }).exciseTax).toBe(600);
    expect(wv.tradeInNote).toContain('titled in West Virginia in your name and the titling tax was paid on it');
    expect(copy(wv)).not.toMatch(/restricted to licensed dealer|applies only when purchasing from a licensed/i);
    expect(wv.lastVerified).toBe('November 2026');
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

describe('Hawaii re-check and ruling (November 2026)', () => {
  it('no tax on a casual sale; $10 transfer; registration is the $46 state fee plus state weight tax on 3,500 lbs', () => {
    expect(calc(hi).exciseTax).toBe(0);
    expect(calc(hi).titleFee).toBe(10);
    expect(calc(hi).registrationTotal).toBe(107.25);
    expect(calc(hi, { weightClass: 'over3700lbs' }).registrationTotal).toBe(107.25);
    expect(hi.lastVerified).toBe('November 2026');
  });

  it('copy gives the verified state weight tax and no longer states unverified county rates', () => {
    const text = copy(hi);
    expect(text).toContain('1.75¢ a pound');
    expect(text).toContain('HRS 249-33');
    expect(text).toContain('on an assumed 3,500 lbs (about $61)');
    expect(text).toContain('not included and vary by county');
    expect(text).toContain('the county registration fee is $20');
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
