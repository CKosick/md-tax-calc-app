import { describe, it, expect } from 'vitest';
import { calculateVehicleCosts } from '../src/lib/calculator';
import stateRulesData from '../src/config/stateRules.json';
import { CalculatorInputs, StateRule } from '../src/lib/types';

const allRules = stateRulesData as Record<string, StateRule>;
const mdRule = allRules.maryland;
const vaRule = allRules.virginia;
const paRule = allRules.pennsylvania;
const deRule = allRules.delaware;
const dcRule = allRules['district-of-columbia'];

describe('Maryland Private-Party Vehicle Tax Calculator', () => {
  it('§3 worked acceptance example: $15,000 car, 2019 model year, passenger <= 3,700 lbs, 2-year registration, cash purchase', () => {
    const inputs: CalculatorInputs = {
      state: 'maryland',
      vehicleType: 'passenger',
      purchasePrice: 15000,
      vehicleYear: 2019,
      weightClass: 'under3700lbs',
      fuelType: 'gasoline',
      registrationTerm: 2,
      isFinanced: false,
      tradeInValue: 0
    };

    const result = calculateVehicleCosts(mdRule, inputs, 2026);

    // 1. Excise tax: 15000 * 0.065 = 975.00
    expect(result.exciseTax).toBe(975.00);

    // 2. Title fee: 200.00
    expect(result.titleFee).toBe(200.00);

    // 3. Lien filing fee: 0.00 (cash purchase)
    expect(result.lienFilingFee).toBe(0.00);

    // 4. Registration fee: 2-year passenger <= 3,700 lbs = 251.00
    const expectedReg = (mdRule.registration.passenger.under3700lbs as Record<string, number>)['2'];
    expect(result.baseRegistrationFee).toBe(expectedReg);
    expect(result.registrationTotal).toBe(expectedReg);

    // 5. Total first-year out-of-pocket cost = 975 + 200 + 0 + 251 = 1426.00
    const expectedTotal = 975.00 + 200.00 + 0.00 + expectedReg;
    expect(result.totalFirstYearCost).toBe(expectedTotal);

    // Book value warning should trigger because 2026 - 2019 = 7 years (<= 7 years)
    expect(result.bookValueApplies).toBe(true);
  });

  it('acceptance criterion: Trade-in input does NOT reduce the Maryland excise total or first-year total', () => {
    const baseInputs: CalculatorInputs = {
      state: 'maryland',
      vehicleType: 'passenger',
      purchasePrice: 20000,
      vehicleYear: 2020,
      weightClass: 'under3700lbs',
      fuelType: 'gasoline',
      registrationTerm: 2,
      isFinanced: false,
      tradeInValue: 0
    };

    const withTradeInInputs: CalculatorInputs = {
      ...baseInputs,
      tradeInValue: 6000
    };

    const withoutTrade = calculateVehicleCosts(mdRule, baseInputs, 2026);
    const withTrade = calculateVehicleCosts(mdRule, withTradeInInputs, 2026);

    expect(withTrade.exciseTax).toBe(withoutTrade.exciseTax);
    expect(withTrade.exciseTax).toBe(20000 * 0.065);
    expect(withTrade.totalFirstYearCost).toBe(withoutTrade.totalFirstYearCost);
    expect(withTrade.tradeInIgnored).toBe(true);
    expect(withTrade.tradeInDeducted).toBe(0);
  });

  it('finances toggle: adds $40 lien filing fee only when financed', () => {
    const cashInputs: CalculatorInputs = {
      state: 'maryland',
      vehicleType: 'passenger',
      purchasePrice: 10000,
      vehicleYear: 2021,
      weightClass: 'under3700lbs',
      fuelType: 'gasoline',
      registrationTerm: 1,
      isFinanced: false,
      tradeInValue: 0
    };

    const financedInputs: CalculatorInputs = {
      ...cashInputs,
      isFinanced: true
    };

    const cashResult = calculateVehicleCosts(mdRule, cashInputs, 2026);
    const financedResult = calculateVehicleCosts(mdRule, financedInputs, 2026);

    expect(cashResult.lienFilingFee).toBe(0);
    expect(financedResult.lienFilingFee).toBe(40);
    expect(financedResult.totalFirstYearCost - cashResult.totalFirstYearCost).toBe(40);
  });
});

describe('Phase 2 Mid-Atlantic 5-State Worked Acceptance Tests', () => {
  const standardVehicle: Omit<CalculatorInputs, 'state'> = {
    vehicleType: 'passenger',
    purchasePrice: 15000,
    vehicleYear: 2019,
    weightClass: 'under3700lbs',
    fuelType: 'gasoline',
    registrationTerm: 2,
    isFinanced: false,
    tradeInValue: 0
  };

  it('Maryland: exact worked test ($15,000 -> $1,426.00)', () => {
    const result = calculateVehicleCosts(mdRule, { ...standardVehicle, state: 'maryland' }, 2026);
    expect(result.exciseTax).toBe(975.00); // 6.5% of 15000
    expect(result.titleFee).toBe(200.00);
    expect(result.lienFilingFee).toBe(0.00);
    expect(result.registrationTotal).toBe(251.00);
    expect(result.totalFirstYearCost).toBe(1426.00);
  });

  it('Virginia: exact worked test ($15,000 -> $697.00)', () => {
    const result = calculateVehicleCosts(vaRule, { ...standardVehicle, state: 'virginia' }, 2026);
    expect(result.exciseTax).toBe(622.50); // 4.15% of 15000
    expect(result.titleFee).toBe(15.00);
    expect(result.lienFilingFee).toBe(0.00);
    expect(result.registrationTotal).toBe(59.50); // 2-year passenger <= 4k lbs
    expect(result.totalFirstYearCost).toBe(697.00);
  });

  it('Pennsylvania: exact worked test ($15,000 -> $1,068.00)', () => {
    const result = calculateVehicleCosts(paRule, { ...standardVehicle, state: 'pennsylvania' }, 2026);
    expect(result.exciseTax).toBe(900.00); // 6.0% of 15000
    expect(result.titleFee).toBe(72.00); // PennDOT Form MV-70S verified
    expect(result.lienFilingFee).toBe(0.00);
    expect(result.registrationTotal).toBe(96.00); // 2-year passenger flat $48/yr
    expect(result.totalFirstYearCost).toBe(1068.00);
  });

  it('Delaware: exact worked test ($15,000 -> $902.50)', () => {
    const result = calculateVehicleCosts(deRule, { ...standardVehicle, state: 'delaware' }, 2026);
    expect(result.exciseTax).toBe(787.50); // 5.25% doc fee of 15000
    expect(result.titleFee).toBe(35.00);
    expect(result.lienFilingFee).toBe(0.00);
    expect(result.registrationTotal).toBe(80.00); // 2-year passenger $40/yr
    expect(result.totalFirstYearCost).toBe(902.50);
  });

  it('District of Columbia: exact worked test ($15,000 -> $920.00)', () => {
    const result = calculateVehicleCosts(dcRule, { ...standardVehicle, state: 'district-of-columbia' }, 2026);
    expect(result.exciseTax).toBe(750.00); // 5.0% baseline FMV
    expect(result.titleFee).toBe(26.00);
    expect(result.lienFilingFee).toBe(0.00);
    expect(result.registrationTotal).toBe(144.00); // 2-year Class I $72/yr
    expect(result.totalFirstYearCost).toBe(920.00);
  });

  it('acceptance criterion: Trade-in deduction works both ways (proves both-ways logic)', () => {
    const baseInput = { ...standardVehicle };
    const tradeInput = { ...standardVehicle, tradeInValue: 5000 };

    // 1. Delaware allows trade-in deduction
    const deBase = calculateVehicleCosts(deRule, { ...baseInput, state: 'delaware' }, 2026);
    const deWithTrade = calculateVehicleCosts(deRule, { ...tradeInput, state: 'delaware' }, 2026);

    // Taxable base is reduced by 5,000 ($10,000 taxable)
    expect(deWithTrade.tradeInDeducted).toBe(5000);
    expect(deWithTrade.tradeInIgnored).toBe(false);
    expect(deWithTrade.exciseTax).toBe(10000 * 0.0525); // 525.00
    expect(deBase.exciseTax - deWithTrade.exciseTax).toBe(5000 * 0.0525); // exactly 262.50 tax savings
    expect(deWithTrade.totalFirstYearCost).toBe(525.00 + 35.00 + 0.00 + 80.00); // 640.00

    // 2. Maryland does NOT allow trade-in deduction
    const mdBase = calculateVehicleCosts(mdRule, { ...baseInput, state: 'maryland' }, 2026);
    const mdWithTrade = calculateVehicleCosts(mdRule, { ...tradeInput, state: 'maryland' }, 2026);

    expect(mdWithTrade.tradeInDeducted).toBe(0);
    expect(mdWithTrade.tradeInIgnored).toBe(true);
    expect(mdWithTrade.exciseTax).toBe(mdBase.exciseTax); // 975.00 unchanged
    expect(mdWithTrade.totalFirstYearCost).toBe(mdBase.totalFirstYearCost); // 1426.00 unchanged

    // 3. Virginia does NOT allow trade-in deduction on private sales
    const vaWithTrade = calculateVehicleCosts(vaRule, { ...tradeInput, state: 'virginia' }, 2026);
    expect(vaWithTrade.tradeInIgnored).toBe(true);
    expect(vaWithTrade.exciseTax).toBe(622.50);

    // 4. Pennsylvania does NOT allow trade-in deduction on private sales
    const paWithTrade = calculateVehicleCosts(paRule, { ...tradeInput, state: 'pennsylvania' }, 2026);
    expect(paWithTrade.tradeInIgnored).toBe(true);
    expect(paWithTrade.exciseTax).toBe(900.00);

    // 5. DC assesses NADA FMV, ignoring trade-in
    const dcWithTrade = calculateVehicleCosts(dcRule, { ...tradeInput, state: 'district-of-columbia' }, 2026);
    expect(dcWithTrade.tradeInIgnored).toBe(true);
    expect(dcWithTrade.exciseTax).toBe(750.00);
  });
});

describe('Batch 1 (Mega-States) Worked Acceptance Tests ($15,000 baseline)', () => {
  const std1Yr: Omit<CalculatorInputs, 'state'> = {
    vehicleType: 'passenger',
    purchasePrice: 15000,
    vehicleYear: 2019,
    weightClass: 'under3700lbs',
    fuelType: 'gasoline',
    registrationTerm: 1,
    isFinanced: false,
    tradeInValue: 0
  };

  const std2Yr: Omit<CalculatorInputs, 'state'> = {
    ...std1Yr,
    registrationTerm: 2
  };

  it('California: exact worked test ($15,000 -> $1,222.50)', () => {
    const rule = allRules.california;
    const res = calculateVehicleCosts(rule, { ...std1Yr, state: 'california' }, 2026);
    expect(res.exciseTax).toBe(1087.50); // 7.25% of 15000
    expect(res.titleFee).toBe(29.00);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(106.00); // 74 base + 32 CHP
    expect(res.totalFirstYearCost).toBe(1222.50);
  });

  it('Texas: exact worked test ($15,000 -> $1,022.25)', () => {
    const rule = allRules.texas;
    const res = calculateVehicleCosts(rule, { ...std1Yr, state: 'texas' }, 2026);
    expect(res.exciseTax).toBe(937.50); // 6.25% of 15000
    expect(res.titleFee).toBe(33.00);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(51.75);
    expect(res.totalFirstYearCost).toBe(1022.25);
  });

  it('Florida: exact worked test ($15,000 -> $1,002.85)', () => {
    const rule = allRules.florida;
    const res = calculateVehicleCosts(rule, { ...std1Yr, state: 'florida' }, 2026);
    expect(res.exciseTax).toBe(900.00); // 6.0% of 15000
    expect(res.titleFee).toBe(75.25);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(27.60);
    expect(res.totalFirstYearCost).toBe(1002.85);
  });

  it('New York: exact worked test ($15,000 -> $718.00, 2-yr term)', () => {
    const rule = allRules['new-york'];
    const res = calculateVehicleCosts(rule, { ...std2Yr, state: 'new-york' }, 2026);
    expect(res.exciseTax).toBe(600.00); // 4.0% of 15000
    expect(res.titleFee).toBe(50.00);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(68.00); // 2-year passenger <= 3700 lbs
    expect(res.totalFirstYearCost).toBe(718.00);
  });

  it('Illinois: exact worked test ($15,000 -> $1,166.00)', () => {
    const rule = allRules.illinois;
    const res = calculateVehicleCosts(rule, { ...std1Yr, state: 'illinois' }, 2026);
    expect(res.exciseTax).toBe(850.00); // Form RUT-50 Table B: $15,000–$19,999.99
    expect(res.titleFee).toBe(165.00);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(151.00);
    expect(res.totalFirstYearCost).toBe(1166.00);
    expect(res.itemizedList[0].label).toContain('Form RUT-50 Table');
    expect(res.itemizedList[0].description).toContain('Table B');
  });

  it('Illinois Form RUT-50: verifies Table B price brackets', () => {
    const rule = allRules.illinois;
    // $20k–$25k -> $1,100
    expect(calculateVehicleCosts(rule, { ...std1Yr, purchasePrice: 22000, state: 'illinois' }, 2026).exciseTax).toBe(1100);
    // $25k–$30k -> $1,350
    expect(calculateVehicleCosts(rule, { ...std1Yr, purchasePrice: 27000, state: 'illinois' }, 2026).exciseTax).toBe(1350);
    // $30k–$50k -> $1,600
    expect(calculateVehicleCosts(rule, { ...std1Yr, purchasePrice: 35000, state: 'illinois' }, 2026).exciseTax).toBe(1600);
    // $50k–$100k -> $2,600
    expect(calculateVehicleCosts(rule, { ...std1Yr, purchasePrice: 75000, state: 'illinois' }, 2026).exciseTax).toBe(2600);
    // $100k–$1M -> $5,100
    expect(calculateVehicleCosts(rule, { ...std1Yr, purchasePrice: 250000, state: 'illinois' }, 2026).exciseTax).toBe(5100);
    // $1M+ -> $10,100
    expect(calculateVehicleCosts(rule, { ...std1Yr, purchasePrice: 1500000, state: 'illinois' }, 2026).exciseTax).toBe(10100);
  });

  it('Illinois Form RUT-50: verifies Table A vehicle age brackets for price < $15k', () => {
    const rule = allRules.illinois;
    const base = { ...std1Yr, purchasePrice: 10000, state: 'illinois' };

    // <= 1 yr -> $465
    expect(calculateVehicleCosts(rule, { ...base, vehicleYear: 2026 }, 2026).exciseTax).toBe(465);
    expect(calculateVehicleCosts(rule, { ...base, vehicleYear: 2025 }, 2026).exciseTax).toBe(465);
    // 2 yrs -> $365
    expect(calculateVehicleCosts(rule, { ...base, vehicleYear: 2024 }, 2026).exciseTax).toBe(365);
    // 3 yrs -> $290
    expect(calculateVehicleCosts(rule, { ...base, vehicleYear: 2023 }, 2026).exciseTax).toBe(290);
    // 4 yrs -> $240
    expect(calculateVehicleCosts(rule, { ...base, vehicleYear: 2022 }, 2026).exciseTax).toBe(240);
    // 5 yrs -> $190
    expect(calculateVehicleCosts(rule, { ...base, vehicleYear: 2021 }, 2026).exciseTax).toBe(190);
    // 6 yrs -> $165
    expect(calculateVehicleCosts(rule, { ...base, vehicleYear: 2020 }, 2026).exciseTax).toBe(165);
    // 7 yrs -> $155
    expect(calculateVehicleCosts(rule, { ...base, vehicleYear: 2019 }, 2026).exciseTax).toBe(155);
    // 8 yrs -> $140
    expect(calculateVehicleCosts(rule, { ...base, vehicleYear: 2018 }, 2026).exciseTax).toBe(140);
    // 9 yrs -> $125
    expect(calculateVehicleCosts(rule, { ...base, vehicleYear: 2017 }, 2026).exciseTax).toBe(125);
    // 10 yrs -> $115
    expect(calculateVehicleCosts(rule, { ...base, vehicleYear: 2016 }, 2026).exciseTax).toBe(115);
    // 11+ yrs -> $100
    expect(calculateVehicleCosts(rule, { ...base, vehicleYear: 2015 }, 2026).exciseTax).toBe(100);
    expect(calculateVehicleCosts(rule, { ...base, vehicleYear: 2005 }, 2026).exciseTax).toBe(100);

    // $0 purchase price -> $0 tax
    expect(calculateVehicleCosts(rule, { ...base, purchasePrice: 0 }, 2026).exciseTax).toBe(0);
  });

  it('Ohio: exact worked test ($15,000 -> $912.00)', () => {
    const rule = allRules.ohio;
    const res = calculateVehicleCosts(rule, { ...std1Yr, state: 'ohio' }, 2026);
    expect(res.exciseTax).toBe(862.50); // 5.75% of 15000
    expect(res.titleFee).toBe(15.00);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(34.50);
    expect(res.totalFirstYearCost).toBe(912.00);
  });

  it('Georgia: exact worked test ($15,000 -> $1,088.00)', () => {
    const rule = allRules.georgia;
    const res = calculateVehicleCosts(rule, { ...std1Yr, state: 'georgia' }, 2026);
    expect(res.exciseTax).toBe(1050.00); // 7.0% statutory TAVT of 15000 (O.C.G.A. § 48-5C-1)
    expect(res.titleFee).toBe(18.00);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(20.00);
    expect(res.totalFirstYearCost).toBe(1088.00);
  });

  it('North Carolina: exact worked test ($15,000 -> $544.75)', () => {
    const rule = allRules['north-carolina'];
    const res = calculateVehicleCosts(rule, { ...std1Yr, state: 'north-carolina' }, 2026);
    expect(res.exciseTax).toBe(450.00); // 3.0% HUT of 15000
    expect(res.titleFee).toBe(56.00);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(38.75);
    expect(res.totalFirstYearCost).toBe(544.75);
  });

  it('Michigan: exact worked test ($15,000 -> $1,065.00)', () => {
    const rule = allRules.michigan;
    const res = calculateVehicleCosts(rule, { ...std1Yr, state: 'michigan' }, 2026);
    expect(res.exciseTax).toBe(900.00); // 6.0% of 15000
    expect(res.titleFee).toBe(15.00);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(150.00);
    expect(res.totalFirstYearCost).toBe(1065.00);
  });

  it('Batch 1 trade-in deductibility verification (NC allows trade-in; TX, CA & NY do not)', () => {
    const tradeInputs: CalculatorInputs = {
      ...std1Yr,
      state: 'texas',
      tradeInValue: 5000
    };

    // Texas does NOT allow trade-in on private sales (Comptroller Rule 3.70)
    const txTrade = calculateVehicleCosts(allRules.texas, tradeInputs, 2026);
    expect(txTrade.tradeInDeducted).toBe(0);
    expect(txTrade.tradeInIgnored).toBe(true);
    expect(txTrade.exciseTax).toBe(15000 * 0.0625); // 937.50

    // NC allows trade-in on private sales (N.C. Gen. Stat. § 105-187.3)
    const ncTrade = calculateVehicleCosts(allRules['north-carolina'], { ...tradeInputs, state: 'north-carolina' }, 2026);
    expect(ncTrade.tradeInDeducted).toBe(5000);
    expect(ncTrade.exciseTax).toBe(10000 * 0.03); // 300.00

    // California does NOT allow trade-in
    const caTrade = calculateVehicleCosts(allRules.california, { ...tradeInputs, state: 'california' }, 2026);
    expect(caTrade.tradeInDeducted).toBe(0);
    expect(caTrade.tradeInIgnored).toBe(true);
    expect(caTrade.exciseTax).toBe(15000 * 0.0725); // 1087.50

    // New York does NOT allow trade-in
    const nyTrade = calculateVehicleCosts(allRules['new-york'], { ...tradeInputs, registrationTerm: 2, state: 'new-york' }, 2026);
    expect(nyTrade.tradeInDeducted).toBe(0);
    expect(nyTrade.tradeInIgnored).toBe(true);
    expect(nyTrade.exciseTax).toBe(15000 * 0.04); // 600.00
  });

  // Batch 2 Worked Acceptance Tests
  it('New Jersey: exact worked test ($15,000 -> $1,100.25)', () => {
    const rule = allRules['new-jersey'];
    const res = calculateVehicleCosts(rule, { ...std1Yr, state: 'new-jersey' }, 2026);
    expect(res.exciseTax).toBe(993.75); // 6.625% of 15000
    expect(res.titleFee).toBe(60.00);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(46.50);
    expect(res.totalFirstYearCost).toBe(1100.25);
  });

  it('Washington: exact worked test ($15,000 -> $1,103.25)', () => {
    const rule = allRules.washington;
    const res = calculateVehicleCosts(rule, { ...std1Yr, state: 'washington' }, 2026);
    expect(res.exciseTax).toBe(1020.00); // 6.8% base statewide of 15000
    expect(res.titleFee).toBe(15.00);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(68.25);
    expect(res.totalFirstYearCost).toBe(1103.25);
  });

  it('Arizona: exact worked test ($15,000 -> $18.50, exempt from state sales tax)', () => {
    const rule = allRules.arizona;
    const res = calculateVehicleCosts(rule, { ...std1Yr, state: 'arizona' }, 2026);
    expect(res.exciseTax).toBe(0.00); // 0.0% exempt from state TPT
    expect(res.titleFee).toBe(4.00);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(14.50);
    expect(res.totalFirstYearCost).toBe(18.50);
  });

  it('Tennessee: exact worked test ($15,000 -> $1,090.50)', () => {
    const rule = allRules.tennessee;
    const res = calculateVehicleCosts(rule, { ...std1Yr, state: 'tennessee' }, 2026);
    expect(res.exciseTax).toBe(1050.00); // 7.0% of 15000
    expect(res.titleFee).toBe(14.00);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(26.50);
    expect(res.totalFirstYearCost).toBe(1090.50);
  });

  it('Massachusetts: exact worked test ($15,000 -> $1,072.50, 2-yr registration)', () => {
    const rule = allRules.massachusetts;
    const res = calculateVehicleCosts(rule, { ...std1Yr, registrationTerm: 2, state: 'massachusetts' }, 2026);
    expect(res.exciseTax).toBe(937.50); // 6.25% of 15000
    expect(res.titleFee).toBe(75.00);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(60.00);
    expect(res.totalFirstYearCost).toBe(1072.50);
  });

  it('Indiana: exact worked test ($15,000 -> $1,101.35)', () => {
    const rule = allRules.indiana;
    const res = calculateVehicleCosts(rule, { ...std1Yr, state: 'indiana' }, 2026);
    expect(res.exciseTax).toBe(1050.00); // 7.0% of 15000
    expect(res.titleFee).toBe(15.00);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(36.35);
    expect(res.totalFirstYearCost).toBe(1101.35);
  });

  it('Missouri: exact worked test ($15,000 -> $684.50)', () => {
    const rule = allRules.missouri;
    const res = calculateVehicleCosts(rule, { ...std1Yr, state: 'missouri' }, 2026);
    expect(res.exciseTax).toBe(633.75); // 4.225% of 15000
    expect(res.titleFee).toBe(17.50);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(33.25);
    expect(res.totalFirstYearCost).toBe(684.50);
  });

  it('Wisconsin: exact worked test ($15,000 -> $1,049.50)', () => {
    const rule = allRules.wisconsin;
    const res = calculateVehicleCosts(rule, { ...std1Yr, state: 'wisconsin' }, 2026);
    expect(res.exciseTax).toBe(750.00); // 5.0% of 15000
    expect(res.titleFee).toBe(214.50);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(85.00);
    expect(res.totalFirstYearCost).toBe(1049.50);
  });

  it('Colorado: exact worked test ($15,000 -> $495.70)', () => {
    const rule = allRules.colorado;
    const res = calculateVehicleCosts(rule, { ...std1Yr, state: 'colorado' }, 2026);
    expect(res.exciseTax).toBe(435.00); // 2.9% of 15000
    expect(res.titleFee).toBe(7.20);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(53.50);
    expect(res.totalFirstYearCost).toBe(495.70);
  });

  it('Batch 2 trade-in deductibility verification (MO allows trade-in; NJ & WA do not)', () => {
    const tradeInputs: CalculatorInputs = {
      ...std1Yr,
      state: 'missouri',
      tradeInValue: 5000
    };

    // Missouri allows trade-in on private sales (RSMo § 144.025)
    const moTrade = calculateVehicleCosts(allRules.missouri, tradeInputs, 2026);
    expect(moTrade.tradeInDeducted).toBe(5000);
    expect(moTrade.tradeInIgnored).toBe(false);
    expect(moTrade.exciseTax).toBe(10000 * 0.04225); // 422.50

    // New Jersey does NOT allow trade-in on private sales
    const njTrade = calculateVehicleCosts(allRules['new-jersey'], { ...tradeInputs, state: 'new-jersey' }, 2026);
    expect(njTrade.tradeInDeducted).toBe(0);
    expect(njTrade.tradeInIgnored).toBe(true);
    expect(njTrade.exciseTax).toBe(15000 * 0.06625); // 993.75

    // Washington does NOT allow trade-in on private sales
    const waTrade = calculateVehicleCosts(allRules.washington, { ...tradeInputs, state: 'washington' }, 2026);
    expect(waTrade.tradeInDeducted).toBe(0);
    expect(waTrade.tradeInIgnored).toBe(true);
    expect(waTrade.exciseTax).toBe(1020.00);
  });

  // Batch 3 mid-sized states acceptance tests
  it('Minnesota: exact worked test ($15,000 -> $1,105.25)', () => {
    const rule = allRules.minnesota;
    const res = calculateVehicleCosts(rule, { ...std1Yr, state: 'minnesota' }, 2026);
    expect(res.exciseTax).toBe(1031.25); // 6.875% of 15000
    expect(res.titleFee).toBe(23.50);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(50.50);
    expect(res.totalFirstYearCost).toBe(1105.25);
  });

  it('South Carolina: exact worked test with $500 IMF cap ($15,000 -> $535.00)', () => {
    const rule = allRules['south-carolina'];
    const res = calculateVehicleCosts(rule, { ...std1Yr, state: 'south-carolina' }, 2026);
    expect(res.exciseTax).toBe(500.00); // 5.0% of 15000 = 750, capped at 500.00
    expect(res.maxTaxApplied).toBe(true);
    expect(res.titleFee).toBe(15.00);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(20.00); // 1-year registration
    expect(res.totalFirstYearCost).toBe(535.00);
  });

  it('South Carolina: under $10,000 purchase price charges exact 5% without hitting cap ($6,000 -> $300 tax)', () => {
    const rule = allRules['south-carolina'];
    const res = calculateVehicleCosts(rule, { ...std1Yr, state: 'south-carolina', purchasePrice: 6000 }, 2026);
    expect(res.exciseTax).toBe(300.00); // 5.0% of 6000
    expect(res.maxTaxApplied).toBe(false);
    expect(res.totalFirstYearCost).toBe(335.00);
  });

  it('Alabama: exact worked test ($15,000 -> $338.00)', () => {
    const rule = allRules.alabama;
    const res = calculateVehicleCosts(rule, { ...std1Yr, state: 'alabama' }, 2026);
    expect(res.exciseTax).toBe(300.00); // 2.0% of 15000
    expect(res.titleFee).toBe(15.00);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(23.00);
    expect(res.totalFirstYearCost).toBe(338.00);
  });

  it('Louisiana: exact worked test ($15,000 -> $746.00)', () => {
    const rule = allRules.louisiana;
    const res = calculateVehicleCosts(rule, { ...std1Yr, state: 'louisiana' }, 2026);
    expect(res.exciseTax).toBe(667.50); // 4.45% of 15000
    expect(res.titleFee).toBe(68.50);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(10.00);
    expect(res.totalFirstYearCost).toBe(746.00);
  });

  it('Kentucky: exact worked test ($15,000 -> $930.00)', () => {
    const rule = allRules.kentucky;
    const res = calculateVehicleCosts(rule, { ...std1Yr, state: 'kentucky' }, 2026);
    expect(res.exciseTax).toBe(900.00); // 6.0% of 15000
    expect(res.titleFee).toBe(9.00);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(21.00);
    expect(res.totalFirstYearCost).toBe(930.00);
  });

  it('Oregon: exact worked test with zero sales tax ($15,000 -> $164.00)', () => {
    const rule = allRules.oregon;
    const res = calculateVehicleCosts(rule, { ...std1Yr, state: 'oregon' }, 2026);
    expect(res.exciseTax).toBe(0.00); // 0.0% sales tax
    expect(res.titleFee).toBe(101.00);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(63.00);
    expect(res.totalFirstYearCost).toBe(164.00);
  });

  it('Oklahoma: exact worked test ($15,000 -> $584.50)', () => {
    const rule = allRules.oklahoma;
    const res = calculateVehicleCosts(rule, { ...std1Yr, state: 'oklahoma' }, 2026);
    expect(res.exciseTax).toBe(487.50); // 3.25% of 15000
    expect(res.titleFee).toBe(11.00);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(86.00); // 5-year-old vehicle in 2026
    expect(res.totalFirstYearCost).toBe(584.50);
  });

  it('Connecticut: exact worked test ($15,000 -> $1,017.50)', () => {
    const rule = allRules.connecticut;
    const res = calculateVehicleCosts(rule, { ...std1Yr, state: 'connecticut' }, 2026);
    expect(res.exciseTax).toBe(952.50); // 6.35% of 15000
    expect(res.titleFee).toBe(25.00);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(40.00);
    expect(res.totalFirstYearCost).toBe(1017.50);
  });

  it('Utah: exact worked test ($15,000 -> $777.50)', () => {
    const rule = allRules.utah;
    const res = calculateVehicleCosts(rule, { ...std1Yr, state: 'utah' }, 2026);
    expect(res.exciseTax).toBe(727.50); // 4.85% of 15000
    expect(res.titleFee).toBe(6.00);
    expect(res.lienFilingFee).toBe(0.00);
    expect(res.registrationTotal).toBe(44.00);
    expect(res.totalFirstYearCost).toBe(777.50);
  });

  it('Batch 3 trade-in deductibility verification (SC & KY allow trade-in; MN & CT do not)', () => {
    // South Carolina: $15,000 price - $7,000 trade-in = $8,000 taxable base * 5% = $400.00 (under $500 cap)
    const scTrade = calculateVehicleCosts(allRules['south-carolina'], {
      ...std1Yr,
      state: 'south-carolina',
      purchasePrice: 15000,
      tradeInValue: 7000
    }, 2026);
    expect(scTrade.tradeInDeducted).toBe(7000);
    expect(scTrade.tradeInIgnored).toBe(false);
    expect(scTrade.exciseTax).toBe(400.00);

    // Kentucky: $15,000 price - $5,000 trade-in = $10,000 taxable base * 6% = $600.00
    const kyTrade = calculateVehicleCosts(allRules.kentucky, {
      ...std1Yr,
      state: 'kentucky',
      purchasePrice: 15000,
      tradeInValue: 5000
    }, 2026);
    expect(kyTrade.tradeInDeducted).toBe(5000);
    expect(kyTrade.tradeInIgnored).toBe(false);
    expect(kyTrade.exciseTax).toBe(600.00);

    // Minnesota: trade-in is IGNORED on private sales
    const mnTrade = calculateVehicleCosts(allRules.minnesota, {
      ...std1Yr,
      state: 'minnesota',
      purchasePrice: 15000,
      tradeInValue: 5000
    }, 2026);
    expect(mnTrade.tradeInDeducted).toBe(0);
    expect(mnTrade.tradeInIgnored).toBe(true);
    expect(mnTrade.exciseTax).toBe(1031.25);

    // Connecticut: trade-in is IGNORED on private sales
    const ctTrade = calculateVehicleCosts(allRules.connecticut, {
      ...std1Yr,
      state: 'connecticut',
      purchasePrice: 15000,
      tradeInValue: 5000
    }, 2026);
    expect(ctTrade.tradeInDeducted).toBe(0);
    expect(ctTrade.tradeInIgnored).toBe(true);
    expect(ctTrade.exciseTax).toBe(952.50);
  });
});
