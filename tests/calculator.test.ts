import { describe, it, expect } from 'vitest';
import { calculateVehicleCosts } from '../src/lib/calculator';
import stateRulesData from '../src/config/stateRules.json';
import { CalculatorInputs, StateRule } from '../src/lib/types';

const mdRule = stateRulesData.maryland as StateRule;

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
      tradeInValue: 6000 // buyer traded in a $6,000 car
    };

    const withoutTrade = calculateVehicleCosts(mdRule, baseInputs, 2026);
    const withTrade = calculateVehicleCosts(mdRule, withTradeInInputs, 2026);

    // Excise tax MUST be identical
    expect(withTrade.exciseTax).toBe(withoutTrade.exciseTax);
    expect(withTrade.exciseTax).toBe(20000 * 0.065);

    // Total cost MUST be identical
    expect(withTrade.totalFirstYearCost).toBe(withoutTrade.totalFirstYearCost);

    // Informational flag must indicate trade-in was ignored per MD statute
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
    expect(financedResult.lienFilingFee).toBe(mdRule.lienFilingFee);
    expect(financedResult.lienFilingFee).toBe(40);
    expect(financedResult.totalFirstYearCost - cashResult.totalFirstYearCost).toBe(40);
  });

  it('registration term toggle: supports both 1-year and 2-year registration', () => {
    const term1Inputs: CalculatorInputs = {
      state: 'maryland',
      vehicleType: 'passenger',
      purchasePrice: 12000,
      vehicleYear: 2022,
      weightClass: 'under3700lbs',
      fuelType: 'gasoline',
      registrationTerm: 1,
      isFinanced: false,
      tradeInValue: 0
    };

    const term2Inputs: CalculatorInputs = {
      ...term1Inputs,
      registrationTerm: 2
    };

    const res1 = calculateVehicleCosts(mdRule, term1Inputs, 2026);
    const res2 = calculateVehicleCosts(mdRule, term2Inputs, 2026);

    expect(res1.baseRegistrationFee).toBe(125.50);
    expect(res2.baseRegistrationFee).toBe(251.00);
    expect(res2.baseRegistrationFee).toBe(res1.baseRegistrationFee * 2);
  });

  it('minimum excise tax floor: applies $41.60 minimum floor on low-value vehicles', () => {
    const inputs: CalculatorInputs = {
      state: 'maryland',
      vehicleType: 'passenger',
      purchasePrice: 100, // 6.5% of 100 is $6.50, well below minimum
      vehicleYear: 2010,
      weightClass: 'under3700lbs',
      fuelType: 'gasoline',
      registrationTerm: 1,
      isFinanced: false,
      tradeInValue: 0
    };

    const result = calculateVehicleCosts(mdRule, inputs, 2026);
    expect(result.exciseTax).toBe(41.60);
    expect(result.minTaxApplied).toBe(true);
  });

  it('minimum excise tax boundary test: verifies behavior at $639, $640, and $641', () => {
    const makeInputs = (price: number): CalculatorInputs => ({
      state: 'maryland',
      vehicleType: 'passenger',
      purchasePrice: price,
      vehicleYear: 2015,
      weightClass: 'under3700lbs',
      fuelType: 'gasoline',
      registrationTerm: 1,
      isFinanced: false,
      tradeInValue: 0
    });

    const at639 = calculateVehicleCosts(mdRule, makeInputs(639), 2026);
    const at640 = calculateVehicleCosts(mdRule, makeInputs(640), 2026);
    const at641 = calculateVehicleCosts(mdRule, makeInputs(641), 2026);

    // 639 * 0.065 = 41.535 -> floor applied -> 41.60
    expect(at639.exciseTax).toBe(41.60);
    expect(at639.minTaxApplied).toBe(true);

    // 640 * 0.065 = 41.60 -> exactly at minimum
    expect(at640.exciseTax).toBe(41.60);
    expect(at640.minTaxApplied).toBe(false);

    // 641 * 0.065 = 41.665 -> above minimum
    expect(at641.exciseTax).toBeCloseTo(41.665, 3);
    expect(at641.minTaxApplied).toBe(false);
  });

  it('zero and negative purchase price handling', () => {
    const zeroInputs: CalculatorInputs = {
      state: 'maryland',
      vehicleType: 'passenger',
      purchasePrice: 0,
      vehicleYear: 2019,
      weightClass: 'under3700lbs',
      fuelType: 'gasoline',
      registrationTerm: 1,
      isFinanced: false,
      tradeInValue: 0
    };

    const negInputs: CalculatorInputs = {
      ...zeroInputs,
      purchasePrice: -5000
    };

    const zeroRes = calculateVehicleCosts(mdRule, zeroInputs, 2026);
    const negRes = calculateVehicleCosts(mdRule, negInputs, 2026);

    // $0 purchase price should yield $0 tax (not minimum floor)
    expect(zeroRes.exciseTax).toBe(0);
    expect(zeroRes.minTaxApplied).toBe(false);

    // Negative price should be safely clamped to 0
    expect(negRes.exciseTax).toBe(0);
    expect(negRes.minTaxApplied).toBe(false);
  });

  it('book value rule: applies for vehicles <= 7 years old and not for older vehicles', () => {
    const inputs7Years: CalculatorInputs = {
      state: 'maryland',
      vehicleType: 'passenger',
      purchasePrice: 10000,
      vehicleYear: 2019, // 2026 - 2019 = 7
      weightClass: 'under3700lbs',
      fuelType: 'gasoline',
      registrationTerm: 2,
      isFinanced: false,
      tradeInValue: 0
    };

    const inputs8Years: CalculatorInputs = {
      ...inputs7Years,
      vehicleYear: 2018 // 2026 - 2018 = 8
    };

    const inputsBrandNew: CalculatorInputs = {
      ...inputs7Years,
      vehicleYear: 2026 // 0 years old
    };

    const res7 = calculateVehicleCosts(mdRule, inputs7Years, 2026);
    const res8 = calculateVehicleCosts(mdRule, inputs8Years, 2026);
    const resBrandNew = calculateVehicleCosts(mdRule, inputsBrandNew, 2026);

    expect(res7.bookValueApplies).toBe(true);
    expect(res8.bookValueApplies).toBe(false);
    expect(resBrandNew.bookValueApplies).toBe(true);
  });

  it('motorcycle vehicle type calculations for 1-year and 2-year terms', () => {
    const moto1Inputs: CalculatorInputs = {
      state: 'maryland',
      vehicleType: 'motorcycle',
      purchasePrice: 8000,
      vehicleYear: 2020,
      weightClass: 'under3700lbs',
      fuelType: 'gasoline',
      registrationTerm: 1,
      isFinanced: false,
      tradeInValue: 0
    };

    const moto2Inputs: CalculatorInputs = {
      ...moto1Inputs,
      registrationTerm: 2
    };

    const res1 = calculateVehicleCosts(mdRule, moto1Inputs, 2026);
    const res2 = calculateVehicleCosts(mdRule, moto2Inputs, 2026);

    expect(res1.baseRegistrationFee).toBe(105.00);
    expect(res2.baseRegistrationFee).toBe(210.00);
    expect(res1.totalFirstYearCost).toBe(8000 * 0.065 + 200 + 105);
    expect(res2.totalFirstYearCost).toBe(8000 * 0.065 + 200 + 210);
  });

  it('weight class difference: heavy vehicles (> 3,700 lbs) incur higher registration rates', () => {
    const lightInputs: CalculatorInputs = {
      state: 'maryland',
      vehicleType: 'passenger',
      purchasePrice: 30000,
      vehicleYear: 2022,
      weightClass: 'under3700lbs',
      fuelType: 'gasoline',
      registrationTerm: 2,
      isFinanced: false,
      tradeInValue: 0
    };

    const heavyInputs: CalculatorInputs = {
      ...lightInputs,
      weightClass: 'over3700lbs'
    };

    const lightRes = calculateVehicleCosts(mdRule, lightInputs, 2026);
    const heavyRes = calculateVehicleCosts(mdRule, heavyInputs, 2026);

    expect(lightRes.baseRegistrationFee).toBe(251.00);
    expect(heavyRes.baseRegistrationFee).toBe(383.00);
    expect(heavyRes.totalFirstYearCost - lightRes.totalFirstYearCost).toBe(383.00 - 251.00);
  });

  it('electric vehicle surcharges: accurately calculates annual surcharges across terms', () => {
    const evInputs: CalculatorInputs = {
      state: 'maryland',
      vehicleType: 'passenger',
      purchasePrice: 25000,
      vehicleYear: 2023,
      weightClass: 'under3700lbs',
      fuelType: 'ev',
      registrationTerm: 2,
      isFinanced: false,
      tradeInValue: 0
    };

    const phevInputs: CalculatorInputs = {
      ...evInputs,
      fuelType: 'phev',
      registrationTerm: 1
    };

    const evResult = calculateVehicleCosts(mdRule, evInputs, 2026);
    const phevResult = calculateVehicleCosts(mdRule, phevInputs, 2026);

    // EV 2-year: $125 * 2 = $250
    expect(evResult.evSurcharge).toBe(250);
    expect(evResult.registrationTotal).toBe(evResult.baseRegistrationFee + 250);

    // PHEV 1-year: $100 * 1 = $100
    expect(phevResult.evSurcharge).toBe(100);
    expect(phevResult.registrationTotal).toBe(phevResult.baseRegistrationFee + 100);
  });

  it('itemized list order strictly adheres to §3 specifications', () => {
    const inputs: CalculatorInputs = {
      state: 'maryland',
      vehicleType: 'passenger',
      purchasePrice: 18000,
      vehicleYear: 2021,
      weightClass: 'under3700lbs',
      fuelType: 'gasoline',
      registrationTerm: 2,
      isFinanced: true,
      tradeInValue: 0
    };

    const result = calculateVehicleCosts(mdRule, inputs, 2026);

    expect(result.itemizedList.length).toBe(5);
    expect(result.itemizedList[0].id).toBe('excise-tax');
    expect(result.itemizedList[1].id).toBe('title-fee');
    expect(result.itemizedList[2].id).toBe('lien-filing-fee');
    expect(result.itemizedList[3].id).toBe('registration-fee');
    expect(result.itemizedList[4].id).toBe('total-cost');
  });
});
