import { describe, it, expect } from 'vitest';
import { calculateVehicleCosts } from '../src/lib/calculator';
import { getDefaultInputs } from '../src/lib/shareParams';
import { getVisibleSources } from '../src/lib/sources';
import stateRulesData from '../src/config/stateRules.json';
import sourceLinkStatus from '../src/config/sourceLinkStatus.json';
import { CalculatorInputs, StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const ms = rules.mississippi as StateRule;
const nm = rules['new-mexico'] as StateRule;
const ne = rules.nebraska as StateRule;
const calc = (rule: StateRule, extra: Partial<CalculatorInputs> = {}) =>
  calculateVehicleCosts(rule, { ...getDefaultInputs(rule, 2026), purchasePrice: 15000, ...extra }, 2026);
const copy = (rule: StateRule) =>
  [rule.localTaxNote ?? '', rule.tradeInNote ?? '', ...rule.disclaimers, ...rule.faqs.map((f) => `${f.question} ${f.answer}`)].join(' ');

describe('Mississippi re-check and ruling (November 2026)', () => {
  it('5% casual sales tax, $9 title, $29 car and $22 motorcycle registration', () => {
    const b = calc(ms);
    expect(b.exciseTax).toBe(750);
    expect(b.titleFee).toBe(9);
    expect(b.registrationTotal).toBe(29);
    expect(calc(ms, { vehicleType: 'motorcycle' }).registrationTotal).toBe(22);
    expect(copy(ms)).toContain('$22.00 for a motorcycle (the privilege tax is $8.00)');
  });

  it('EV and hybrid fees and their disclosure are unchanged', () => {
    expect(ms.registration.evSurchargeAnnual).toBe(150);
    expect(ms.registration.phevSurchargeAnnual).toBe(75);
    expect(copy(ms)).toContain('The law raises them each July for inflation, and the county figure may be higher');
  });

  it('no casual sales tax at 10 or more model years old, the current model year counting as year 1', () => {
    expect(calc(ms, { vehicleYear: 2018 }).exciseTax).toBe(750); // year 9
    const b = calc(ms, { vehicleYear: 2017 }); // year 10
    expect(b.exciseTax).toBe(0);
    expect(b.itemizedList[0].description).toContain('No casual sales tax on a vehicle 10 or more model years old');
    expect(calc(ms, { vehicleYear: 2017, vehicleType: 'motorcycle' }).exciseTax).toBe(0);
    expect(calc(ms, { vehicleYear: 2017 }).totalFirstYearCost).toBe(38);
    expect(copy(ms)).toContain('the estimate uses the model year, counting the current model year as year 1');
    expect(ms.lastVerified).toBe('November 2026');
  });

  it('deadline, family, and out-of-state answers are the verified ones', () => {
    const text = copy(ms);
    for (const fact of ['30 business days', '48 hours', '$250 penalty', 'New residents have 30 days', 'or siblings', '3.02.104', 'not credited']) expect(text).toContain(fact);
  });
});

describe('New Mexico re-check and rulings (November 2026)', () => {
  it('4% MVET with the trade-in deducted; registration $76, then $62.25; motorcycle $23.50', () => {
    expect(calc(nm).exciseTax).toBe(600);
    expect(calc(nm, { tradeInValue: 5000 }).exciseTax).toBe(400);
    expect(calc(nm, { vehicleYear: 2024 }).registrationTotal).toBe(76);
    expect(calc(nm, { vehicleYear: 2020 }).registrationTotal).toBe(62.25);
    expect(calc(nm, { vehicleType: 'motorcycle' }).registrationTotal).toBe(23.5);
    expect(copy(nm)).toContain('a $2 administrative fee, a $2 insurance enforcement fee, a $0.50 beautification fee, and a $1.50 tire recycling fee');
    expect(nm.lastVerified).toBe('November 2026');
  });

  it('the January 2027 EV and plug-in hybrid fees stay out of the live estimate', () => {
    expect(nm.registration.evSurchargeAnnual).toBeUndefined();
    expect(nm.registration.phevSurchargeAnnual).toBeUndefined();
    expect(copy(nm)).toContain('From January 1, 2027');
  });

  it('NADA, gift, deadline, and out-of-state answers are the verified ones', () => {
    const text = copy(nm);
    for (const fact of ['80% of the NADA average trade-in value', 'MVD-10208', 'MVD-10018', 'notarized', '30 calendar days', '$20 late transfer fee', '50% penalty', 'at least 30 days before moving', 'VIN inspection']) expect(text).toContain(fact);
    expect(text).not.toContain('condition affidavit');
  });
});

describe('Nebraska re-check and rulings (November 2026)', () => {
  it('5.5% state tax plus the 0% to 2.0% local range; $10 title and $7 lien', () => {
    const b = calc(ne);
    expect(b.exciseTax).toBe(825);
    expect(b.localTaxMin).toBe(0);
    expect(b.localTaxMax).toBe(300);
    expect(b.titleFee).toBe(10);
    expect(calc(ne, { isFinanced: true }).lienFilingFee).toBe(7);
    expect(copy(ne)).toContain('5.5% to 7.5%');
    expect(copy(ne)).not.toContain('8.0%');
  });

  it('the settled alternative fuel fees stand: $150 EV, $75 plug-in hybrid, $75 motorcycle', () => {
    expect(ne.registration.evSurchargeAnnual).toBe(150);
    expect(ne.registration.phevSurchargeAnnual).toBe(75);
    expect(ne.registration.motorcycleFuelFees).toEqual({ ev: { outcome: 'charged', amount: 75 }, phev: { outcome: 'charged', amount: 75 } });
  });

  it('registration: car $28.70 with new plates, motorcycle $15.60; verified November 2026', () => {
    expect(calc(ne, { vehicleType: 'motorcycle' }).registrationTotal).toBe(15.6);
    const car = calc(ne, { vehicleYear: 2010, listPrice: 30000 });
    expect(car.registrationTotal).toBe(Math.round((28.7 + (car.annualValueTax ?? 0)) * 100) / 100);
    expect(copy(ne)).toContain('$28.70 for a car with new plates');
    expect(ne.lastVerified).toBe('November 2026');
  });

  it('private trade-ins of a motor vehicle, motorboat, or ATV/UTV at the time of sale are deducted', () => {
    expect(ne.tradeInDeductible).toBe(true);
    expect(calc(ne, { tradeInValue: 5000 }).exciseTax).toBe(550);
    expect(ne.tradeInNote).toContain('motor vehicle, motorboat, or ATV/UTV, traded at the time of the sale');
    expect(copy(ne)).not.toMatch(/dealers only|restricted to purchases from licensed motor vehicle dealers|not permitted on private-party/i);
  });

  it('gift, deadline, and out-of-state answers are the verified ones', () => {
    const text = copy(ne);
    for (const fact of ['paid sales tax on the original purchase', 'trust', 'within 30 days of the purchase', 'Form 6', 'credited', 'sheriff’s inspection', 'licensed in another state']) expect(text).toContain(fact);
  });
});

describe('Sources after batch 13', () => {
  it('no hidden or homepage-only links remain for the three states, and each has a repair note', () => {
    for (const [key, rule] of [['mississippi', ms], ['new-mexico', nm], ['nebraska', ne]] as const) {
      expect((sourceLinkStatus.hidden as { state: string; url: string; finding: string }[]).some((h) => h.state === key)).toBe(false);
      expect(sourceLinkStatus.homepageOnly.some((h) => h.state === key)).toBe(false);
      expect(sourceLinkStatus.repaired.some((r) => r.state === key && r.on === '2026-11-15')).toBe(true);
      expect(getVisibleSources(rule)).toHaveLength(rule.sources.length);
    }
    expect(ms.sources).not.toContain('https://www.dor.ms.gov');
    expect(nm.sources).not.toContain('https://www.mvd.newmexico.gov/vehicles/taxes-fees/');
    expect(ne.sources).not.toContain('https://dmv.nebraska.gov/dvr/title/motor-vehicle-titling');
  });
});
