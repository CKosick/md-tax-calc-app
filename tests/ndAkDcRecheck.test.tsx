import { describe, it, expect } from 'vitest';
import { calculateVehicleCosts } from '../src/lib/calculator';
import { getDefaultInputs } from '../src/lib/shareParams';
import { getVisibleSources, labelForSource } from '../src/lib/sources';
import stateRulesData from '../src/config/stateRules.json';
import sourceLinkStatus from '../src/config/sourceLinkStatus.json';
import { CalculatorInputs, StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const nd = rules['north-dakota'] as StateRule;
const ak = rules.alaska as StateRule;
const dc = rules['district-of-columbia'] as StateRule;
const calc = (rule: StateRule, extra: Partial<CalculatorInputs> = {}) =>
  calculateVehicleCosts(rule, { ...getDefaultInputs(rule, 2026), purchasePrice: 15000, ...extra }, 2026);
const copy = (rule: StateRule) =>
  [rule.localTaxNote ?? '', rule.tradeInNote ?? '', ...rule.disclaimers, ...rule.faqs.map((f) => `${f.question} ${f.answer}`)].join(' ');

describe('North Dakota re-check and ruling (November 2026)', () => {
  it('5% excise; $5 title; registration by year first registered for 3,200 to 4,499 lbs (N.D.C.C. 39-04-19)', () => {
    expect(calc(nd).exciseTax).toBe(750);
    expect(calc(nd).titleFee).toBe(5);
    expect(calc(nd, { vehicleYear: 2026 }).registrationTotal).toBe(93); // year 1
    expect(calc(nd, { vehicleYear: 2021 }).registrationTotal).toBe(93); // year 6
    expect(calc(nd, { vehicleYear: 2020 }).registrationTotal).toBe(81); // year 7
    expect(calc(nd, { vehicleYear: 2018 }).registrationTotal).toBe(81); // year 9
    expect(calc(nd, { vehicleYear: 2017 }).registrationTotal).toBe(69); // year 10
    expect(calc(nd, { vehicleYear: 2015 }).registrationTotal).toBe(69); // year 12
    expect(calc(nd, { vehicleYear: 2014 }).registrationTotal).toBe(57); // year 13
  });

  it('motorcycle $25 ($15 + $10 safety education fee); settled EV items confirmed, not reopened', () => {
    expect(calc(nd, { vehicleType: 'motorcycle' }).registrationTotal).toBe(25);
    expect(calc(nd, { vehicleType: 'motorcycle', fuelType: 'ev' }).registrationTotal).toBe(45); // separate $20, 39-04-19.2(1)(c)
    expect(calc(nd, { vehicleType: 'motorcycle', fuelType: 'phev' }).registrationTotal).toBe(25); // still unanswered, left out
    expect(nd.registration.motorcycleFuelFees).toEqual({ ev: { outcome: 'charged', amount: 20 }, phev: { outcome: 'silent' } });
    expect(copy(nd)).toContain('confirmed in writing on November 9, 2026');
    expect(copy(nd)).toContain('do not say whether the $50 plug-in hybrid fee applies to motorcycles');
    expect(calc(nd, { vehicleYear: 2021, fuelType: 'ev' }).registrationTotal).toBe(213);
    expect(calc(nd, { vehicleYear: 2021, fuelType: 'phev' }).registrationTotal).toBe(143);
  });

  it('private trade-ins are deductible (57-40.3-01(5)); states the verified gift, credit, and deadline answers; verified November 2026', () => {
    expect(calc(nd, { tradeInValue: 5000 }).exciseTax).toBe(500); // 5% of $15,000 - $5,000
    expect(nd.tradeInDeductible).toBe(true);
    expect(copy(nd)).toContain('on a private sale as well as a dealer sale');
    expect(copy(nd)).not.toMatch(/limited to dealer|restricted to transactions with licensed|SFN 2872/);
    const text = copy(nd);
    for (const fact of ['grandparent and grandchild', 'NADA used car guide', '57-40.3-09', 'Alaska, Delaware, Georgia, Montana, New Hampshire, and Oregon', 'within 30 days of receiving it', '39-05-17', 'year first registered', '$1.50 abandoned motor vehicle disposal fee']) expect(text).toContain(fact);
    expect(nd.lastVerified).toBe('November 2026');
    expect(labelForSource('https://ndlegis.gov/cencode/t57c40-3.pdf')).toBe('ndlegis.gov: N.D.C.C. Chapter 57-40.3');
    expect(labelForSource('https://ndlegis.gov/cencode/t39c05.pdf')).toBe('ndlegis.gov: N.D.C.C. Chapter 39-05');
  });
});

describe('Alaska re-check and ruling (November 2026)', () => {
  it('no state tax; $15 title and lien; $100 two-year registration and $60 motorcycle (AS 28.10.421)', () => {
    expect(calc(ak).exciseTax).toBe(0);
    expect(calc(ak).titleFee).toBe(15);
    expect(calc(ak, { isFinanced: true }).lienFilingFee).toBe(15);
    expect(calc(ak).registrationTotal).toBe(100);
    expect(calc(ak, { vehicleType: 'motorcycle' }).registrationTotal).toBe(60);
  });

  it('discloses the municipal registration tax with the state range, outside the total', () => {
    const text = copy(ak);
    for (const fact of ['$16 to $300', 'AS 28.10.431', 'not included in the estimate', 'not collected again when a vehicle changes owners', '$4 to $40']) expect(text).toContain(fact);
    expect(text).not.toContain('Fairbanks');
    expect(calc(ak, { vehicleYear: 2026 }).registrationTotal).toBe(100);
  });

  it('states the verified deadline, nonresident, in-person fee, and senior answers; full $100 kept with the transfer disclosure; verified November 2026', () => {
    const text = copy(ak);
    for (const fact of ['Within 30 days', 'AS 28.10.321', 'within 10 days', 'up to 60 days', 'AS 28.10.121', 'adds $10', 'keeps its expiration month', '65 or older']) expect(text).toContain(fact);
    expect(ak.lastVerified).toBe('November 2026');
  });
});

describe('District of Columbia re-check and ruling (November 2026)', () => {
  it('5.0% of fair market value; $30 title; $20 lien; registration $70 and $175 a year from March 30, 2026; motorcycle $52', () => {
    expect(calc(dc).exciseTax).toBe(750);
    expect(calc(dc, { tradeInValue: 5000 }).exciseTax).toBe(750);
    expect(calc(dc).titleFee).toBe(30);
    expect(calc(dc, { isFinanced: true }).lienFilingFee).toBe(20);
    expect(calc(dc, { registrationTerm: 1, weightClass: 'under3700lbs' }).registrationTotal).toBe(70);
    expect(calc(dc, { registrationTerm: 1, weightClass: 'over3700lbs' }).registrationTotal).toBe(175);
    expect(calc(dc, { registrationTerm: 2, weightClass: 'over3700lbs' }).registrationTotal).toBe(350);
    expect(calc(dc, { vehicleType: 'motorcycle', registrationTerm: 1 }).registrationTotal).toBe(52);
    expect(dc.registration.passengerWeightSplitLbs).toBe(3500);
  });

  it('keeps the DMV’s NADA wording and states the weight and MPG table, gift exemptions, and deadlines; inspection fee disclosed, not added; verified November 2026', () => {
    const text = copy(dc);
    for (const fact of ['NADA Eastern Region', '3,499 lbs or less with 21 to 25 city MPG', 'from 1.0% to 11.0%', 'already has a DC title', 'domestic partners', '60 calendar days', '45-day temporary registration', 'five-day temporary tag', '$35 two-year inspection fee', '$40 registration']) expect(text).toContain(fact);
    expect(text).not.toContain('$26');
    expect(text).not.toContain('$115');
    expect(dc.lastVerified).toBe('November 2026');
    expect(calc(dc, { registrationTerm: 2, weightClass: 'under3700lbs' }).registrationTotal).toBe(140); // no $35 inspection fee added
    expect(labelForSource('https://code.dccouncil.gov/us/dc/council/code/sections/50-2201.03')).toBe('code.dccouncil.gov: D.C. Code 50-2201.03');
  });
});

describe('Sources after batch 17', () => {
  it('no hidden or homepage-only links remain for the three jurisdictions, and each has a repair note', () => {
    for (const [key, rule] of [['north-dakota', nd], ['alaska', ak], ['district-of-columbia', dc]] as const) {
      expect((sourceLinkStatus.hidden as { state: string; url: string; finding: string }[]).some((h) => h.state === key)).toBe(false);
      expect(sourceLinkStatus.homepageOnly.some((h) => h.state === key)).toBe(false);
      expect(sourceLinkStatus.repaired.some((r) => r.state === key && r.on === '2026-11-20')).toBe(true);
      expect(getVisibleSources(rule)).toHaveLength(rule.sources.length);
    }
    expect(dc.sources.some((u) => u.endsWith('/service/vehicle-excise-tax') || u.endsWith('/service/vehicle-registration-fees'))).toBe(false);
  });
});
