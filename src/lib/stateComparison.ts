import stateRulesData from '@/config/stateRules.json';
import { calculateVehicleCosts } from '@/lib/calculator';
import { formatFee, formatPercent } from '@/lib/formatters';
import { CalculatorInputs, CostBreakdown, StateRule, StateRulesConfig } from '@/lib/types';

export const STANDARD_SCENARIO_INPUTS: CalculatorInputs = {
  state: '',
  purchasePrice: 25000,
  tradeInValue: 0,
  vehicleYear: 2015,
  vehicleType: 'passenger',
  weightClass: 'under3700lbs',
  registrationTerm: 1,
  isFinanced: false,
  fuelType: 'gasoline'
};

export interface StateComparisonRow {
  rank: number;
  key: string;
  label: string;
  slug: string;
  exciseTaxRate: number;
  rateDisplay: string;
  isFlatTable: boolean;
  salesTaxAmount: number;
  titleFee: number;
  registrationFee: number;
  totalCost: number;
  breakdown: CostBreakdown;
  rule: StateRule;
}

export interface TaxRateRow {
  rank: number;
  key: string;
  label: string;
  slug: string;
  isFlatTable: boolean;
  rateDisplay: string;
  exciseTaxRate: number;
  estimatedTax: number;
  taxBase: string;
}

export interface TitleFeeRow {
  rank: number;
  key: string;
  label: string;
  slug: string;
  titleFee: number;
  lienFilingFee: number;
  registrationFee: number;
}

export interface KeyFindingsStats {
  zeroTaxCount: number;
  zeroTaxStates: { label: string; slug: string }[];
  highestRateState: { label: string; rateDisplay: string; slug: string };
  highestTitleFeeState: { label: string; feeDisplay: string; slug: string };
  cheapestState: { label: string; totalDisplay: string; slug: string };
  mostExpensiveState: { label: string; totalDisplay: string; slug: string };
}

export interface ComparisonDataset {
  heroRows: StateComparisonRow[];
  taxRateRows: TaxRateRow[];
  titleFeeRows: TitleFeeRow[];
  stats: KeyFindingsStats;
  standardScenario: typeof STANDARD_SCENARIO_INPUTS;
  lastVerifiedDate: string;
}

/**
 * Computes all state comparison rows, rankings, and key finding stats dynamically
 * from stateRules.json via calculateVehicleCosts. Zero hardcoded values.
 */
export function getComparisonDataset(): ComparisonDataset {
  const rules = stateRulesData as StateRulesConfig;
  const rawRows: Omit<StateComparisonRow, 'rank'>[] = [];

  for (const [key, rule] of Object.entries(rules)) {
    const inputs: CalculatorInputs = {
      ...STANDARD_SCENARIO_INPUTS,
      state: key
    };

    const breakdown = calculateVehicleCosts(rule, inputs, 2026);
    const isFlat = Boolean(rule.flatTaxTable);
    const rateDisplay = isFlat
      ? 'Flat Table'
      : rule.exciseTaxRate === 0
      ? '0.00%'
      : formatPercent(rule.exciseTaxRate);

    rawRows.push({
      key,
      label: rule.label,
      slug: rule.slug,
      exciseTaxRate: rule.exciseTaxRate,
      rateDisplay,
      isFlatTable: isFlat,
      salesTaxAmount: breakdown.exciseTax,
      titleFee: breakdown.titleFee,
      registrationFee: breakdown.registrationTotal,
      totalCost: breakdown.totalFirstYearCost,
      breakdown,
      rule
    });
  }

  // 1. Hero Table: Ranked by total first-year cost ascending
  const heroSorted = [...rawRows].sort((a, b) => {
    if (a.totalCost !== b.totalCost) {
      return a.totalCost - b.totalCost;
    }
    return a.label.localeCompare(b.label);
  });
  const heroRows: StateComparisonRow[] = heroSorted.map((row, index) => ({
    ...row,
    rank: index + 1
  }));

  // 2. Tax Rate Table: Ranked by statutory rate descending
  // Illinois (flat table) is placed at the end or ranked appropriately
  const rateSorted = [...rawRows].sort((a, b) => {
    if (a.isFlatTable && !b.isFlatTable) return 1;
    if (!a.isFlatTable && b.isFlatTable) return -1;
    if (b.exciseTaxRate !== a.exciseTaxRate) {
      return b.exciseTaxRate - a.exciseTaxRate;
    }
    return a.label.localeCompare(b.label);
  });
  const taxRateRows: TaxRateRow[] = rateSorted.map((row, index) => ({
    rank: index + 1,
    key: row.key,
    label: row.label,
    slug: row.slug,
    isFlatTable: row.isFlatTable,
    rateDisplay: row.isFlatTable ? 'Flat Table (RUT-50)' : row.rateDisplay,
    exciseTaxRate: row.exciseTaxRate,
    estimatedTax: row.salesTaxAmount,
    taxBase: row.rule.taxBase
  }));

  // 3. Title Fee Table: Ranked by certificate of title fee descending
  const titleSorted = [...rawRows].sort((a, b) => {
    if (b.titleFee !== a.titleFee) {
      return b.titleFee - a.titleFee;
    }
    return a.label.localeCompare(b.label);
  });
  const titleFeeRows: TitleFeeRow[] = titleSorted.map((row, index) => ({
    rank: index + 1,
    key: row.key,
    label: row.label,
    slug: row.slug,
    titleFee: row.titleFee,
    lienFilingFee: row.rule.lienFilingFee,
    registrationFee: row.registrationFee
  }));

  // 4. Compute Key Findings dynamically
  const zeroTaxRows = heroRows
    .filter((r) => r.exciseTaxRate === 0 && !r.isFlatTable)
    .sort((a, b) => a.label.localeCompare(b.label));

  // Highest rate state (excluding flat table)
  const nonFlatByRate = [...heroRows]
    .filter((r) => !r.isFlatTable)
    .sort((a, b) => b.exciseTaxRate - a.exciseTaxRate);
  const highestRate = nonFlatByRate[0];

  // Highest title fee state
  const highestTitle = titleSorted[0];

  // Cheapest and most expensive total first-year cost
  const cheapest = heroRows[0];
  const mostExpensive = heroRows[heroRows.length - 1];

  const stats: KeyFindingsStats = {
    zeroTaxCount: zeroTaxRows.length,
    zeroTaxStates: zeroTaxRows.map((r) => ({ label: r.label, slug: r.slug })),
    highestRateState: {
      label: highestRate.label,
      rateDisplay: formatPercent(highestRate.exciseTaxRate),
      slug: highestRate.slug
    },
    highestTitleFeeState: {
      label: highestTitle.label,
      feeDisplay: formatFee(highestTitle.titleFee),
      slug: highestTitle.slug
    },
    cheapestState: {
      label: cheapest.label,
      totalDisplay: formatFee(cheapest.totalCost),
      slug: cheapest.slug
    },
    mostExpensiveState: {
      label: mostExpensive.label,
      totalDisplay: formatFee(mostExpensive.totalCost),
      slug: mostExpensive.slug
    }
  };

  return {
    heroRows,
    taxRateRows,
    titleFeeRows,
    stats,
    standardScenario: STANDARD_SCENARIO_INPUTS,
    lastVerifiedDate: 'September 2026'
  };
}

/**
 * Generates CSV content from the hero table data.
 */
export function generateComparisonCsv(rows: StateComparisonRow[]): string {
  const headers = [
    'Rank',
    'State',
    'Statutory Tax Rate',
    'Sales/Excise Tax ($25k)',
    'Title Certificate Fee',
    'Registration Fee (1-Yr)',
    'Total First-Year Cost'
  ];

  const lines = [headers.join(',')];

  for (const row of rows) {
    const values = [
      row.rank,
      `"${row.label.replace(/"/g, '""')}"`,
      `"${row.rateDisplay}"`,
      row.salesTaxAmount.toFixed(2),
      row.titleFee.toFixed(2),
      row.registrationFee.toFixed(2),
      row.totalCost.toFixed(2)
    ];
    lines.push(values.join(','));
  }

  return lines.join('\n');
}
