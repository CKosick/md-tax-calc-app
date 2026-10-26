import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

import VehicleTaxByStatePage from '../src/app/vehicle-tax-by-state/page';
import { getComparisonDataset, verifiedDateSpan } from '../src/lib/stateComparison';
import { calculateVehicleCosts } from '../src/lib/calculator';
import stateRulesData from '../src/config/stateRules.json';
import { StateRulesConfig } from '../src/lib/types';
import { STANDARD_SCENARIO_INPUTS } from '../src/lib/stateComparison';

const rules = stateRulesData as StateRulesConfig;
const labelToDate = new Map(Object.values(rules).map((r) => [r.label, r.lastVerified]));

afterEach(() => cleanup());

// Reads each rendered table row's state name and its "Verified ..." suffix
const rowDates = (table: Element) =>
  [...table.querySelectorAll('tbody tr')].map((tr) => {
    const name = tr.querySelector('a')?.textContent?.trim() ?? '';
    const date = tr.querySelector('.row-verified')?.textContent?.replace('Verified', '').trim() ?? '';
    return [name, date] as const;
  });

describe('Comparison page shows each state’s verified date from its config', () => {
  it('the dataset rows carry each state’s lastVerified, in all three tables', () => {
    const dataset = getComparisonDataset();
    for (const rows of [dataset.heroRows, dataset.taxRateRows, dataset.titleFeeRows]) {
      expect(rows).toHaveLength(51);
      for (const row of rows) expect(row.lastVerified).toBe(rules[row.key].lastVerified);
    }
  });

  it('all 51 rows of each table show the date from the config', () => {
    const { container } = render(<VehicleTaxByStatePage />);
    const tables = [...container.querySelectorAll('table')];
    expect(tables).toHaveLength(3);
    for (const table of tables) {
      const rows = rowDates(table);
      expect(rows).toHaveLength(51);
      for (const [name, date] of rows) expect(date, name).toBe(labelToDate.get(name));
    }
    const rows = rowDates(tables[0]);
    for (const [name, date] of rows) {
      expect(date, name).toBe(labelToDate.get(name));
    }
    // The re-checked states show their October date and the rest September, as configured
    const october = rows.filter(([, d]) => d === 'October 2026').map(([n]) => n).sort();
    const configuredOctober = Object.values(rules).filter((r) => r.lastVerified === 'October 2026').map((r) => r.label).sort();
    expect(october).toEqual(configuredOctober);
  });

  it('one line explains the rolling re-checks, and the header shows the span of dates', () => {
    const { container } = render(<VehicleTaxByStatePage />);
    expect(container.querySelector('#rolling-recheck-note')?.textContent).toContain('re-check states against official sources on a rolling basis');
    const span = verifiedDateSpan(Object.values(rules).map((r) => r.lastVerified));
    expect(container.textContent).toContain(`Verified ${span}`);
    expect(container.textContent).not.toContain('— Verified');
  });

  it('ranking and totals are unchanged: each row still matches the engine', () => {
    const dataset = getComparisonDataset();
    for (const row of dataset.heroRows) {
      const b = calculateVehicleCosts(rules[row.key], { ...STANDARD_SCENARIO_INPUTS, state: row.key });
      expect(row.totalCost).toBe(b.totalFirstYearCost);
    }
    const totals = dataset.heroRows.map((r) => r.totalCost);
    expect(totals).toEqual([...totals].sort((a, b) => a - b));
  });

  it('verifiedDateSpan orders months correctly', () => {
    expect(verifiedDateSpan(['October 2026', 'September 2026', 'October 2026'])).toBe('September 2026 to October 2026');
    expect(verifiedDateSpan(['October 2026'])).toBe('October 2026');
  });
});
