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
