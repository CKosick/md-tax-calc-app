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
const mississippi = rules.mississippi as StateRule;
const calc = (rule: StateRule, extra: Partial<CalculatorInputs> = {}) =>
  calculateVehicleCosts(rule, { ...getDefaultInputs(rule, 2026), purchasePrice: 15000, ...extra }, 2026);
const copy = (rule: StateRule) =>
  [rule.localTaxNote ?? '', rule.tradeInNote ?? '', ...rule.disclaimers, ...rule.faqs.map((f) => `${f.question} ${f.answer}`)].join(' ');

describe('Montana re-check and ruling (November 2026)', () => {
  it('no tax; every MVD fee includes the 3% administrative fee (MCA 61-3-111): title, lien, registration by age, motorcycle', () => {
    expect(calc(mt).exciseTax).toBe(0);
    expect(calc(mt).titleFee).toBe(12.36);
    expect(calc(mt, { isFinanced: true }).lienFilingFee).toBe(8.24); // $8 x 1.03
    expect(calc(mt, { vehicleYear: 2022 }).registrationTotal).toBe(246.17); // age 4: ($217 + $10 + $12) x 1.03
    expect(calc(mt, { vehicleYear: 2021 }).registrationTotal).toBe(112.27); // age 5: ($87 + $10 + $12) x 1.03
    expect(calc(mt, { vehicleYear: 2016 }).registrationTotal).toBe(112.27); // age 10
    expect(calc(mt, { vehicleYear: 2015 }).registrationTotal).toBe(51.5); // age 11: ($28 + $10 + $12) x 1.03
  });

  it('motorcycle $93.99 once; EV $133.90 and plug-in hybrid $72.10 ($130 and $70 plus 3%) on cars only', () => {
    expect(calc(mt, { vehicleType: 'motorcycle' }).registrationTotal).toBe(93.99); // $91.25 x 1.03
    expect(calc(mt, { vehicleType: 'motorcycle', fuelType: 'ev' }).registrationTotal).toBe(93.99);
    expect(calc(mt, { vehicleYear: 2021, fuelType: 'ev' }).registrationTotal).toBe(246.17); // $112.27 + $133.90
    expect(calc(mt, { vehicleYear: 2021, fuelType: 'phev' }).registrationTotal).toBe(184.37); // $112.27 + $72.10
    expect(calc(mt, { vehicleYear: 2021, fuelType: 'ev' }).evSurcharge).toBe(133.9);
    expect(calc(mt, { vehicleYear: 2021, fuelType: 'phev' }).evSurcharge).toBe(72.1);
  });

  it('says the 3% is included and the rounding may differ; discloses county option tax, parks fee, and permanent registration; verified November 2026', () => {
    const text = copy(mt);
    for (const fact of ['includes the 3% administrative fee (MCA 61-3-111)', 'may differ by a few cents', '$246.17, $112.27, or $51.50', 'MCA 61-3-537', 'MCA 61-3-321(19)', '$87.50', 'does not transfer to a buyer', 'MCA 61-3-321(2)(b)', 'Within 40 days', '40-day temporary registration permit', 'within 60 days']) expect(text).toContain(fact);
    expect(text).not.toContain('61-3-315');
    expect(text).not.toContain('The estimate does not include it');
    expect(text).not.toContain('shown without it');
    for (const fact of ['$133.90 and $72.10', 'title, lien, registration, motorcycle, and EV fees']) expect(text).toContain(fact);
    expect(mt.lastVerified).toBe('November 2026');
  });

  it('MCA links outside part 5 get citations too', () => {
    expect(labelForSource('https://mca.legmt.gov/bills/mca/title_0610/chapter_0030/part_0030/section_0210/0610-0030-0030-0210.html')).toBe('mca.legmt.gov: MCA 61-3-321');
    expect(labelForSource('https://mca.legmt.gov/bills/mca/title_0610/chapter_0030/part_0010/section_0110/0610-0030-0010-0110.html')).toBe('mca.legmt.gov: MCA 61-3-111');
    expect(labelForSource('https://mca.legmt.gov/bills/mca/title_0610/chapter_0030/part_0050/section_0370/0610-0030-0050-0370.html')).toBe('mca.legmt.gov: MCA 61-3-537');
  });
});

describe('Delaware re-check and ruling (November 2026)', () => {
  it('flat 5.25% document fee kept per the DMV, with trade-in credit and $8 minimum; $35 title; $20 lien; $40 and $15 registration', () => {
    expect(calc(de).exciseTax).toBe(787.5); // not the statute's $775 step schedule
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

  it('keeps the DMV’s NADA wording and the verified answers; the step schedule stays out of the copy; verified November 2026', () => {
    const text = copy(de);
    for (const fact of ['NADA average trade-in value, whichever is higher', 'Delaware-titled', 'MV347', '2 Del. Admin. Code 2266', 'grandparent', 'Within 30 days', '$35 late fee', 'within 60 days', 'within 90 days']) expect(text).toContain(fact);
    expect(text).not.toContain('4.25%');
    expect(text).not.toContain('$13.75');
    expect(de.lastVerified).toBe('November 2026');
    expect(labelForSource('https://dmv.de.gov/VehicleServices/titles/index.shtml?dc=ve_title_credit')).toBe('dmv.de.gov: vehicle credit');
    expect(labelForSource('https://delcode.delaware.gov/title21/c021/sc04/index.html')).toBe('delcode.delaware.gov: Del. Code Title 21, Chapter 21');
  });
});

describe('South Dakota re-check and rulings (November 2026)', () => {
  it('4% excise with private trade-in credit; $10 title and lien; registration by weight (SDCL 32-5-6) plus $4 in DOR fees', () => {
    expect(calc(sd).exciseTax).toBe(600);
    expect(calc(sd, { tradeInValue: 5000 }).exciseTax).toBe(400);
    expect(calc(sd).titleFee).toBe(10);
    expect(calc(sd, { isFinanced: true }).lienFilingFee).toBe(10);
    expect(calc(sd, { weightClass: 'under3700lbs', vehicleYear: 2020 }).registrationTotal).toBe(76);
    expect(calc(sd, { weightClass: 'over3700lbs', vehicleYear: 2020 }).registrationTotal).toBe(112);
    expect(sd.registration.passengerWeightSplitLbs).toBe(4000);
  });

  it('70% of the weight fee at 10 or more model years old (SDCL 32-5-30), applied after the tier; the $4 in fees and the EV fee are not reduced', () => {
    expect(calc(sd, { weightClass: 'under3700lbs', vehicleYear: 2017 }).registrationTotal).toBe(76); // age 9
    expect(calc(sd, { weightClass: 'under3700lbs', vehicleYear: 2016 }).registrationTotal).toBe(54.4); // age 10: $50.40 + $4
    expect(calc(sd, { weightClass: 'over3700lbs', vehicleYear: 2016 }).registrationTotal).toBe(79.6); // $75.60 + $4
    expect(calc(sd, { weightClass: 'under3700lbs', vehicleYear: 2016, fuelType: 'ev' }).registrationTotal).toBe(154.4);
    const line = calc(sd, { vehicleYear: 2016 }).itemizedList.find((i) => i.id === 'registration-fee')?.description;
    expect(line).toContain('70% for 10 or more model years old (SDCL 32-5-30)');
    expect(line).toContain('$2 technology, $1 solid waste, and $1 Highway Patrol fees ($4.00)');
  });

  it('motorcycle $21 (middle engine tier), 70% when older; an electric motorcycle pays the $24 top fee and no EV fee', () => {
    expect(calc(sd, { vehicleType: 'motorcycle', vehicleYear: 2020 }).registrationTotal).toBe(25);
    expect(calc(sd, { vehicleType: 'motorcycle', vehicleYear: 2016 }).registrationTotal).toBe(18.7); // $14.70 + $4
    expect(calc(sd, { vehicleType: 'motorcycle', vehicleYear: 2020, fuelType: 'ev' }).registrationTotal).toBe(28);
    expect(calc(sd, { vehicleType: 'motorcycle', vehicleYear: 2016, fuelType: 'ev' }).registrationTotal).toBe(20.8); // $16.80 + $4
    expect(calc(sd, { weightClass: 'under3700lbs', vehicleYear: 2020, fuelType: 'ev' }).registrationTotal).toBe(176);
  });

  it('no excise tax only when the vehicle is 11 or more model years old and sold for $2,500 or less before trade-in (SDCL 32-5B-2(12))', () => {
    expect(calc(sd, { vehicleYear: 2015, purchasePrice: 2500 }).exciseTax).toBe(0); // age 11, at the ceiling
    expect(calc(sd, { vehicleYear: 2015, purchasePrice: 2500, tradeInValue: 1000 }).exciseTax).toBe(0);
    expect(calc(sd, { vehicleYear: 2015, purchasePrice: 2600, tradeInValue: 500 }).exciseTax).toBe(84); // before trade-in counts
    expect(calc(sd, { vehicleYear: 2016, purchasePrice: 2000 }).exciseTax).toBe(80); // age 10
    expect(calc(mississippi, { vehicleYear: 2017, purchasePrice: 15000 }).exciseTax).toBe(0); // Mississippi unchanged: no ceiling
  });

  it('states both exemption conditions, the engine tiers, and the mailing fees left out; verified November 2026', () => {
    const text = copy(sd);
    for (const fact of ['SDCL 32-5B-2(12)', 'both conditions', '$18 under 350 cc', '$21 for 350 to 1,000 cc', '$24 over 1,000 cc', 'The estimate uses $21', 'SDCL 32-5-30', 'mailing fees vary with how you register', '32-5B-2(4)', 'SDCL 32-5B-11', 'Within 45 days', '$1 a week, up to $50']) expect(text).toContain(fact);
    expect(text).not.toContain('averages $42');
    expect(text).not.toContain('The calculator still shows the tax');
    expect(sd.lastVerified).toBe('November 2026');
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
