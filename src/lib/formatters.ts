/**
 * Helper utilities for currency, fee, and rate formatting.
 */

export function formatFee(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/** A dollar amount for running copy: "$200" for whole dollars, "$15.50" otherwise. */
export function formatDollars(amount: number): string {
  const whole = Number.isInteger(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2
  }).format(amount);
}

/**
 * A rate as a percent number, kept to three decimals so rates like Missouri's 4.225% and
 * New Jersey's 6.625% are never rounded (0.04225 -> 4.225, 0.06 -> 6).
 */
export function ratePercent(rate: number): number {
  return Number((rate * 100).toFixed(3));
}

/** A rate for tables and badges: at least two decimals, up to three (6.00, 4.225). No % sign. */
export function formatPercentValue(rate: number): string {
  return (rate * 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3, useGrouping: false });
}

export function formatPercent(rate: number): string {
  return `${formatPercentValue(rate)}%`;
}

/** Registration term phrase from the terms a state offers: [1] -> "1-year", [1, 2] -> "1 or 2-year". */
export function formatTermPhrase(terms: number[]): string {
  const sorted = [...terms].sort((a, b) => a - b);
  if (sorted.length <= 1) return `${sorted[0] ?? 1}-year`;
  return `${sorted.slice(0, -1).join(', ')} or ${sorted[sorted.length - 1]}-year`;
}

/**
 * Age label for the model year field. Never shows a negative age: a model year
 * ahead of the calculation year is labeled as a next model year vehicle.
 */
export function formatVehicleAge(modelYear: number, calculationYear: number): string {
  const age = calculationYear - modelYear;
  if (age < 0) return 'Next model year';
  if (age === 0) return 'New this year';
  return `${age} ${age === 1 ? 'year' : 'years'} old`;
}
