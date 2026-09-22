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

export function Calculator({ initialRule }: CalculatorProps) {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    state: 'maryland',
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <header className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          <span>Verified for 2026 MVA Statutory Rates</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
          Maryland Private Party Vehicle Tax, Tags &amp; Title Calculator
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
          Calculate your true first-year out-of-pocket costs for a private vehicle sale in Maryland. Accurately accounts for the 6.5% MVA excise tax, $200 certificate of title fee, 1 or 2-year tag registration with EMS surcharge, and EV fees.
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
