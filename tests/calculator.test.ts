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
