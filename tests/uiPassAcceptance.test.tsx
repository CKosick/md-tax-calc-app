import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Calculator } from '../src/components/Calculator';
import { CostSummaryCard } from '../src/components/CostSummaryCard';
import { VehicleInputForm } from '../src/components/VehicleInputForm';
import stateRulesData from '../src/config/stateRules.json';
import { StateRule, StateRulesConfig, CalculatorInputs } from '../src/lib/types';
import { calculateVehicleCosts } from '../src/lib/calculator';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn()
  })
}));

const rules = stateRulesData as StateRulesConfig;
const mdRule = rules.maryland;
const deRule = rules.delaware;

const defaultInputs: CalculatorInputs = {
  state: 'maryland',
  vehicleType: 'passenger',
  purchasePrice: 15000,
  vehicleYear: 2019,
  weightClass: 'under3500lbs',
  fuelType: 'gasoline',
  registrationTerm: 2,
  isFinanced: false,
  tradeInValue: 0
};

describe('CarTaxHub UI Pass Acceptance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Mobile Results & Sticky Bottom Bar (covering tablets)', () => {
    it('renders a summary card with estimated taxes & fees and sticky bottom bar with Recalculate button covering tablets (lg:hidden)', () => {
      const { container } = render(<Calculator initialRule={mdRule} />);

      // Summary card heading in results
      expect(screen.getAllByText(/Estimated taxes & fees/i).length).toBeGreaterThanOrEqual(1);

      // Sticky bar covers phones and tablets below lg (lg:hidden, not md:hidden)
      const stickyBar = container.querySelector('.fixed.bottom-0');
      expect(stickyBar).toBeDefined();
      expect(stickyBar?.className).toContain('lg:hidden');
      expect(stickyBar?.className).not.toContain('md:hidden');

      // Recalculate button on sticky bar
      const recalculateBtn = screen.getByRole('button', { name: /recalculate/i });
      expect(recalculateBtn).toBeDefined();

      // Recalculate button click scrolls to form
      const scrollIntoViewMock = vi.fn();
      const formEl = document.getElementById('calculator-form');
      if (formEl) {
        formEl.scrollIntoView = scrollIntoViewMock;
      }
      fireEvent.click(recalculateBtn);
      expect(scrollIntoViewMock).toHaveBeenCalled();
    });
  });

  describe('2. Results UI Label Renaming & Consistency', () => {
    it('standardizes on "Estimated taxes & fees" in all three spots (badge, h2, hero label) in CostSummaryCard', () => {
      const breakdown = calculateVehicleCosts(mdRule, defaultInputs, 2026);
      const { container } = render(
        <CostSummaryCard breakdown={breakdown} rule={mdRule} purchasePrice={15000} />
      );

      // Must NOT contain old differing labels
      expect(container.textContent).not.toContain('Total True First-Year Cost');
      expect(container.textContent).not.toContain('First-Year Out-of-Pocket Cost');
      expect(container.textContent).not.toContain('Estimated Total Breakdown');
      // Must not contain "DMV fees"
      expect(container.textContent).not.toContain('DMV fees');

      // Must contain new label: "Estimated taxes & fees" in all three spots
      const matches = screen.getAllByText('Estimated taxes & fees');
      // Badge, h2, and hero label
      expect(matches.length).toBe(3);
    });
  });

  describe('3. Tap Target Sizes & Year Presets Without Scroll', () => {
    it('ensures price preset buttons and tap targets have min-h-[44px] styling and all 5 year presets fit without horizontal scroll', () => {
      const { container } = render(
        <VehicleInputForm
          inputs={defaultInputs}
          onChange={vi.fn()}
          rule={mdRule}
          allStates={[]}
        />
      );

      // Price preset buttons
      const preset5k = screen.getByRole('button', { name: /\$5,000/i });
      expect(preset5k.className).toContain('min-h-[44px]');
      expect(preset5k.className).toContain('min-w-[44px]');

      const preset25k = screen.getByRole('button', { name: /\$25,000/i });
      expect(preset25k.className).toContain('min-h-[44px]');

      // All 5 year presets visible and styled with min-h-[44px]
      const yearPresets = [2024, 2021, 2019, 2017, 2015];
      yearPresets.forEach((yr) => {
        const yrBtn = screen.getByRole('button', { name: String(yr) });
        expect(yrBtn).toBeDefined();
        expect(yrBtn.className).toContain('min-h-[44px]');
      });

      // Confirm no overflow-x-auto on year preset container
      const yearGrid = container.querySelector('.grid.grid-cols-5');
      expect(yearGrid).toBeDefined();
      expect(yearGrid?.className).not.toContain('overflow-x-auto');

      // Vehicle type toggle
      const passengerBtn = screen.getByRole('button', { name: /Car \/ SUV \/ Truck/i });
      expect(passengerBtn.className).toContain('min-h-[44px]');

      // Term button
      const termBtn = screen.getByRole('button', { name: /2-Year Term/i });
      expect(termBtn.className).toContain('min-h-[44px]');
    });
  });

  describe('4. Maryland Trade-in Behavior', () => {
    it('disables the trade-in field when Maryland is selected', () => {
      render(
        <VehicleInputForm
          inputs={defaultInputs}
          onChange={vi.fn()}
          rule={mdRule}
          allStates={[]}
        />
      );

      const tradeInput = screen.getByLabelText(/Trade-in Value/i) as HTMLInputElement;
      expect(tradeInput.disabled).toBe(true);
      expect(screen.getByText(/Maryland: Non-Deductible/i)).toBeDefined();
      expect(screen.getByText(/Trade-in deductions are legally permitted only on transactions through licensed Maryland motor vehicle dealers/i)).toBeDefined();
    });

    it('keeps trade-in field enabled for states where trade-in is deductible (e.g. Delaware)', () => {
      render(
        <VehicleInputForm
          inputs={{ ...defaultInputs, state: 'delaware' }}
          onChange={vi.fn()}
          rule={deRule}
          allStates={[]}
        />
      );

      const tradeInput = screen.getByLabelText(/Trade-in Value/i) as HTMLInputElement;
      expect(tradeInput.disabled).toBe(false);
    });

    it('does NOT wire trade-in into Maryland tax calculation and sets tradeInIgnored: true', () => {
      const mdWithTrade = calculateVehicleCosts(mdRule, { ...defaultInputs, tradeInValue: 5000 }, 2026);
      const mdWithoutTrade = calculateVehicleCosts(mdRule, { ...defaultInputs, tradeInValue: 0 }, 2026);

      expect(mdWithTrade.exciseTax).toBe(mdWithoutTrade.exciseTax);
      expect(mdWithTrade.tradeInDeducted).toBe(0);
      expect(mdWithTrade.tradeInIgnored).toBe(true);
    });
  });

  describe('5. Sources / Last Checked Link', () => {
    it('renders "Sources / last checked" link with real tracked date and real state URL', () => {
      const breakdown = calculateVehicleCosts(mdRule, defaultInputs, 2026);
      render(
        <CostSummaryCard breakdown={breakdown} rule={mdRule} purchasePrice={15000} />
      );

      const sourceLink = screen.getByRole('link', { name: /sources \/ last checked/i });
      expect(sourceLink).toBeDefined();
      expect(sourceLink.getAttribute('href')).toBe('https://mva.maryland.gov/about-mva/Pages/fees.aspx');
      expect(sourceLink.getAttribute('target')).toBe('_blank');

      // Uses real tracked date September 2026
      expect(screen.getByText(/September 2026/i)).toBeDefined();
    });
  });

  describe('6. Save / Share Result Button & URL Encoding', () => {
    it('renders Save / Share button and copies link with encoded inputs to clipboard on desktop', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock
        }
      });

      const breakdown = calculateVehicleCosts(mdRule, defaultInputs, 2026);
      render(
        <CostSummaryCard
          breakdown={breakdown}
          rule={mdRule}
          purchasePrice={15000}
          inputs={defaultInputs}
        />
      );

      const shareBtn = screen.getByRole('button', { name: /save or share calculation result/i });
      expect(shareBtn).toBeDefined();

      fireEvent.click(shareBtn);

      await waitFor(() => {
        expect(writeTextMock).toHaveBeenCalled();
      });

      const copiedUrl = writeTextMock.mock.calls[0][0];
      expect(copiedUrl).toContain('price=15000');
      expect(copiedUrl).toContain('year=2019');
      expect(copiedUrl).toContain('type=passenger');
      expect(copiedUrl).toContain('term=2');
    });

    it('triggers navigator.share when available on mobile user agent', async () => {
      const shareMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
        configurable: true
      });
      Object.defineProperty(navigator, 'share', {
        value: shareMock,
        configurable: true
      });

      const breakdown = calculateVehicleCosts(mdRule, defaultInputs, 2026);
      render(
        <CostSummaryCard
          breakdown={breakdown}
          rule={mdRule}
          purchasePrice={15000}
          inputs={defaultInputs}
        />
      );

      const shareBtn = screen.getByRole('button', { name: /save or share calculation result/i });
      fireEvent.click(shareBtn);

      await waitFor(() => {
        expect(shareMock).toHaveBeenCalledWith(
          expect.objectContaining({
            title: expect.stringContaining('Maryland'),
            url: expect.stringContaining('price=15000')
          })
        );
      });
    });
  });
});
