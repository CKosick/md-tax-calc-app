'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { StateRule, StateRulesConfig, CalculatorInputs, WeightClass } from '@/lib/types';
import stateRulesData from '@/config/stateRules.json';
import { calculateVehicleCosts } from '@/lib/calculator';
import { formatFee } from '@/lib/formatters';
import { VehicleInputForm } from './VehicleInputForm';
import { CostSummaryCard } from './CostSummaryCard';
import { Disclaimers } from './Disclaimers';
import { FaqSection } from './FaqSection';
import { PartnerSlot } from './PartnerSlot';

interface CalculatorProps {
  initialRule: StateRule;
}

const ALL_STATES = Object.entries(stateRulesData as StateRulesConfig)
  .map(([key, rule]) => ({
    key,
    label: rule.label,
    slug: rule.slug
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

// Featured popular states for internal topical mesh
const POPULAR_SLUGS = [
  'california-private-sale-tax-calculator',
  'texas-private-sale-tax-calculator',
  'florida-private-sale-tax-calculator',
  'new-york-private-sale-tax-calculator',
  'pennsylvania-private-sale-tax-calculator',
  'illinois-private-sale-tax-calculator',
  'ohio-private-sale-tax-calculator',
  'georgia-private-sale-tax-calculator',
  'north-carolina-private-sale-tax-calculator',
  'virginia-private-sale-tax-calculator',
  'maryland-private-sale-tax-calculator'
];

export function Calculator({ initialRule }: CalculatorProps) {
  const defaultTerm: 1 | 2 =
    initialRule.registration.terms.includes(1) && !initialRule.registration.terms.includes(2) ? 1 : 2;

  const defaultWeightClass: WeightClass = initialRule.registration.passenger.under3500lbs
    ? 'under3500lbs'
    : 'under3700lbs';

  const [inputs, setInputs] = useState<CalculatorInputs>({
    state: initialRule.slug,
    vehicleType: 'passenger',
    purchasePrice: 15000,
    vehicleYear: 2019,
    weightClass: defaultWeightClass,
    fuelType: 'gasoline',
    registrationTerm: defaultTerm,
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
  const taxPhrase = initialRule.flatTaxTable
    ? 'Form RUT-50 statutory use tax tables'
    : `${rateFormatted}% ${taxName}`;

  // Filter sibling states for internal link topical mesh (excluding current state)
  const relatedStates = ALL_STATES.filter(
    (st) => st.slug !== initialRule.slug && POPULAR_SLUGS.includes(st.slug)
  ).slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
          Home
        </Link>
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <Link href="/calculator" className="hover:text-indigo-600 dark:hover:text-indigo-400">
          Calculators
        </Link>
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <span className="font-semibold text-slate-900 dark:text-white" aria-current="page">
          {initialRule.label}
        </span>
      </nav>

      {/* Page Header */}
      <header className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          <span>Verified for 2026 {initialRule.label} Statutory Rates</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
          {initialRule.label} Private Party Car Tax Calculator
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
          Calculate your true first-year out-of-pocket costs for a private vehicle sale in {initialRule.label}. Accurately accounts for {taxPhrase}, {formatFee(initialRule.titleFee)} certificate of title fee, 1 or 2-year tag registration, and state-specific regulations.
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
            localTaxNote={initialRule.localTaxNote}
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

      {/* Internal Linking: Sibling & Popular State Calculators */}
      <section className="mt-16 border-t border-slate-200 pt-10 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Other State Car Tax Calculators
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Calculate private-party vehicle taxes, titling, and registration across other US states:
            </p>
          </div>
          <Link
            href="/calculator"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            <span>View All 51 Jurisdictions</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {relatedStates.map((st) => (
            <Link
              key={st.key}
              href={`/calculator/${st.slug}`}
              className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white/70 p-3 text-xs font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-indigo-400 hover:text-indigo-600 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:text-indigo-400"
            >
              <span>{st.label}</span>
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
