import { describe, it, expect } from 'vitest';
import {
  getComparisonDataset,
  generateComparisonCsv,
  STANDARD_SCENARIO_INPUTS
} from '../src/lib/stateComparison';
import { calculateVehicleCosts } from '../src/lib/calculator';
import stateRulesData from '../src/config/stateRules.json';
import { StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;

describe('Vehicle Tax by State Comparison Engine & Verification', () => {
  const dataset = getComparisonDataset();

  it('standard scenario inputs adhere strictly to specification', () => {
    expect(STANDARD_SCENARIO_INPUTS.purchasePrice).toBe(25000);
    expect(STANDARD_SCENARIO_INPUTS.tradeInValue).toBe(0);
    expect(STANDARD_SCENARIO_INPUTS.vehicleYear).toBe(2015);
    expect(STANDARD_SCENARIO_INPUTS.vehicleType).toBe('passenger');
    expect(STANDARD_SCENARIO_INPUTS.weightClass).toBe('under3700lbs');
    expect(STANDARD_SCENARIO_INPUTS.registrationTerm).toBe(1);
    expect(STANDARD_SCENARIO_INPUTS.isFinanced).toBe(false);
    expect(STANDARD_SCENARIO_INPUTS.fuelType).toBe('gasoline');
  });

  it('includes all 51 US jurisdictions in all three ranking tables', () => {
    expect(dataset.heroRows).toHaveLength(51);
    expect(dataset.taxRateRows).toHaveLength(51);
    expect(dataset.titleFeeRows).toHaveLength(51);

    const heroKeys = new Set(dataset.heroRows.map((r) => r.key));
    const expectedKeys = Object.keys(rules);
    expect(heroKeys.size).toBe(51);
    for (const key of expectedKeys) {
      expect(heroKeys.has(key)).toBe(true);
    }
  });

  it('hero table ranks strictly by totalFirstYearCost ascending', () => {
    for (let i = 0; i < dataset.heroRows.length - 1; i++) {
      expect(dataset.heroRows[i].totalCost).toBeLessThanOrEqual(
        dataset.heroRows[i + 1].totalCost
      );
      expect(dataset.heroRows[i].rank).toBe(i + 1);
    }
  });

  describe('5-State Hand Verification of Standard $25,000 Scenario', () => {
    it('1. California: 7.25% sales tax, $29.00 title, $106.00 reg = $1,947.50 total', () => {
      const caRule = rules.california;
      const directCalc = calculateVehicleCosts(caRule, {
        ...STANDARD_SCENARIO_INPUTS,
        state: 'california'
      });

      expect(directCalc.exciseTax).toBe(1812.5); // 25,000 * 0.0725
      expect(directCalc.titleFee).toBe(29.0);
      expect(directCalc.registrationTotal).toBe(106.0);
      expect(directCalc.totalFirstYearCost).toBe(1947.5);

      const heroRow = dataset.heroRows.find((r) => r.key === 'california');
      expect(heroRow).toBeDefined();
      expect(heroRow?.salesTaxAmount).toBe(1812.5);
      expect(heroRow?.titleFee).toBe(29.0);
      expect(heroRow?.registrationFee).toBe(106.0);
      expect(heroRow?.totalCost).toBe(1947.5);
      expect(heroRow?.rateDisplay).toBe('7.25%');
    });

    it('2. Maryland: 6.50% excise tax, $200.00 title, $125.50 reg (1-yr) = $1,950.50 total', () => {
      const mdRule = rules.maryland;
      const directCalc = calculateVehicleCosts(mdRule, {
        ...STANDARD_SCENARIO_INPUTS,
        state: 'maryland'
      });

      expect(directCalc.exciseTax).toBe(1625.0); // 25,000 * 0.065
      expect(directCalc.titleFee).toBe(200.0);
      expect(directCalc.registrationTotal).toBe(125.5); // 251.00 / 2 for 1-year
      expect(directCalc.totalFirstYearCost).toBe(1950.5);

      const heroRow = dataset.heroRows.find((r) => r.key === 'maryland');
      expect(heroRow).toBeDefined();
      expect(heroRow?.salesTaxAmount).toBe(1625.0);
      expect(heroRow?.titleFee).toBe(200.0);
      expect(heroRow?.registrationFee).toBe(125.5);
      expect(heroRow?.totalCost).toBe(1950.5);
      expect(heroRow?.rateDisplay).toBe('6.50%');
    });

    it('3. Illinois: Form RUT-50 Table B ($1,350.00 flat tax), $165.00 title, $151.00 reg = $1,666.00 total', () => {
      const ilRule = rules.illinois;
      const directCalc = calculateVehicleCosts(ilRule, {
        ...STANDARD_SCENARIO_INPUTS,
        state: 'illinois'
      });

      expect(directCalc.exciseTax).toBe(1350.0); // Table B $25,000–$29,999.99 bracket
      expect(directCalc.titleFee).toBe(165.0);
      expect(directCalc.registrationTotal).toBe(151.0);
      expect(directCalc.totalFirstYearCost).toBe(1666.0);

      const heroRow = dataset.heroRows.find((r) => r.key === 'illinois');
      expect(heroRow).toBeDefined();
      expect(heroRow?.salesTaxAmount).toBe(1350.0);
      expect(heroRow?.titleFee).toBe(165.0);
      expect(heroRow?.registrationFee).toBe(151.0);
      expect(heroRow?.totalCost).toBe(1666.0);
      expect(heroRow?.isFlatTable).toBe(true);
      expect(heroRow?.rateDisplay).toBe('Flat Table');
    });

    it('4. Wisconsin: 5.00% sales tax, $214.50 title, $85.00 reg = $1,549.50 total', () => {
      const wiRule = rules.wisconsin;
      const directCalc = calculateVehicleCosts(wiRule, {
        ...STANDARD_SCENARIO_INPUTS,
        state: 'wisconsin'
      });

      expect(directCalc.exciseTax).toBe(1250.0); // 25,000 * 0.05
      expect(directCalc.titleFee).toBe(214.5);
      expect(directCalc.registrationTotal).toBe(85.0);
      expect(directCalc.totalFirstYearCost).toBe(1549.5);

      const heroRow = dataset.heroRows.find((r) => r.key === 'wisconsin');
      expect(heroRow).toBeDefined();
      expect(heroRow?.salesTaxAmount).toBe(1250.0);
      expect(heroRow?.titleFee).toBe(214.5);
      expect(heroRow?.registrationFee).toBe(85.0);
      expect(heroRow?.totalCost).toBe(1549.5);
      expect(heroRow?.rateDisplay).toBe('5.00%');
    });

    it('5. New Hampshire: 0.00% tax, $35.00 title, $48.00 reg = $83.00 total', () => {
      const nhRule = rules['new-hampshire'];
      const directCalc = calculateVehicleCosts(nhRule, {
        ...STANDARD_SCENARIO_INPUTS,
        state: 'new-hampshire'
      });

      expect(directCalc.exciseTax).toBe(0.0);
      expect(directCalc.titleFee).toBe(35.0);
      expect(directCalc.registrationTotal).toBe(48.0);
      expect(directCalc.totalFirstYearCost).toBe(83.0);

      const heroRow = dataset.heroRows.find((r) => r.key === 'new-hampshire');
      expect(heroRow).toBeDefined();
      expect(heroRow?.salesTaxAmount).toBe(0.0);
      expect(heroRow?.titleFee).toBe(35.0);
      expect(heroRow?.registrationFee).toBe(48.0);
      expect(heroRow?.totalCost).toBe(83.0);
      expect(heroRow?.rateDisplay).toBe('0.00%');
    });
  });

  it('dynamically computes key finding stat cards without hardcoding', () => {
    // 0% tax count
    expect(dataset.stats.zeroTaxCount).toBe(7);
    const zeroTaxNames = dataset.stats.zeroTaxStates.map((s) => s.label);
    expect(zeroTaxNames).toContain('Alaska');
    expect(zeroTaxNames).toContain('Arizona');
    expect(zeroTaxNames).toContain('Hawaii');
    expect(zeroTaxNames).toContain('Montana');
    expect(zeroTaxNames).toContain('Nevada');
    expect(zeroTaxNames).toContain('New Hampshire');
    expect(zeroTaxNames).toContain('Oregon');

    // Highest rate state
    expect(dataset.stats.highestRateState.label).toBe('California');
    expect(dataset.stats.highestRateState.rateDisplay).toBe('7.25%');

    // Highest title fee state
    expect(dataset.stats.highestTitleFeeState.label).toBe('Wisconsin');
    expect(dataset.stats.highestTitleFeeState.feeDisplay).toBe('$214.50');

    // Cheapest state
    expect(dataset.stats.cheapestState.label).toBe('Arizona');
    expect(dataset.stats.cheapestState.totalDisplay).toBe('$18.50');
  });

  it('CSV generator outputs correct headers and all 51 state rows', () => {
    const csv = generateComparisonCsv(dataset.heroRows);
    const lines = csv.trim().split('\n');
    expect(lines).toHaveLength(52); // 1 header + 51 rows

    expect(lines[0]).toBe(
      'Rank,State,Statutory Tax Rate,Sales/Excise Tax ($25k),Title Certificate Fee,Registration Fee (1-Yr),Total First-Year Cost'
    );

    // Verify first row matches rank 1
    const rank1 = dataset.heroRows[0];
    expect(lines[1]).toContain(rank1.label);
    expect(lines[1]).toContain(rank1.totalCost.toFixed(2));
  });
});
