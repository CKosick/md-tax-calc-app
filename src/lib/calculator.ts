import { CalculatorInputs, CostBreakdown, StateRule } from './types';

/**
 * Pure calculation engine for vehicle tax, tags, and titling costs across US states.
 * Consumes state rules without per-state code branches.
 */
export function calculateVehicleCosts(
  rule: StateRule,
  inputs: CalculatorInputs,
  referenceYear: number = 2026
): CostBreakdown {
  const price = Math.max(0, Number(inputs.purchasePrice) || 0);
  const tradeIn = Math.max(0, Number(inputs.tradeInValue) || 0);

  // 1. Taxable base calculation
  // Some states (e.g. Delaware) allow trade-in credit; others (Maryland, Virginia, Pennsylvania, DC, Illinois) tax the full price
  const taxableBase = rule.tradeInDeductible
    ? Math.max(0, price - tradeIn)
    : price;

  const vehicleAge = Math.max(0, referenceYear - inputs.vehicleYear);

  let exciseTax = 0;
  let minTaxApplied = false;
  let maxTaxApplied = false;
  let luxuryTaxApplied = false;
  let flatTaxApplied = false;
  let flatTaxDetail = '';

  let effectiveRate = rule.exciseTaxRate;
  let tierApplied = false;

  if (rule.flatTaxTable) {
    flatTaxApplied = true;
    if (price === 0) {
      exciseTax = 0;
      flatTaxDetail = 'No tax on $0.00 purchase price';
    } else if (taxableBase < rule.flatTaxTable.thresholdPrice) {
      // Table A by vehicle age
      let matchedFee = 0;
      for (const bracket of rule.flatTaxTable.tableAByAge) {
        if (bracket.maxAge === undefined || vehicleAge <= bracket.maxAge) {
          matchedFee = bracket.fee;
          break;
        }
      }
      exciseTax = matchedFee;
      flatTaxDetail = `Form RUT-50 Table A flat tax for ${vehicleAge} year old vehicle (under $${rule.flatTaxTable.thresholdPrice.toLocaleString()})`;
    } else {
      // Table B by price bracket
      let matchedFee = 0;
      let matchedBracketStr = '';
      for (const bracket of rule.flatTaxTable.tableBByPrice) {
        if (taxableBase >= bracket.minPrice && (bracket.maxPrice === undefined || taxableBase <= bracket.maxPrice)) {
          matchedFee = bracket.fee;
          matchedBracketStr = bracket.maxPrice !== undefined
            ? `$${bracket.minPrice.toLocaleString()}–$${bracket.maxPrice.toLocaleString()}`
            : `$${bracket.minPrice.toLocaleString()}+`;
          break;
        }
      }
      exciseTax = matchedFee;
      flatTaxDetail = `Form RUT-50 Table B flat tax (${matchedBracketStr} bracket)`;
    }
  } else {
    if (rule.priceTiers && rule.priceTiers.length > 0) {
      for (const tier of rule.priceTiers) {
        if (tier.maxPrice === null || taxableBase < tier.maxPrice) {
          effectiveRate = tier.rate;
          tierApplied = true;
          break;
        }
      }
    } else if (
      typeof rule.luxuryTaxThreshold === 'number' &&
      typeof rule.luxuryTaxRate === 'number' &&
      taxableBase > rule.luxuryTaxThreshold
    ) {
      effectiveRate = rule.luxuryTaxRate;
      luxuryTaxApplied = true;
    }

    const rawTax = taxableBase * effectiveRate;
    exciseTax = Math.round(rawTax * 100) / 100;

    if (price > 0 && typeof rule.minExciseTax === 'number' && exciseTax < rule.minExciseTax) {
      exciseTax = rule.minExciseTax;
      minTaxApplied = true;
    } else if (price > 0 && typeof rule.maxExciseTax === 'number' && exciseTax > rule.maxExciseTax) {
      exciseTax = rule.maxExciseTax;
      maxTaxApplied = true;
    }
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
      const rates = motoRule as Record<string, number>;
      if (rates[String(term)] !== undefined) {
        baseRegistrationFee = rates[String(term)];
      } else if (term === 2 && rates['1'] !== undefined) {
        baseRegistrationFee = rates['1'] * 2;
      } else if (term === 1 && rates['2'] !== undefined) {
        baseRegistrationFee = rates['2'] / 2;
      }
    } else if (typeof motoRule === 'number') {
      baseRegistrationFee = term === 1 ? motoRule / 2 : motoRule;
    }
  } else {
    const passMap = rule.registration.passenger as Record<string, unknown>;

    // Support explicit numerical vehicle weight (e.g. 3,400 lbs vs 3,600 lbs vs 4,000 lbs)
    const numericWeight = inputs.vehicleWeight ?? inputs.vehicleWeightLbs ?? inputs.weight;
    let resolvedWeightClass: string = inputs.weightClass;
    if (typeof numericWeight === 'number' && numericWeight > 0) {
      if (numericWeight <= 3500) {
        resolvedWeightClass = 'under3500lbs';
      } else if (numericWeight <= 3700) {
        resolvedWeightClass = '3501to3700lbs';
      } else {
        resolvedWeightClass = 'over3700lbs';
      }
    }

    let passRule = passMap[resolvedWeightClass];
    // Fallback if specific tier key isn't present in this state's rules
    if (!passRule) {
      if (resolvedWeightClass === 'under3500lbs') {
        passRule = passMap['3501to3700lbs'] || passMap.under3700lbs || passMap.standard;
      } else if (resolvedWeightClass === '3501to3700lbs') {
        passRule = passMap.under3700lbs || passMap.under3500lbs || passMap.standard;
      } else if (resolvedWeightClass === 'under3700lbs') {
        passRule = passMap['3501to3700lbs'] || passMap.under3500lbs || passMap.standard;
      } else {
        passRule = passMap.over3700lbs || passMap.heavy || passMap.standard;
      }
    }

    if (typeof passRule === 'object' && passRule !== null) {
      const rates = passRule as Record<string, number>;
      if (rates[String(term)] !== undefined) {
        baseRegistrationFee = rates[String(term)];
      } else if (term === 2 && rates['1'] !== undefined) {
        baseRegistrationFee = rates['1'] * 2;
      } else if (term === 1 && rates['2'] !== undefined) {
        baseRegistrationFee = rates['2'] / 2;
      }
    } else if (typeof passRule === 'number') {
      baseRegistrationFee = term === 1 ? passRule / 2 : passRule;
    }
  }

  // EV / PHEV surcharges (if state levies annual surcharge)
  let evSurcharge = 0;
  if (inputs.fuelType === 'ev' && rule.registration.evSurchargeAnnual) {
    evSurcharge = rule.registration.evSurchargeAnnual * term;
  } else if (inputs.fuelType === 'phev' && rule.registration.phevSurchargeAnnual) {
    evSurcharge = rule.registration.phevSurchargeAnnual * term;
  }

  const registrationTotal = baseRegistrationFee + evSurcharge;

  // 5. Local Tax & Total First-Year Out-Of-Pocket Cost
  const hasLocalTax =
    typeof rule.localTaxMinRate === 'number' &&
    typeof rule.localTaxMaxRate === 'number' &&
    taxableBase > 0;

  const localTaxMin = hasLocalTax
    ? Math.round(taxableBase * rule.localTaxMinRate! * 100) / 100
    : undefined;
  const localTaxMax = hasLocalTax
    ? Math.round(taxableBase * rule.localTaxMaxRate! * 100) / 100
    : undefined;

  const combinedTaxMin = hasLocalTax
    ? Math.round((exciseTax + (localTaxMin || 0)) * 100) / 100
    : undefined;
  const combinedTaxMax = hasLocalTax
    ? Math.round((exciseTax + (localTaxMax || 0)) * 100) / 100
    : undefined;

  const otherFees = titleFee + lienFilingFee + registrationTotal;
  const totalFirstYearCost =
    Math.round((exciseTax + otherFees) * 100) / 100;

  const totalFirstYearCostMin = hasLocalTax
    ? Math.round(((combinedTaxMin || 0) + otherFees) * 100) / 100
    : undefined;
  const totalFirstYearCostMax = hasLocalTax
    ? Math.round(((combinedTaxMax || 0) + otherFees) * 100) / 100
    : undefined;

  // Age rule calculation (e.g. Maryland & Virginia book value checks for vehicles <= 7 or 5 years)
  const bookValueApplies = Boolean(rule.bookValueRule && vehicleAge <= 7);

  // Trade-in reporting
  const tradeInDeducted = rule.tradeInDeductible ? Math.min(price, tradeIn) : 0;
  const tradeInIgnored = tradeIn > 0 && !rule.tradeInDeductible;

  // Tax rate display formatted nicely (e.g. 6.5%, 4.15%, 6%, 5.25%, 5%, 7.75%, 0%)
  const appliedRate = tierApplied
    ? effectiveRate
    : luxuryTaxApplied && typeof rule.luxuryTaxRate === 'number'
      ? rule.luxuryTaxRate
      : rule.exciseTaxRate;
  const ratePercent = Number((appliedRate * 100).toFixed(2));
  const rateLabel = `${ratePercent}%`;

  const formatCurrencyLocal = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val);
  };

  let taxDescription = `Calculated at ${rateLabel} on taxable base of $${taxableBase.toLocaleString()}`;
  if (tierApplied && effectiveRate === 0) {
    taxDescription = hasLocalTax && localTaxMin !== undefined && localTaxMax !== undefined
      ? `State tax: Exempt (purchase price under tier threshold) + Local tax (varies by county) ${formatCurrencyLocal(localTaxMin)}–${formatCurrencyLocal(localTaxMax)}`
      : `Exempt from state vehicle sales tax (purchase price under tier threshold)`;
  } else if (hasLocalTax && localTaxMin !== undefined && localTaxMax !== undefined) {
    taxDescription = `State tax ${formatCurrencyLocal(exciseTax)} + Local tax (varies by county) ${formatCurrencyLocal(localTaxMin)}–${formatCurrencyLocal(localTaxMax)}`;
  } else if (flatTaxApplied) {
    taxDescription = flatTaxDetail;
  } else if (tierApplied) {
    taxDescription = effectiveRate === 0
      ? `Exempt from state vehicle sales tax (purchase price under tier threshold)`
      : `Calculated at ${rateLabel} tiered rate on taxable base of $${taxableBase.toLocaleString()}`;
  } else if (rule.exciseTaxRate === 0) {
    taxDescription = `Exempt from vehicle sales tax (private-party occasional sales are not taxed in ${rule.label})`;
  } else if (luxuryTaxApplied) {
    taxDescription = `Calculated at ${rateLabel} luxury vehicle rate (purchase price over $${rule.luxuryTaxThreshold?.toLocaleString()})`;
  } else if (maxTaxApplied) {
    taxDescription = `Statutory maximum tax cap applied ($${rule.maxExciseTax?.toFixed(2)})`;
  } else if (minTaxApplied) {
    taxDescription = `Statutory minimum tax floor applied ($${rule.minExciseTax?.toFixed(2)})`;
  } else if (rule.tradeInDeductible && tradeIn > 0) {
    taxDescription = `${rateLabel} on net sale price after $${tradeIn.toLocaleString()} trade-in credit`;
  } else if (rule.taxBase === 'fairMarketValue') {
    taxDescription = `${rateLabel} assessed on vehicle Fair Market Value`;
  }

  // Itemized breakdown in exact §3 order:
  // 1. Excise tax
  // 2. Title fee
  // 3. Lien filing fee
  // 4. Registration/tag fee
  // 5. Total first-year cost
  const itemizedList = [
    {
      id: 'excise-tax',
      label: hasLocalTax
        ? `Vehicle Sales / Excise Tax (${rateLabel} State + Local Range)`
        : rule.flatTaxTable
        ? `${rule.label} Vehicle Use Tax (Form RUT-50 Table)`
        : `Vehicle Sales / Excise Tax (${rateLabel})`,
      amount: exciseTax,
      amountMax: combinedTaxMax,
      amountRangeFormatted: hasLocalTax && combinedTaxMin !== undefined && combinedTaxMax !== undefined
        ? `${formatCurrencyLocal(combinedTaxMin)} – ${formatCurrencyLocal(combinedTaxMax)}`
        : undefined,
      description: taxDescription
    },
    {
      id: 'title-fee',
      label: 'Certificate of Title Fee',
      amount: titleFee,
      description: 'Standard state certificate of title issuance'
    },
    {
      id: 'lien-filing-fee',
      label: 'Lien / Security Filing Fee',
      amount: lienFilingFee,
      description: inputs.isFinanced
        ? 'Required when financing purchase through a lender'
        : 'Waived ($0.00) for cash / unfinanced purchase'
    },
    {
      id: 'registration-fee',
      label: `Registration & Tags (${term}-Year Term)`,
      amount: registrationTotal,
      description:
        evSurcharge > 0
          ? `Base tag fee ($${baseRegistrationFee.toFixed(2)}) + EV/PHEV surcharge ($${evSurcharge.toFixed(2)})`
          : `${rule.label} license plates and tag registration`
    },
    {
      id: 'total-cost',
      label: 'Total First-Year Out-of-Pocket Cost',
      amount: totalFirstYearCost,
      amountMax: totalFirstYearCostMax,
      amountRangeFormatted: hasLocalTax && totalFirstYearCostMin !== undefined && totalFirstYearCostMax !== undefined
        ? `${formatCurrencyLocal(totalFirstYearCostMin)} – ${formatCurrencyLocal(totalFirstYearCostMax)}`
        : undefined,
      description: hasLocalTax
        ? 'Sum of all mandatory state and estimated local taxes and fees for year one'
        : 'Sum of all mandatory state taxes and fees for year one',
      isHero: true
    }
  ];

  return {
    exciseTax,
    localTaxMin,
    localTaxMax,
    combinedTaxMin,
    combinedTaxMax,
    hasLocalTax: Boolean(hasLocalTax),
    titleFee,
    lienFilingFee,
    baseRegistrationFee,
    evSurcharge,
    registrationTotal,
    totalFirstYearCost,
    totalFirstYearCostMin,
    totalFirstYearCostMax,
    minTaxApplied,
    maxTaxApplied,
    luxuryTaxApplied,
    bookValueApplies,
    vehicleAge,
    tradeInDeducted,
    tradeInIgnored,
    veipFee: rule.veipFee ?? 0,
    taxBase: rule.taxBase,
    itemizedList
  };
}
