import { CalculatorInputs, CostBreakdown, StateRule } from './types';
import { RATES_VERIFIED_YEAR } from './constants';

/**
 * Annual registration by original list price (Michigan brackets, Minnesota fixed + rate), reduced
 * by the year's factor. Michigan reduces the fee itself; Minnesota reduces the value taxed.
 */
function listPriceRegistrationFee(
  reg: NonNullable<StateRule['registration']['listPriceRegistration']>,
  listPrice: number,
  registrationYear: number
): number {
  if (reg.flatFromYear && registrationYear >= reg.flatFromYear.year) return reg.flatFromYear.fee;
  const factor = reg.yearFactors[Math.min(registrationYear, reg.yearFactors.length) - 1];
  if (reg.brackets && reg.brackets.length > 0) {
    const top = reg.brackets[reg.brackets.length - 1];
    const bracket = reg.brackets.find((b) => listPrice <= b.maxPrice);
    const firstYear = bracket
      ? bracket.fee
      : top.fee + Math.ceil((listPrice - top.maxPrice) / 1000) * (reg.perThousandOverTop ?? 0);
    return Math.round(firstYear * factor * 100) / 100;
  }
  return Math.round(((reg.fixed ?? 0) + (reg.rate ?? 0) * listPrice * factor) * 100) / 100;
}

/**
 * Pure calculation engine for vehicle tax, tags, and titling costs across US states.
 * Consumes state rules without per-state code branches.
 */
export function calculateVehicleCosts(
  rule: StateRule,
  inputs: CalculatorInputs,
  referenceYear: number = RATES_VERIFIED_YEAR
): CostBreakdown {
  const price = Math.max(0, Number(inputs.purchasePrice) || 0);
  const tradeIn = Math.max(0, Number(inputs.tradeInValue) || 0);

  const vehicleAge = Math.max(0, referenceYear - inputs.vehicleYear);

  // 1. Taxable base calculation
  // Book value assessment (e.g. Maryland): a vehicle younger than maxVehicleAge sold for more than
  // the threshold below its entered book value is assessed on the book value instead of the price.
  const bookValue = Number(inputs.bookValue);
  const assessment = rule.bookValueAssessment;
  const bookValueApplied = Boolean(
    assessment &&
      Number.isFinite(bookValue) &&
      bookValue > 0 &&
      price > 0 &&
      vehicleAge < assessment.maxVehicleAge &&
      price < bookValue - assessment.priceBelowBookThreshold
  );
  // Presumptive value rule (e.g. Texas SPV): taxed on the greater of the price or a share of the
  // presumptive value; a certified appraisal replaces that test but never goes below the price.
  const presumptive = Number(inputs.presumptiveValue);
  const appraised = Number(inputs.appraisedValue);
  let presumptiveValueApplied: 'presumptive' | 'appraisal' | undefined;
  let assessedValue = bookValueApplied ? bookValue : price;
  if (rule.presumptiveValueRule && price > 0 && Number.isFinite(presumptive) && presumptive > 0) {
    if (Number.isFinite(appraised) && appraised > 0) {
      if (appraised > price) {
        assessedValue = appraised;
        presumptiveValueApplied = 'appraisal';
      }
    } else {
      const floor = Math.round(presumptive * rule.presumptiveValueRule.minShareOfValue * 100) / 100;
      if (floor > price) {
        assessedValue = floor;
        presumptiveValueApplied = 'presumptive';
      }
    }
  }

  // Some states (e.g. Delaware) allow trade-in credit; others (Maryland, Virginia, Pennsylvania, DC, Illinois) tax the full price
  const taxableBase = rule.tradeInDeductible
    ? Math.max(0, assessedValue - tradeIn)
    : assessedValue;

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
    } else if (inputs.vehicleType === 'motorcycle' && rule.flatTaxTable.motorcycleFee !== undefined) {
      exciseTax = rule.flatTaxTable.motorcycleFee;
      flatTaxDetail = 'Form RUT-50 flat tax for motorcycles';
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

  // Older, low-priced vehicles pay a flat tax instead (Minnesota: $10), and used vehicle excise
  // floors replace the plain rate (Oklahoma: $20 on the first $1,500, then 3.25%)
  let specialTaxDetail = '';
  const older = rule.olderVehicleFlatTax;
  const olderFlatTaxApplied = Boolean(
    !rule.flatTaxTable && older && price > 0 && vehicleAge >= older.minAge && taxableBase < older.maxPrice
  );
  if (older && olderFlatTaxApplied) {
    exciseTax = older.tax;
    specialTaxDetail = `$${older.tax} flat tax for a vehicle ${older.minAge} or more years old sold for under $${older.maxPrice.toLocaleString()}`;
  } else if (!rule.flatTaxTable && rule.usedVehicleExcise && taxableBase > 0) {
    const { flatTax, flatTaxCovers } = rule.usedVehicleExcise;
    exciseTax = Math.round((flatTax + Math.max(0, taxableBase - flatTaxCovers) * rule.exciseTaxRate) * 100) / 100;
    specialTaxDetail = `Excise tax $${flatTax} on the first $${flatTaxCovers.toLocaleString()} + ${Number((rule.exciseTaxRate * 100).toFixed(2))}% of the rest ($${exciseTax.toFixed(2)})`;
  }
  let additionalSalesTax = 0;
  if (rule.additionalSalesTaxRate && taxableBase > 0 && !olderFlatTaxApplied) {
    additionalSalesTax = Math.round(taxableBase * rule.additionalSalesTaxRate * 100) / 100;
    exciseTax = Math.round((exciseTax + additionalSalesTax) * 100) / 100;
    specialTaxDetail = `${specialTaxDetail || `Excise tax ${Number((rule.exciseTaxRate * 100).toFixed(2))}%`} + ${Number((rule.additionalSalesTaxRate * 100).toFixed(2))}% sales tax ($${additionalSalesTax.toFixed(2)})`;
  }

  // 2. Title Certificate Fee
  const titleFee = rule.titleFee;

  // 3. Lien Filing Fee (only applied if financed)
  const lienFilingFee = inputs.isFinanced ? rule.lienFilingFee : 0;

  // 4. Registration & Tag Fee
  const term = inputs.registrationTerm;
  let baseRegistrationFee = 0;

  // The registration year counts the model year as year 1 (Oklahoma, Michigan, Minnesota)
  const registrationYear = vehicleAge + 1;
  const feesByYear = rule.registration.feesByRegistrationYear;
  const listPriceReg = rule.registration.listPriceRegistration;
  let listPriceUsed: number | undefined;

  if (feesByYear) {
    const table = inputs.vehicleType === 'motorcycle' ? feesByYear.motorcycle : feesByYear.passenger;
    const row = table.find((r) => r.maxYear === undefined || registrationYear <= r.maxYear);
    baseRegistrationFee = (row?.fee ?? 0) * term;
  } else if (listPriceReg && inputs.vehicleType === 'passenger') {
    const entered = Number(inputs.listPrice);
    listPriceUsed = Number.isFinite(entered) && entered > 0 ? entered : listPriceReg.defaultListPrice;
    baseRegistrationFee = Math.round(listPriceRegistrationFee(listPriceReg, listPriceUsed, registrationYear) * term * 100) / 100;
  } else if (rule.registration.salePricePlate && inputs.vehicleType === 'passenger') {
    // Louisiana: the plate is a share of the sale price, rounded to the nearest $1,000, $10,000 minimum
    const plate = rule.registration.salePricePlate;
    const value = Math.max(plate.minValue, Math.round(price / plate.roundTo) * plate.roundTo);
    baseRegistrationFee = Math.round(value * plate.ratePerYear * term * 100) / 100;
  } else if (inputs.vehicleType === 'motorcycle') {
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
  } else if (rule.registration.passengerWeightChart) {
    // Weight chart states (New York): look up the entered weight, or the chart's default
    const chart = rule.registration.passengerWeightChart;
    const enteredWeight = inputs.vehicleWeight ?? inputs.vehicleWeightLbs ?? inputs.weight;
    const lbs = typeof enteredWeight === 'number' && enteredWeight > 0 ? enteredWeight : chart.defaultWeightLbs;
    const tier = chart.tiers.find((t) => t.maxLbs === undefined || lbs <= t.maxLbs);
    baseRegistrationFee = Math.round(((tier?.fee ?? 0) * term) / chart.termYears * 100) / 100;
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

  // Value-based registration fees (California): estimated from the purchase price, which becomes
  // the vehicle's value for these fees when a registered vehicle is transferred. Skipped at $0.
  let vehicleLicenseFee = 0;
  let transportationImprovementFee = 0;
  const valueFees = rule.registration.valueBasedFees;
  if (valueFees && price > 0) {
    vehicleLicenseFee = Math.round(price * valueFees.licenseFeeRate * term * 100) / 100;
    const tier = [...valueFees.improvementFeeTiers]
      .sort((a, b) => b.minValue - a.minValue)
      .find((t) => price >= t.minValue);
    transportationImprovementFee = (tier?.fee ?? 0) * term;
  }

  const registrationTotal =
    Math.round((baseRegistrationFee + evSurcharge + vehicleLicenseFee + transportationImprovementFee) * 100) / 100;

  // 5. Local Tax & Total First-Year Out-Of-Pocket Cost
  // A chosen locality (Pennsylvania) fixes the local rate, so the result is one total, not a range
  const locality = rule.localities?.find((l) => l.id === inputs.localityId);
  const stateExemptFromLocal = Boolean(rule.noLocalTaxWhenStateExempt && tierApplied && effectiveRate === 0);
  const hasLocalTax =
    typeof rule.localTaxMinRate === 'number' &&
    typeof rule.localTaxMaxRate === 'number' &&
    taxableBase > 0 &&
    !stateExemptFromLocal &&
    !locality;

  // Some local taxes apply only up to a cap (Florida surtax: first $5,000 of the price)
  const localTaxBase =
    typeof rule.localTaxBaseCap === 'number' ? Math.min(taxableBase, rule.localTaxBaseCap) : taxableBase;
  const localTaxMin = hasLocalTax
    ? Math.round(localTaxBase * rule.localTaxMinRate! * 100) / 100
    : undefined;
  const localTaxMax = hasLocalTax
    ? Math.round(localTaxBase * rule.localTaxMaxRate! * 100) / 100
    : undefined;

  const combinedTaxMin = hasLocalTax
    ? Math.round((exciseTax + (localTaxMin || 0)) * 100) / 100
    : undefined;
  const combinedTaxMax = hasLocalTax
    ? Math.round((exciseTax + (localTaxMax || 0)) * 100) / 100
    : undefined;

  const stateTax = exciseTax;
  let localityTax = 0;
  if (locality && taxableBase > 0 && !stateExemptFromLocal) {
    localityTax = Math.round(localTaxBase * locality.localRate * 100) / 100;
    exciseTax = Math.round((exciseTax + localityTax) * 100) / 100;
  }

  // One-time fees when the buyer has no plate to transfer (Florida), shown as their own lines
  const plateFees = rule.registration.newPlateFees;
  const needsNewPlate = Boolean(plateFees) && !inputs.hasPlateToTransfer;
  const initialRegistrationFee = needsNewPlate ? plateFees!.initialRegistrationFee : 0;
  const newPlateFee = needsNewPlate ? plateFees!.plateFee : 0;

  const otherFees = titleFee + lienFilingFee + registrationTotal + initialRegistrationFee + newPlateFee;
  const totalFirstYearCost =
    Math.round((exciseTax + otherFees) * 100) / 100;

  const totalFirstYearCostMin = hasLocalTax
    ? Math.round(((combinedTaxMin || 0) + otherFees) * 100) / 100
    : undefined;
  const totalFirstYearCostMax = hasLocalTax
    ? Math.round(((combinedTaxMax || 0) + otherFees) * 100) / 100
    : undefined;

  // Age rule calculation: states with a structured bookValueAssessment (Maryland) or a
  // bookValueNotice (Virginia) use its age limit (under maxVehicleAge); other states with a
  // bookValueRule keep the general <= 7 years check
  const bookValueApplies = assessment
    ? vehicleAge < assessment.maxVehicleAge
    : rule.bookValueNotice
      ? vehicleAge < rule.bookValueNotice.maxVehicleAge
      : Boolean(rule.bookValueRule && vehicleAge <= 7);

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
  } else if (locality) {
    taxDescription = `State tax ${formatCurrencyLocal(stateTax)} (${rateLabel}) + ${locality.label} local tax ${formatCurrencyLocal(localityTax)} (${Number((locality.localRate * 100).toFixed(3))}%)`;
  } else if (hasLocalTax && localTaxMin !== undefined && localTaxMax !== undefined) {
    taxDescription = `State tax ${formatCurrencyLocal(exciseTax)} + Local tax (varies by county) ${formatCurrencyLocal(localTaxMin)}–${formatCurrencyLocal(localTaxMax)}${
      localTaxBase < taxableBase ? ` on the first ${formatCurrencyLocal(localTaxBase)}` : ''
    }`;
  } else if (specialTaxDetail) {
    taxDescription = specialTaxDetail;
  } else if (flatTaxApplied) {
    taxDescription = flatTaxDetail;
  } else if (tierApplied) {
    taxDescription = effectiveRate === 0
      ? `Exempt from state vehicle sales tax (purchase price under tier threshold)`
      : `Calculated at ${rateLabel} tiered rate on taxable base of $${taxableBase.toLocaleString()}`;
  } else if (rule.exciseTaxRate === 0) {
    taxDescription = `Exempt from vehicle sales tax (private-party occasional sales are not taxed in ${rule.label})`;
  } else if (presumptiveValueApplied === 'presumptive') {
    taxDescription = `Calculated at ${rateLabel} on ${Number(((rule.presumptiveValueRule?.minShareOfValue ?? 0) * 100).toFixed(0))}% of Standard Presumptive Value ($${taxableBase.toLocaleString()}), which is more than the price`;
  } else if (presumptiveValueApplied === 'appraisal') {
    taxDescription = `Calculated at ${rateLabel} on the certified appraisal value ($${taxableBase.toLocaleString()})`;
  } else if (bookValueApplied) {
    taxDescription = `Calculated at ${rateLabel} on book value of $${taxableBase.toLocaleString()} (price is more than $${assessment?.priceBelowBookThreshold.toLocaleString()} below book value)`;
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
      label: locality
        ? `Vehicle Sales / Excise Tax (${Number(((effectiveRate + locality.localRate) * 100).toFixed(3))}% in ${locality.label})`
        : hasLocalTax
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
        [
          vehicleLicenseFee > 0 || transportationImprovementFee > 0 || evSurcharge > 0
            ? `Base tag fee ($${baseRegistrationFee.toFixed(2)})`
            : `${rule.label} license plates and tag registration`,
          evSurcharge > 0 ? `EV/PHEV surcharge ($${evSurcharge.toFixed(2)})` : '',
          vehicleLicenseFee > 0
            ? `vehicle license fee ($${vehicleLicenseFee.toFixed(2)}, ${Number(((valueFees?.licenseFeeRate ?? 0) * 100).toFixed(2))}% of price)`
            : '',
          transportationImprovementFee > 0 ? `transportation improvement fee ($${transportationImprovementFee.toFixed(2)})` : ''
        ]
          .filter(Boolean)
          .join(' + ')
    },
    ...(needsNewPlate
      ? [
          {
            id: 'initial-registration-fee',
            label: 'Initial Registration Fee',
            amount: initialRegistrationFee,
            description: 'One-time fee when you have no plate of your own to transfer'
          },
          {
            id: 'new-plate-fee',
            label: 'New License Plate',
            amount: newPlateFee,
            description: 'New metal plate when you have no plate to transfer'
          }
        ]
      : []),
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
    ...(locality ? { localityLabel: locality.label, localityTax } : {}),
    titleFee,
    lienFilingFee,
    baseRegistrationFee,
    evSurcharge,
    vehicleLicenseFee,
    transportationImprovementFee,
    registrationTotal,
    ...(plateFees ? { initialRegistrationFee, newPlateFee } : {}),
    ...(listPriceUsed !== undefined ? { listPriceUsed } : {}),
    totalFirstYearCost,
    totalFirstYearCostMin,
    totalFirstYearCostMax,
    minTaxApplied,
    maxTaxApplied,
    luxuryTaxApplied,
    bookValueApplies,
    bookValueApplied,
    presumptiveValueApplied,
    vehicleAge,
    tradeInDeducted,
    tradeInIgnored,
    veipFee: rule.veipFee ?? 0,
    taxBase: rule.taxBase,
    itemizedList
  };
}
