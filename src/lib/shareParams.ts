import { CalculatorInputs, FuelType, RegistrationTerm, StateRule, WeightClass } from './types';
import { getDefaultModelYear } from './constants';

type SearchParamsLike = Pick<URLSearchParams, 'get' | 'has'>;

const WEIGHT_CLASSES: readonly WeightClass[] = ['under3500lbs', '3501to3700lbs', 'under3700lbs', 'over3700lbs'];
const FUEL_TYPES: readonly FuelType[] = ['gasoline', 'ev', 'phev'];

/** Returns the share-link value if it is one of the allowed options, otherwise the fallback. */
function pickAllowed<T extends string>(value: string | null, allowed: readonly T[], fallback: T): T {
  return value !== null && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

/** Share-link book value: a positive finite number, otherwise undefined (treated as blank). */
export function parseBookValue(value: string | null): number | undefined {
  if (value === null || value.trim() === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

/** The registration terms a state offers (1, 2, or 3 years), sorted; 2-year if none are configured. */
export function getOfferedTerms(rule: StateRule): RegistrationTerm[] {
  const offered = [...new Set(rule.registration.terms)]
    .filter((t): t is RegistrationTerm => t === 1 || t === 2 || t === 3)
    .sort((a, b) => a - b);
  return offered.length > 0 ? offered : [2];
}

/** The state's own default registration term: 2-year where offered, otherwise its only term. */
export function getDefaultTerm(rule: StateRule): RegistrationTerm {
  const offered = getOfferedTerms(rule);
  return offered.includes(2) ? 2 : offered[0];
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
 * defaults. Links without price, year, or type are ignored. A missing term, or a term the state
 * does not offer, falls back to the state's default term. Invalid weight= or fuel= values fall back
 * to the defaults.
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
    // Unknown or mistyped values fall back to the defaults instead of reaching the engine
    weightClass: pickAllowed(params.get('weight'), WEIGHT_CLASSES, defaults.weightClass),
    fuelType: pickAllowed(params.get('fuel'), FUEL_TYPES, defaults.fuelType),
    // A ?term= the state does not offer falls back to the state's default term
    registrationTerm: params.has('term') && getOfferedTerms(rule).includes(Number(params.get('term')) as RegistrationTerm)
      ? (Number(params.get('term')) as RegistrationTerm)
      : getDefaultTerm(rule),
    isFinanced: params.get('financed') === 'true',
    tradeInValue: params.has('tradeIn') ? Math.max(0, Number(params.get('tradeIn')) || 0) : defaults.tradeInValue,
    bookValue: parseBookValue(params.get('book')) ?? defaults.bookValue,
    presumptiveValue: parseBookValue(params.get('spv')) ?? defaults.presumptiveValue,
    appraisedValue: parseBookValue(params.get('appraisal')) ?? defaults.appraisedValue,
    ...(rule.registration.newPlateFees ? { hasPlateToTransfer: params.get('plate') === 'yes' } : {}),
    ...(rule.registration.listPriceRegistration
      ? { listPrice: parseBookValue(params.get('msrp')) ?? defaults.listPrice }
      : {}),
    vehicleWeight: rule.registration.passengerWeightChart
      ? parseBookValue(params.get('lbs')) ?? defaults.vehicleWeight
      : defaults.vehicleWeight
  };
}
