import { describe, it, expect } from 'vitest';
import { calculateVehicleCosts } from '../src/lib/calculator';
import { getDefaultInputs } from '../src/lib/shareParams';
import { getVisibleSources, labelForSource } from '../src/lib/sources';
import stateRulesData from '../src/config/stateRules.json';
import sourceLinkStatus from '../src/config/sourceLinkStatus.json';
import { CalculatorInputs, StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const nh = rules['new-hampshire'] as StateRule;
const me = rules.maine as StateRule;
const ri = rules['rhode-island'] as StateRule;
const calc = (rule: StateRule, extra: Partial<CalculatorInputs> = {}) =>
  calculateVehicleCosts(rule, { ...getDefaultInputs(rule, 2026), purchasePrice: 15000, ...extra }, 2026);
const copy = (rule: StateRule) =>
  [rule.localTaxNote ?? '', rule.tradeInNote ?? '', ...rule.disclaimers, ...rule.faqs.map((f) => `${f.question} ${f.answer}`)].join(' ');

describe('New Hampshire re-check and rulings (November 2026)', () => {
  it('no tax; $35 title; $48 + $8 plate = $56 registration; motorcycle $30', () => {
    const b = calc(nh, { vehicleYear: 2010 });
    expect(b.exciseTax).toBe(0);
    expect(b.titleFee).toBe(35);
    expect(b.registrationTotal).toBe(56 + 90); // $3 per $1,000 on the $30,000 default
    expect(calc(nh, { vehicleType: 'motorcycle' }).registrationTotal).toBe(30);
  });

  it('municipal permit fee follows RSA 261:153 (18 to 3 mills) and rounds to the dollar', () => {
    expect(calc(nh, { vehicleYear: 2026, listPrice: 30000 }).annualValueTax).toBe(540);
    expect(calc(nh, { vehicleYear: 2025, listPrice: 30000 }).annualValueTax).toBe(450);
    expect(calc(nh, { vehicleYear: 2026, listPrice: 23333 }).annualValueTax).toBe(420); // 419.99 rounds to $420
    expect(nh.registration.listPriceAnnualTax?.roundToDollar).toBe(true);
  });

  it('no title fee for model year 1999 or older (RSA 261:3); $20 security interest fee when financed', () => {
    expect(calc(nh, { vehicleYear: 2000 }).titleFee).toBe(35);
    const old = calc(nh, { vehicleYear: 1999 });
    expect(old.titleFee).toBe(0);
    expect(old.itemizedList.find((i) => i.id === 'title-fee')?.description).toContain('No title for this model year');
    expect(calc(nh, { vehicleYear: 1990, vehicleType: 'motorcycle' }).titleFee).toBe(0);
    expect(calc(nh, { isFinanced: true }).lienFilingFee).toBe(20);
    expect(copy(nh)).toContain('model year 1999 or older (RSA 261:3)');
    expect(nh.lastVerified).toBe('November 2026');
  });

  it('deadline, gift, and out-of-state answers are the verified ones; RSA links get citations', () => {
    const text = copy(nh);
    for (const fact of ['20-day temporary plate for $20', 'RSA 261:57', 'within 60 days', 'RSA 261:45', 'No sales tax applies']) expect(text).toContain(fact);
    expect(labelForSource('https://gc.nh.gov/rsa/html/XXI/261/261-153.htm')).toBe('gc.nh.gov: RSA 261:153');
    expect(labelForSource('https://gc.nh.gov/rsa/html/XXI/261/261-141-c.htm')).toBe('gc.nh.gov: RSA 261:141-c');
  });
});

describe('Maine re-check and ruling (November 2026)', () => {
  it('5.5% tax with the trade-in credit; $33 title; $35 registration plus the excise; motorcycle $21', () => {
    expect(calc(me).exciseTax).toBe(825);
    expect(calc(me, { tradeInValue: 5000 }).exciseTax).toBe(550);
    expect(calc(me).titleFee).toBe(33);
    expect(calc(me, { vehicleYear: 2026, listPrice: 30000 }).registrationTotal).toBe(35 + 720);
    expect(calc(me, { vehicleType: 'motorcycle' }).registrationTotal).toBe(21);
  });

  it('$33 title only for vehicles 25 model years old or newer (current model year = year 1)', () => {
    expect(calc(me, { vehicleYear: 2002 }).titleFee).toBe(33); // year 25
    expect(calc(me, { vehicleYear: 2001 }).titleFee).toBe(0); // year 26
    expect(calc(me, { vehicleYear: 1995 }).titleFee).toBe(0);
    expect(copy(me)).toContain('25 model years old or newer');
    expect(me.lastVerified).toBe('November 2026');
  });

  it('deadline, gift, and out-of-state answers are the verified ones; 29-A links get citations', () => {
    const text = copy(me);
    for (const fact of ['true gift', 'loan balance', 'Bulletin 42', '30 days', 'use tax form', '36 M.R.S. 1764']) expect(text).toContain(fact);
    expect(labelForSource('https://legislature.maine.gov/statutes/29-A/title29-Asec515.html')).toBe('legislature.maine.gov: 29-A M.R.S. 515');
  });
});

describe('Rhode Island re-check (November 2026)', () => {
  it('7% tax, no private trade-in; $53.50 title and lien; $103.50 two-year registration; motorcycle $47.50', () => {
    const b = calc(ri);
    expect(b.exciseTax).toBe(1050);
    expect(calc(ri, { tradeInValue: 5000 }).exciseTax).toBe(1050);
    expect(b.titleFee).toBe(53.5);
    expect(calc(ri, { isFinanced: true }).lienFilingFee).toBe(53.5);
    expect(b.registrationTotal).toBe(103.5);
    expect(calc(ri, { vehicleType: 'motorcycle' }).registrationTotal).toBe(47.5);
  });

  it('EV +$200 and plug-in hybrid +$100 a year from January 1, 2026; motorcycles left out', () => {
    expect(calc(ri, { fuelType: 'ev' }).registrationTotal).toBe(503.5);
    expect(calc(ri, { fuelType: 'phev' }).registrationTotal).toBe(303.5);
    expect(calc(ri, { vehicleType: 'motorcycle', fuelType: 'ev' }).registrationTotal).toBe(47.5);
    expect(copy(ri)).toContain('mild hybrids, add $50 a year');
  });

  it('keeps the agency’s NADA wording and the verified answers; verified November 2026', () => {
    const text = copy(ri);
    for (const fact of ['NADA Clean Retail book value or the sale price, whichever is greater', 'Cars of Particular Interest', 'C-REF-SU', 'SU 87-65', '20th of the month', 'within 30 days of moving', 'within five days']) expect(text).toContain(fact);
    expect(ri.lastVerified).toBe('November 2026');
  });
});

describe('Sources after batch 15', () => {
  it('no hidden or homepage-only links remain for the three states, and each has a repair note', () => {
    for (const [key, rule] of [['new-hampshire', nh], ['maine', me], ['rhode-island', ri]] as const) {
      expect(sourceLinkStatus.hidden.some((h) => h.state === key)).toBe(false);
      expect(sourceLinkStatus.homepageOnly.some((h) => h.state === key)).toBe(false);
      expect(sourceLinkStatus.repaired.some((r) => r.state === key && r.on === '2026-11-18')).toBe(true);
      expect(getVisibleSources(rule)).toHaveLength(rule.sources.length);
    }
  });
});
