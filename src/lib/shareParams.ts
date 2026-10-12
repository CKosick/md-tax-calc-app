import { CalculatorInputs, FuelType, StateRule, WeightClass } from './types';
import { getDefaultModelYear } from './constants';

type SearchParamsLike = Pick<URLSearchParams, 'get' | 'has'>;

/** The state's own default registration term: 1-year when that is all it offers, else 2-year. */
export function getDefaultTerm(rule: StateRule): 1 | 2 {
  return rule.registration.terms.includes(1) && !rule.registration.terms.includes(2) ? 1 : 2;
}

/** Fresh calculator inputs for a state, before any share-link params are applied. */
export function getDefaultInputs(rule: StateRule, calculationYear: number): CalculatorInputs {
  return {
    state: rule.slug,
    vehicleType: 'passenger',
    purchasePrice: 15000,
    vehicleYear: getDefaultModelYear(calculationYear),
    weightClass: rule.registration.passenger.under3500lbs ? 'under3500lbs' : 'under3700lbs',
    fuelType: 'gasoline',
    registrationTerm: getDefaultTerm(rule),
    isFinanced: false,
    tradeInValue: 0
  };
}

/**
 * Applies shared / saved calculation link params (?price=&year=&type=...) on top of the
 * defaults. Links without price, year, or type are ignored. A missing term falls back to
 * the state's default term; an explicit ?term= wins.
 */
export function inputsFromSearchParams(
  rule: StateRule,
  params: SearchParamsLike | null | undefined,
  defaults: CalculatorInputs
): CalculatorInputs {
  if (!params || (!params.has('price') && !params.has('year') && !params.has('type'))) {
    return defaults;
  }

  return {
    ...defaults,
    purchasePrice: params.has('price') ? Math.max(0, Number(params.get('price')) || 0) : defaults.purchasePrice,
    vehicleYear: params.has('year') ? Number(params.get('year')) || defaults.vehicleYear : defaults.vehicleYear,
    vehicleType: params.get('type') === 'motorcycle' ? 'motorcycle' : 'passenger',
    weightClass: (params.get('weight') || defaults.weightClass) as WeightClass,
    fuelType: (params.get('fuel') || defaults.fuelType) as FuelType,
    registrationTerm: params.has('term')
      ? Number(params.get('term')) === 1 ? 1 : 2
      : getDefaultTerm(rule),
    isFinanced: params.get('financed') === 'true',
    tradeInValue: params.has('tradeIn') ? Math.max(0, Number(params.get('tradeIn')) || 0) : defaults.tradeInValue
  };
}
