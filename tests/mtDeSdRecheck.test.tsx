import { describe, it, expect } from 'vitest';
import { calculateVehicleCosts } from '../src/lib/calculator';
import { getDefaultInputs } from '../src/lib/shareParams';
import { getVisibleSources, labelForSource } from '../src/lib/sources';
import stateRulesData from '../src/config/stateRules.json';
import sourceLinkStatus from '../src/config/sourceLinkStatus.json';
import { CalculatorInputs, StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const mt = rules.montana as StateRule;
const de = rules.delaware as StateRule;
const sd = rules['south-dakota'] as StateRule;
const calc = (rule: StateRule, extra: Partial<CalculatorInputs> = {}) =>
  calculateVehicleCosts(rule, { ...getDefaultInputs(rule, 2026), purchasePrice: 15000, ...extra }, 2026);
const copy = (rule: StateRule) =>
  [rule.localTaxNote ?? '', rule.tradeInNote ?? '', ...rule.disclaimers, ...rule.faqs.map((f) => `${f.question} ${f.answer}`)].join(' ');

describe('Montana re-check (November 2026, administrative fee for ruling)', () => {
  it('no tax; $12 title; $8 lien; registration by age (MCA 61-3-321) plus the $10 Highway Patrol and $12 plate fees', () => {
    expect(calc(mt).exciseTax).toBe(0);
    expect(calc(mt).titleFee).toBe(12);
    expect(calc(mt, { isFinanced: true }).lienFilingFee).toBe(8);
    expect(calc(mt, { vehicleYear: 2022 }).registrationTotal).toBe(239); // age 4: $217
    expect(calc(mt, { vehicleYear: 2021 }).registrationTotal).toBe(109); // age 5: $87
    expect(calc(mt, { vehicleYear: 2016 }).registrationTotal).toBe(109); // age 10: $87
    expect(calc(mt, { vehicleYear: 2015 }).registrationTotal).toBe(50); // age 11: $28
  });

  it('motorcycle $91.25 once (fee, safety, Highway Patrol, plate); EV $130 and plug-in hybrid $70 on cars only', () => {
    expect(calc(mt, { vehicleType: 'motorcycle' }).registrationTotal).toBe(91.25);
    expect(calc(mt, { vehicleType: 'motorcycle', fuelType: 'ev' }).registrationTotal).toBe(91.25);
    expect(calc(mt, { vehicleYear: 2021, fuelType: 'ev' }).registrationTotal).toBe(239);
    expect(calc(mt, { vehicleYear: 2021, fuelType: 'phev' }).registrationTotal).toBe(179);
  });

  it('discloses the county option tax, the 3% administrative fee, the opt-out parks fee, and permanent registration', () => {
    const text = copy(mt);
    for (const fact of ['MCA 61-3-537', '(MCA 61-3-111)', 'MCA 61-3-321(19)', '$87.50', 'does not transfer to a buyer', 'MCA 61-3-321(2)(b)', 'Within 40 days', '40-day temporary registration permit', 'within 60 days']) expect(text).toContain(fact);
    expect(text).not.toContain('61-3-315');
    expect(mt.lastVerified).toBe('September 2026');
  });

  it('MCA links outside part 5 get citations too', () => {
    expect(labelForSource('https://mca.legmt.gov/bills/mca/title_0610/chapter_0030/part_0030/section_0210/0610-0030-0030-0210.html')).toBe('mca.legmt.gov: MCA 61-3-321');
    expect(labelForSource('https://mca.legmt.gov/bills/mca/title_0610/chapter_0030/part_0010/section_0110/0610-0030-0010-0110.html')).toBe('mca.legmt.gov: MCA 61-3-111');
    expect(labelForSource('https://mca.legmt.gov/bills/mca/title_0610/chapter_0030/part_0050/section_0370/0610-0030-0050-0370.html')).toBe('mca.legmt.gov: MCA 61-3-537');
  });
});

describe('Delaware re-check (November 2026, fee schedule for ruling)', () => {
  it('5.25% document fee with trade-in credit and $8 minimum; $35 title; $20 lien; $40 and $15 registration', () => {
    expect(calc(de).exciseTax).toBe(787.5);
    expect(calc(de, { tradeInValue: 5000 }).exciseTax).toBe(525);
    expect(calc(de, { purchasePrice: 100 }).exciseTax).toBe(8);
    expect(calc(de).titleFee).toBe(35);
    expect(calc(de, { isFinanced: true }).lienFilingFee).toBe(20);
    expect(calc(de, { registrationTerm: 1 }).registrationTotal).toBe(40);
    expect(calc(de, { vehicleType: 'motorcycle', registrationTerm: 1 }).registrationTotal).toBe(15);
  });

  it('EV +$110 and plug-in hybrid +$85 a year (21 Del. C. 2151A); electric and hybrid motorcycles +$15', () => {
    expect(calc(de, { registrationTerm: 1, fuelType: 'ev' }).registrationTotal).toBe(150);
    expect(calc(de, { registrationTerm: 2, fuelType: 'ev' }).registrationTotal).toBe(300);
    expect(calc(de, { registrationTerm: 1, fuelType: 'phev' }).registrationTotal).toBe(125);
    expect(calc(de, { vehicleType: 'motorcycle', registrationTerm: 1, fuelType: 'ev' }).registrationTotal).toBe(30);
    expect(calc(de, { vehicleType: 'motorcycle', registrationTerm: 1, fuelType: 'phev' }).registrationTotal).toBe(30);
    expect(copy(de)).toContain('non-plug-in hybrid pays $60 a year');
  });

  it('keeps the DMV’s NADA wording and the verified answers; verified date held', () => {
    const text = copy(de);
    for (const fact of ['NADA average trade-in value, whichever is higher', 'Delaware-titled', 'MV347', '2 Del. Admin. Code 2266', 'grandparent', 'Within 30 days', '$35 late fee', 'within 60 days', 'within 90 days']) expect(text).toContain(fact);
    expect(text).not.toContain('4.25%');
    expect(de.lastVerified).toBe('September 2026');
    expect(labelForSource('https://dmv.de.gov/VehicleServices/titles/index.shtml?dc=ve_title_credit')).toBe('dmv.de.gov: vehicle credit');
    expect(labelForSource('https://delcode.delaware.gov/title21/c021/sc04/index.html')).toBe('delcode.delaware.gov: Del. Code Title 21, Chapter 21');
  });
});

describe('South Dakota re-check (November 2026, items for ruling)', () => {
  it('4% excise with private trade-in credit; $10 title and lien; registration by weight (SDCL 32-5-6)', () => {
    expect(calc(sd).exciseTax).toBe(600);
    expect(calc(sd, { tradeInValue: 5000 }).exciseTax).toBe(400);
    expect(calc(sd).titleFee).toBe(10);
    expect(calc(sd, { isFinanced: true }).lienFilingFee).toBe(10);
    expect(calc(sd, { weightClass: 'under3700lbs' }).registrationTotal).toBe(72);
    expect(calc(sd, { weightClass: 'over3700lbs' }).registrationTotal).toBe(108);
    expect(sd.registration.passengerWeightSplitLbs).toBe(4000);
  });

  it('EV $100 a year (SDCL 32-5-188); an electric motorcycle pays the $24 top motorcycle fee instead', () => {
    expect(calc(sd, { weightClass: 'under3700lbs', fuelType: 'ev' }).registrationTotal).toBe(172);
    expect(calc(sd, { vehicleType: 'motorcycle' }).registrationTotal).toBe(18);
    expect(calc(sd, { vehicleType: 'motorcycle', fuelType: 'ev' }).registrationTotal).toBe(24);
  });

  it('cites 32-5B-2(12) for the old-vehicle exemption and states the verified answers; verified date held', () => {
    const text = copy(sd);
    for (const fact of ['SDCL 32-5B-2(12)', '32-5B-2(4)', 'SDCL 32-5B-11', 'SDCL 32-5-30', 'Within 45 days', '$1 a week, up to $50', 'SDCL 32-5-9']) expect(text).toContain(fact);
    expect(text).not.toContain('32-5B-2(1),');
    expect(text).not.toContain('averages $42');
    expect(sd.lastVerified).toBe('September 2026');
  });
});

describe('Sources after batch 16', () => {
  it('no hidden or homepage-only links remain for the three states, and each has a repair note', () => {
    for (const [key, rule] of [['montana', mt], ['delaware', de], ['south-dakota', sd]] as const) {
      expect(sourceLinkStatus.hidden.some((h) => h.state === key)).toBe(false);
      expect(sourceLinkStatus.homepageOnly.some((h) => h.state === key)).toBe(false);
      expect(sourceLinkStatus.repaired.some((r) => r.state === key && r.on === '2026-11-19')).toBe(true);
      expect(getVisibleSources(rule)).toHaveLength(rule.sources.length);
      expect(rule.sources.some((u) => u.includes('veh_title_fees') || u === 'https://mvdmt.gov' || u === 'https://dor.sd.gov/individuals/motor-vehicle')).toBe(false);
    }
  });
});
