export const LAST_VERIFIED_DATE = 'September 2026';

/**
 * Year the statutory rates in stateRules.json were last verified. Drives the
 * "Verified for 2026" style badges. Change it only when the rates are re-verified,
 * never because the calendar rolled over.
 */
export const RATES_VERIFIED_YEAR = 2026;

/** Calendar year used for vehicle age math, model year presets, and dated filenames. */
export function getCalculationYear(now: Date = new Date()): number {
  return now.getFullYear();
}

/** Model year preset chips, newest first, relative to the calculation year. */
export function getModelYearPresets(calculationYear: number): number[] {
  return [2, 5, 7, 9, 11].map((yearsBack) => calculationYear - yearsBack);
}

/** Default model year for a fresh calculator (one of the presets). */
export function getDefaultModelYear(calculationYear: number): number {
  return calculationYear - 7;
}
