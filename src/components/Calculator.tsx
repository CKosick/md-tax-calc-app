'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { StateRule, StateRulesConfig, CalculatorInputs, WeightClass, FuelType } from '@/lib/types';
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

  // URL query parameter hydration for shared / saved calculation links
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (!params.has('price') && !params.has('year') && !params.has('type')) return;

    setInputs((prev) => ({
      ...prev,
      purchasePrice: params.has('price') ? Math.max(0, Number(params.get('price')) || 0) : prev.purchasePrice,
      vehicleYear: params.has('year') ? Number(params.get('year')) || prev.vehicleYear : prev.vehicleYear,
      vehicleType: (params.get('type') === 'motorcycle' ? 'motorcycle' : 'passenger') as 'passenger' | 'motorcycle',
      weightClass: (params.get('weight') || prev.weightClass) as WeightClass,
      fuelType: (params.get('fuel') || prev.fuelType) as FuelType,
      registrationTerm: (Number(params.get('term')) === 1 ? 1 : 2) as 1 | 2,
      isFinanced: params.get('financed') === 'true',
      tradeInValue: params.has('tradeIn') ? Math.max(0, Number(params.get('tradeIn')) || 0) : prev.tradeInValue
    }));
  }, []);

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

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val);
  };

  const stickyTotalFormatted =
    breakdown.hasLocalTax &&
    breakdown.totalFirstYearCostMin !== undefined &&
    breakdown.totalFirstYearCostMax !== undefined &&
    (breakdown.localTaxMax ?? 0) > 0
      ? `${formatCurrency(breakdown.totalFirstYearCostMin)} – ${formatCurrency(breakdown.totalFirstYearCostMax)}`
      : formatCurrency(breakdown.totalFirstYearCost);

  const handleRecalculate = () => {
    const formElement = document.getElementById('calculator-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
      const firstInput = formElement.querySelector<HTMLInputElement | HTMLSelectElement>('input, select');
      firstInput?.focus();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8 pb-28 lg:pb-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
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
      <header className="mb-6 sm:mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          <span>Verified for 2026 {initialRule.label} Statutory Rates</span>
        </div>
        <h1 className="mt-2 sm:mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
          {initialRule.label} Private Party Car Tax Calculator
        </h1>
        <p className="mt-2 sm:mt-3 max-w-3xl text-xs sm:text-sm lg:text-base leading-relaxed text-slate-600 dark:text-slate-300">
          Calculate your true first-year out-of-pocket costs for a private vehicle sale in {initialRule.label}. Accurately accounts for {taxPhrase}, {formatFee(initialRule.titleFee)} certificate of title fee, 1 or 2-year tag registration, and state-specific regulations.
        </p>
      </header>

      {/* Main Grid: Inputs on Left, Sticky Hero Summary on Right (Desktop two-column layout kept as is) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Form & Desktop Disclaimers */}
        <div className="space-y-8 lg:col-span-7">
          <VehicleInputForm
            inputs={inputs}
            onChange={setInputs}
            rule={initialRule}
            allStates={ALL_STATES}
          />

          {/* Desktop Disclaimers */}
          <div className="hidden lg:block">
            <Disclaimers
              disclaimers={initialRule.disclaimers}
              bookValueApplies={breakdown.bookValueApplies}
              tradeInIgnored={breakdown.tradeInIgnored}
              localTaxNote={initialRule.localTaxNote}
            />
          </div>
        </div>

        {/* Right Column: Hero Cost Summary Card + Mobile Disclaimers + Sidebar Monetization */}
        <div className="space-y-6 lg:col-span-5">
          <CostSummaryCard
            breakdown={breakdown}
            rule={initialRule}
            purchasePrice={inputs.purchasePrice}
            inputs={inputs}
          />

          {/* Mobile Disclaimers: rendered below results on mobile so user sees results first */}
          <div className="block lg:hidden">
            <Disclaimers
              disclaimers={initialRule.disclaimers}
              bookValueApplies={breakdown.bookValueApplies}
              tradeInIgnored={breakdown.tradeInIgnored}
              localTaxNote={initialRule.localTaxNote}
            />
          </div>

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
            className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
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
              className="flex min-h-[44px] items-center justify-between rounded-xl border border-slate-200/80 bg-white/70 p-3 text-xs font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-indigo-400 hover:text-indigo-600 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:text-indigo-400"
            >
              <span>{st.label}</span>
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

      {/* Sticky Bottom Bar on Phones & Tablets (UI element, safe-area padding for iOS) */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 px-4 pt-3 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 lg:hidden"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))' }}
      >
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Estimated taxes &amp; fees
            </span>
            <span className="block truncate text-base font-extrabold text-slate-900 dark:text-white sm:text-lg">
              {stickyTotalFormatted}
            </span>
          </div>
          <button
            type="button"
            onClick={handleRecalculate}
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-indigo-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 cursor-pointer"
            aria-label="Recalculate out-of-pocket costs"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <span>Recalculate</span>
          </button>
        </div>
      </div>
    </div>
  );
}
