import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

// Mutable search params so each test can simulate a different share link
let currentSearchParams = new URLSearchParams();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => currentSearchParams,
  notFound: vi.fn()
}));

import { Calculator } from '../src/components/Calculator';
import { VehicleTaxComparisonTables } from '../src/components/VehicleTaxComparisonTables';
import {
  RATES_VERIFIED_YEAR,
  getCalculationYear,
  getDefaultModelYear,
  getModelYearPresets
} from '../src/lib/constants';
import { formatVehicleAge } from '../src/lib/formatters';
import { getDefaultInputs, getDefaultTerm, inputsFromSearchParams } from '../src/lib/shareParams';
import { getComparisonDataset } from '../src/lib/stateComparison';
import stateRulesData from '../src/config/stateRules.json';
import { StateRule, StateRulesConfig } from '../src/lib/types';

const rules = Object.values(stateRulesData as StateRulesConfig);
const byLabel = (label: string) => rules.find((r) => r.label === label) as StateRule;
const mdRule = byLabel('Maryland');
const oneYearOnlyRule = rules.find(
  (r) => r.registration.terms.includes(1) && !r.registration.terms.includes(2)
) as StateRule;

function useSystemDate(iso: string) {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(iso));
}

beforeEach(() => {
  currentSearchParams = new URLSearchParams();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('Calculation year is derived from the calendar', () => {
  it('getCalculationYear follows the system date', () => {
    expect(getCalculationYear(new Date('2027-01-01T12:00:00'))).toBe(2027);
    expect(getCalculationYear(new Date('2031-06-15T12:00:00'))).toBe(2031);
    useSystemDate('2028-03-01T12:00:00');
    expect(getCalculationYear()).toBe(2028);
  });

  it('model year presets and the default model year move with the calculation year', () => {
    expect(getModelYearPresets(2026)).toEqual([2024, 2021, 2019, 2017, 2015]);
    expect(getModelYearPresets(2027)).toEqual([2025, 2022, 2020, 2018, 2016]);
    expect(getDefaultModelYear(2026)).toBe(2019);
    expect(getDefaultModelYear(2027)).toBe(2020);
  });

  it('rates verification year is a fixed constant, not the calendar', () => {
    useSystemDate('2029-02-01T12:00:00');
    expect(RATES_VERIFIED_YEAR).toBe(2026);
  });
});

describe('Vehicle age never displays as negative', () => {
  it('labels future, current, one-year, and older model years', () => {
    expect(formatVehicleAge(2028, 2027)).toBe('Next model year');
    expect(formatVehicleAge(2027, 2027)).toBe('New this year');
    expect(formatVehicleAge(2026, 2027)).toBe('1 year old');
    expect(formatVehicleAge(2019, 2027)).toBe('8 years old');
  });

  it('calculator in 2027: presets, age label, and rates badge', () => {
    useSystemDate('2027-03-01T12:00:00');
    const { container } = render(<Calculator initialRule={mdRule} />);

    for (const yr of [2025, 2022, 2020, 2018, 2016]) {
      expect(screen.getByRole('button', { name: String(yr) })).toBeDefined();
    }
    expect(screen.queryByRole('button', { name: '2024' })).toBeNull();
    // Default model year is the 7-year-old preset
    expect(screen.getByDisplayValue('2020')).toBeDefined();
    expect(container.textContent).toContain('7 years old');
    // Rates badge still reflects the verified rates year
    expect(container.textContent).toContain(`Verified for ${RATES_VERIFIED_YEAR} Maryland`);

    fireEvent.change(screen.getByLabelText(/Vehicle Model Year/i), { target: { value: '2028' } });
    expect(container.textContent).toContain('Next model year');
    expect(container.textContent).not.toMatch(/-\d+ years? old/);
  });
});

describe('CSV filename follows the calendar year', () => {
  it('uses the calculation year in the download filename', () => {
    useSystemDate('2027-05-01T12:00:00');
    const dataset = getComparisonDataset();
    URL.createObjectURL = vi.fn(() => 'blob:mock');
    const setAttribute = vi.spyOn(HTMLAnchorElement.prototype, 'setAttribute');
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    try {
      render(
        <VehicleTaxComparisonTables
          initialHeroRows={dataset.heroRows}
          initialTaxRateRows={dataset.taxRateRows}
          initialTitleFeeRows={dataset.titleFeeRows}
        />
      );
      fireEvent.click(document.getElementById('download-csv-btn')!);
      expect(setAttribute).toHaveBeenCalledWith('download', 'cartaxhub-vehicle-tax-by-state-2027.csv');
    } finally {
      setAttribute.mockRestore();
      click.mockRestore();
    }
  });
});

describe('Share-link term default respects the state', () => {
  it('fixtures: Maryland offers 2-year terms and at least one state is 1-year only', () => {
    expect(getDefaultTerm(mdRule)).toBe(2);
    expect(oneYearOnlyRule).toBeDefined();
    expect(getDefaultTerm(oneYearOnlyRule)).toBe(1);
  });

  it('?price= with no term uses the state default term', () => {
    const params = new URLSearchParams('price=12000');
    const oneYear = inputsFromSearchParams(oneYearOnlyRule, params, getDefaultInputs(oneYearOnlyRule, 2026));
    expect(oneYear.registrationTerm).toBe(1);
    expect(oneYear.purchasePrice).toBe(12000);

    const twoYear = inputsFromSearchParams(mdRule, params, getDefaultInputs(mdRule, 2026));
    expect(twoYear.registrationTerm).toBe(2);
  });

  it('an explicit ?term= wins', () => {
    const md = inputsFromSearchParams(mdRule, new URLSearchParams('price=12000&term=1'), getDefaultInputs(mdRule, 2026));
    expect(md.registrationTerm).toBe(1);
  });

  it('links without price, year, or type leave the defaults untouched', () => {
    const defaults = getDefaultInputs(mdRule, 2026);
    expect(inputsFromSearchParams(mdRule, new URLSearchParams('term=1'), defaults)).toBe(defaults);
    expect(inputsFromSearchParams(mdRule, null, defaults)).toBe(defaults);
  });

  const selectedTerm = () =>
    document.getElementById('term-1-year')?.className.includes('text-indigo-600') ? 1 : 2;

  it('calculator initializes from useSearchParams without a state-setting effect', () => {
    currentSearchParams = new URLSearchParams('price=22000&year=2018&financed=true');
    render(<Calculator initialRule={mdRule} />);
    expect(screen.getByDisplayValue('2018')).toBeDefined();
    expect(screen.getByDisplayValue('22000')).toBeDefined();
    expect(document.getElementById('financed-yes')?.className).toContain('indigo');
    expect(selectedTerm()).toBe(2);
    cleanup();

    currentSearchParams = new URLSearchParams('price=22000&term=1');
    render(<Calculator initialRule={mdRule} />);
    expect(selectedTerm()).toBe(1);
  });
});

describe('Share-link weight= and fuel= validation', () => {
  const defaults = getDefaultInputs(mdRule, 2026);
  const parse = (qs: string) => inputsFromSearchParams(mdRule, new URLSearchParams(qs), defaults);

  it('accepts every valid weight class and fuel type', () => {
    for (const weight of ['under3500lbs', '3501to3700lbs', 'under3700lbs', 'over3700lbs']) {
      expect(parse(`price=15000&weight=${weight}`).weightClass).toBe(weight);
    }
    for (const fuel of ['gasoline', 'ev', 'phev']) {
      expect(parse(`price=15000&fuel=${fuel}`).fuelType).toBe(fuel);
    }
  });

  it('falls back to the defaults for invalid, empty, or wrong-case values', () => {
    for (const qs of ['weight=heavy', 'weight=', 'weight=OVER3700LBS', 'weight=over3700lbs%20']) {
      expect(parse(`price=15000&${qs}`).weightClass).toBe(defaults.weightClass);
    }
    for (const qs of ['fuel=diesel', 'fuel=', 'fuel=EV', 'fuel=<script>']) {
      expect(parse(`price=15000&${qs}`).fuelType).toBe(defaults.fuelType);
    }
  });

  it('keeps the other share-link values when weight and fuel are invalid', () => {
    const inputs = parse('price=22000&year=2018&weight=bogus&fuel=diesel&term=1');
    expect(inputs.purchasePrice).toBe(22000);
    expect(inputs.vehicleYear).toBe(2018);
    expect(inputs.registrationTerm).toBe(1);
    expect(inputs.weightClass).toBe(defaults.weightClass);
    expect(inputs.fuelType).toBe(defaults.fuelType);
  });

  it('a junk link renders the same total as a clean one', () => {
    const totalText = () => document.getElementById('calculator-results')?.textContent?.match(/\$[\d,]+\.\d\d/)?.[0];
    currentSearchParams = new URLSearchParams('price=15000');
    render(<Calculator initialRule={mdRule} />);
    const clean = totalText();
    cleanup();

    currentSearchParams = new URLSearchParams('price=15000&weight=heavy&fuel=diesel');
    render(<Calculator initialRule={mdRule} />);
    expect(totalText()).toBe(clean);
  });
});
