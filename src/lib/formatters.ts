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

export function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(2)}%`;
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
