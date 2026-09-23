'use client';

import React, { useState, useMemo } from 'react';
import { StateRule, CalculatorInputs } from '@/lib/types';
import { calculateVehicleCosts } from '@/lib/calculator';
import { VehicleInputForm } from './VehicleInputForm';
import { CostSummaryCard } from './CostSummaryCard';
import { Disclaimers } from './Disclaimers';
import { FaqSection } from './FaqSection';
import { PartnerSlot } from './PartnerSlot';

interface CalculatorProps {
  initialRule: StateRule;
}

const ALL_STATES = [
  { key: 'maryland', label: 'Maryland', slug: 'maryland-private-sale-tax-calculator' },
  { key: 'virginia', label: 'Virginia', slug: 'virginia-private-sale-tax-calculator' },
  { key: 'pennsylvania', label: 'Pennsylvania', slug: 'pennsylvania-private-sale-tax-calculator' },
  { key: 'delaware', label: 'Delaware', slug: 'delaware-private-sale-tax-calculator' },
  { key: 'district-of-columbia', label: 'District of Columbia', slug: 'district-of-columbia-private-sale-tax-calculator' }
];

export function Calculator({ initialRule }: CalculatorProps) {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    state: initialRule.slug,
    vehicleType: 'passenger',
    purchasePrice: 15000,
    vehicleYear: 2019,
    weightClass: 'under3700lbs',
    fuelType: 'gasoline',
    registrationTerm: 2,
    isFinanced: false,
    tradeInValue: 0
  });

  const breakdown = useMemo(() => {
    return calculateVehicleCosts(initialRule, inputs, 2026);
  }, [initialRule, inputs]);

  const taxName = initialRule.label === 'Delaware'
    ? 'document fee'
    : initialRule.label === 'Virginia'
    ? 'SUT (Sales and Use Tax)'
    : 'excise/sales tax';

  const rateFormatted = Number((initialRule.exciseTaxRate * 100).toFixed(2));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <header className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          <span>Verified for 2026 {initialRule.label} Statutory Rates</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
          {initialRule.label} Private Party Vehicle Tax, Tags &amp; Title Calculator
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
          Calculate your true first-year out-of-pocket costs for a private vehicle sale in {initialRule.label}. Accurately accounts for the {rateFormatted}% {taxName}, ${initialRule.titleFee} certificate of title fee, 1 or 2-year tag registration, and state-specific regulations.
        </p>
      </header>

      {/* Main Grid: Inputs on Left, Sticky Hero Summary on Right */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Form & Disclaimers */}
        <div className="space-y-8 lg:col-span-7">
          <VehicleInputForm
            inputs={inputs}
            onChange={setInputs}
            rule={initialRule}
            allStates={ALL_STATES}
          />

          <Disclaimers
            disclaimers={initialRule.disclaimers}
            bookValueApplies={breakdown.bookValueApplies}
            tradeInIgnored={breakdown.tradeInIgnored}
          />
        </div>

        {/* Right Column: Hero Cost Summary Card + Sidebar Monetization */}
        <div className="space-y-6 lg:col-span-5">
          <CostSummaryCard
            breakdown={breakdown}
            rule={initialRule}
            purchasePrice={inputs.purchasePrice}
          />

          <PartnerSlot position="sidebar" />
        </div>
      </div>

      {/* FAQ Section with long-tail query H2s */}
      <FaqSection faqs={initialRule.faqs} stateLabel={initialRule.label} />
    </div>
  );
}
