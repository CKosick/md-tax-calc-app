import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VehicleInputForm } from '../src/components/VehicleInputForm';
import stateRulesData from '../src/config/stateRules.json';
import { CalculatorInputs, StateRule } from '../src/lib/types';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn()
  })
}));

const mdRule = stateRulesData.maryland as StateRule;
const deRule = stateRulesData.delaware as StateRule;

const mockAllStates = [
  { key: 'maryland', label: 'Maryland', slug: 'maryland-private-sale-tax-calculator' },
  { key: 'virginia', label: 'Virginia', slug: 'virginia-private-sale-tax-calculator' },
  { key: 'delaware', label: 'Delaware', slug: 'delaware-private-sale-tax-calculator' }
];

const defaultInputs: CalculatorInputs = {
  state: 'maryland',
  vehicleType: 'passenger',
  purchasePrice: 15000,
  vehicleYear: 2019,
  weightClass: 'under3700lbs',
  fuelType: 'gasoline',
  registrationTerm: 2,
  isFinanced: false,
  tradeInValue: 0
};

describe('VehicleInputForm Interactive Testing', () => {
  it('renders form with default inputs and state labels', () => {
    const handleChange = vi.fn();
    render(
      <VehicleInputForm
        inputs={defaultInputs}
        onChange={handleChange}
        rule={mdRule}
        allStates={mockAllStates}
      />
    );

    expect(screen.getByText(/Vehicle & Transaction Details/i)).toBeDefined();
    expect(screen.getByText(/Enter purchase information to calculate true out-of-pocket costs in Maryland\./i)).toBeDefined();
    expect(screen.getByDisplayValue('15000')).toBeDefined();
    expect(screen.getByDisplayValue('2019')).toBeDefined();
  });

  it('updates purchase price on direct user input', () => {
    const handleChange = vi.fn();
    render(
      <VehicleInputForm
        inputs={defaultInputs}
        onChange={handleChange}
        rule={mdRule}
        allStates={mockAllStates}
      />
    );

    const priceInput = screen.getByLabelText(/Purchase Price/i);
    fireEvent.change(priceInput, { target: { value: '25000' } });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        purchasePrice: 25000
      })
    );
  });

  it('updates purchase price when clicking preset price chips', () => {
    const handleChange = vi.fn();
    render(
      <VehicleInputForm
        inputs={defaultInputs}
        onChange={handleChange}
        rule={mdRule}
        allStates={mockAllStates}
      />
    );

    const chip35k = screen.getByRole('button', { name: '$35,000' });
    fireEvent.click(chip35k);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        purchasePrice: 35000
      })
    );
  });

  it('toggles vehicle type between passenger car and motorcycle', () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <VehicleInputForm
        inputs={defaultInputs}
        onChange={handleChange}
        rule={mdRule}
        allStates={mockAllStates}
      />
    );

    // Click motorcycle
    const motoBtn = screen.getByRole('button', { name: /motorcycle/i });
    fireEvent.click(motoBtn);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        vehicleType: 'motorcycle'
      })
    );

    // When motorcycle is selected, weight class buttons are hidden
    rerender(
      <VehicleInputForm
        inputs={{ ...defaultInputs, vehicleType: 'motorcycle' }}
        onChange={handleChange}
        rule={mdRule}
        allStates={mockAllStates}
      />
    );
    expect(screen.queryByText(/Vehicle Weight Classification/i)).toBeNull();
  });

  it('toggles weight class between standard and heavy', () => {
    const handleChange = vi.fn();
    render(
      <VehicleInputForm
        inputs={defaultInputs}
        onChange={handleChange}
        rule={mdRule}
        allStates={mockAllStates}
      />
    );

    const heavyBtn = screen.getByText(/Heavy \/ Trucks/i).closest('button');
    expect(heavyBtn).not.toBeNull();
    fireEvent.click(heavyBtn!);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        weightClass: 'over3700lbs'
      })
    );
  });

  it('updates vehicle model year via input and year quick-chips', () => {
    const handleChange = vi.fn();
    render(
      <VehicleInputForm
        inputs={defaultInputs}
        onChange={handleChange}
        rule={mdRule}
        allStates={mockAllStates}
      />
    );

    const yearInput = screen.getByLabelText(/Vehicle Model Year/i);
    fireEvent.change(yearInput, { target: { value: '2022' } });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        vehicleYear: 2022
      })
    );

    const yearChip = screen.getByRole('button', { name: '2024' });
    fireEvent.click(yearChip);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        vehicleYear: 2024
      })
    );
  });

  it('toggles registration term between 1-Year and 2-Year', () => {
    const handleChange = vi.fn();
    render(
      <VehicleInputForm
        inputs={defaultInputs}
        onChange={handleChange}
        rule={mdRule}
        allStates={mockAllStates}
      />
    );

    const term1Btn = screen.getByRole('button', { name: /1-Year Term/i });
    fireEvent.click(term1Btn);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        registrationTerm: 1
      })
    );
  });

  it('toggles fuel type between gasoline, ev, and phev', () => {
    const handleChange = vi.fn();
    render(
      <VehicleInputForm
        inputs={defaultInputs}
        onChange={handleChange}
        rule={mdRule}
        allStates={mockAllStates}
      />
    );

    const evBtn = screen.getByText(/Battery EV/i).closest('button');
    expect(evBtn).not.toBeNull();
    fireEvent.click(evBtn!);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        fuelType: 'ev'
      })
    );

    const phevBtn = screen.getByText(/Plug-in Hybrid/i).closest('button');
    expect(phevBtn).not.toBeNull();
    fireEvent.click(phevBtn!);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        fuelType: 'phev'
      })
    );
  });

  it('toggles financing between cash purchase and financed', () => {
    const handleChange = vi.fn();
    render(
      <VehicleInputForm
        inputs={defaultInputs}
        onChange={handleChange}
        rule={mdRule}
        allStates={mockAllStates}
      />
    );

    const financedBtn = screen.getByText(/Financed \(Lender\)/i).closest('button');
    expect(financedBtn).not.toBeNull();
    fireEvent.click(financedBtn!);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        isFinanced: true
      })
    );
  });

  it('updates trade-in value on input', () => {
    const handleChange = vi.fn();
    render(
      <VehicleInputForm
        inputs={defaultInputs}
        onChange={handleChange}
        rule={mdRule}
        allStates={mockAllStates}
      />
    );

    const tradeInput = screen.getByLabelText(/Trade-in Value/i);
    fireEvent.change(tradeInput, { target: { value: '4500' } });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        tradeInValue: 4500
      })
    );
  });

  it('displays accurate statute copy for trade-in deductible vs non-deductible states', () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <VehicleInputForm
        inputs={defaultInputs}
        onChange={handleChange}
        rule={mdRule} // Maryland: non-deductible
        allStates={mockAllStates}
      />
    );

    expect(screen.getByText(/Maryland: Non-Deductible/i)).toBeDefined();
    expect(screen.getByText(/taxes the full agreed vehicle price — trade-ins do not reduce the tax base/i)).toBeDefined();

    rerender(
      <VehicleInputForm
        inputs={{ ...defaultInputs, state: 'delaware' }}
        onChange={handleChange}
        rule={deRule} // Delaware: deductible
        allStates={mockAllStates}
      />
    );

    expect(screen.getByText(/Delaware: Deductible/i)).toBeDefined();
    expect(screen.getByText(/allows trade-in value on private sales to be deducted/i)).toBeDefined();
  });

  it('navigates to selected state calculator URL when dropdown changes', () => {
    mockPush.mockClear();
    const handleChange = vi.fn();
    render(
      <VehicleInputForm
        inputs={defaultInputs}
        onChange={handleChange}
        rule={mdRule}
        allStates={mockAllStates}
      />
    );

    const stateSelect = screen.getByLabelText(/State of Registration/i);
    fireEvent.change(stateSelect, { target: { value: 'virginia' } });

    expect(mockPush).toHaveBeenCalledWith('/calculator/virginia-private-sale-tax-calculator');
  });
});
