import { CalculatorInputs, CostBreakdown, StateRule } from './types';

/**
 * Pure calculation engine for vehicle tax, tags, and titling costs.
 * Strictly consumes state rules without any hardcoded fees.
 */
export function calculateVehicleCosts(
  rule: StateRule,
  inputs: CalculatorInputs,
  referenceYear: number = 2026
): CostBreakdown {
  const price = Math.max(0, Number(inputs.purchasePrice) || 0);
  const tradeIn = Math.max(0, Number(inputs.tradeInValue) || 0);

  // 1. Taxable base calculation
  // Maryland does NOT allow trade-in deduction for private party sales
  const taxableBase = rule.tradeInDeductible
    ? Math.max(0, price - tradeIn)
    : price;

  const rawExciseTax = taxableBase * rule.exciseTaxRate;
  let exciseTax = rawExciseTax;
  let minTaxApplied = false;

  if (price > 0 && rule.minExciseTax !== null && exciseTax < rule.minExciseTax) {
    exciseTax = rule.minExciseTax;
    minTaxApplied = true;
  }

  // 2. Title Certificate Fee
  const titleFee = rule.titleFee;

  // 3. Lien Filing Fee (only applied if financed)
  const lienFilingFee = inputs.isFinanced ? rule.lienFilingFee : 0;

  // 4. Registration & Tag Fee
  const term = inputs.registrationTerm;
  let baseRegistrationFee = 0;

  if (inputs.vehicleType === 'motorcycle') {
    const motoRule = rule.registration.motorcycle;
    if (typeof motoRule === 'object' && motoRule !== null) {
      baseRegistrationFee = (motoRule as Record<string, number>)[String(term)] ?? 0;
    } else if (typeof motoRule === 'number') {
      baseRegistrationFee = term === 1 ? motoRule / 2 : motoRule;
    }
  } else {
    const passRule = rule.registration.passenger[inputs.weightClass];
    if (typeof passRule === 'object' && passRule !== null) {
      baseRegistrationFee = (passRule as Record<string, number>)[String(term)] ?? 0;
    } else if (typeof passRule === 'number') {
      baseRegistrationFee = term === 1 ? passRule / 2 : passRule;
    }
  }

  // EV / PHEV surcharges
  let evSurcharge = 0;
  if (inputs.fuelType === 'ev') {
    evSurcharge = rule.registration.evSurchargeAnnual * term;
  } else if (inputs.fuelType === 'phev') {
    evSurcharge = rule.registration.phevSurchargeAnnual * term;
  }

  const registrationTotal = baseRegistrationFee + evSurcharge;

  // 5. Total First-Year Out-Of-Pocket Cost
  const totalFirstYearCost =
    exciseTax + titleFee + lienFilingFee + registrationTotal;

  // Age rule calculation (book value check for vehicles <= 7 years old)
  const vehicleAge = referenceYear - inputs.vehicleYear;
  const bookValueApplies = vehicleAge <= 7;

  // Itemized breakdown in the exact required order:
  // 1. Excise tax
  // 2. Title fee
  // 3. Lien filing fee
  // 4. Registration/tag fee
  // 5. Total first-year cost
  const itemizedList = [
    {
      id: 'excise-tax',
      label: `Vehicle Excise Tax (${(rule.exciseTaxRate * 100).toFixed(1)}%)`,
      amount: exciseTax,
      description: minTaxApplied
        ? `Statutory minimum tax floor applied ($${rule.minExciseTax?.toFixed(2)})`
        : `Calculated on purchase price of $${price.toLocaleString()}`
    },
    {
      id: 'title-fee',
      label: 'Certificate of Title Fee',
      amount: titleFee,
      description: 'Standard state certificate of title transfer fee'
    },
    {
      id: 'lien-filing-fee',
      label: 'Lien / Security Interest Filing Fee',
      amount: lienFilingFee,
      description: inputs.isFinanced
        ? 'Required when financing through a lender'
        : 'Waived ($0) for cash / unfinanced purchase'
    },
    {
      id: 'registration-fee',
      label: `Registration & Tags (${term}-Year Term)`,
      amount: registrationTotal,
      description:
        evSurcharge > 0
          ? `Base tag fee ($${baseRegistrationFee.toFixed(2)}) + EV/PHEV surcharge ($${evSurcharge.toFixed(2)})`
          : inputs.vehicleType === 'motorcycle'
          ? 'Class D Motorcycle registration including annual EMS surcharge'
          : `Class A Passenger (${inputs.weightClass === 'under3700lbs' ? '≤ 3,700 lbs' : '> 3,700 lbs'}) including EMS surcharge`
    },
    {
      id: 'total-cost',
      label: 'Total First-Year Out-of-Pocket Cost',
      amount: totalFirstYearCost,
      description: 'Sum of all mandatory state taxes and fees for year one',
      isHero: true
    }
  ];

  return {
    exciseTax,
    titleFee,
    lienFilingFee,
    baseRegistrationFee,
    evSurcharge,
    registrationTotal,
    totalFirstYearCost,
    minTaxApplied,
    bookValueApplies,
    vehicleAge,
    tradeInDeducted: rule.tradeInDeductible ? tradeIn : 0,
    tradeInIgnored: tradeIn > 0 && !rule.tradeInDeductible,
    veipFee: rule.veipFee ?? 14,
    itemizedList
  };
}
