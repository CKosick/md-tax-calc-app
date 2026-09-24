'use client';

import React from 'react';
import { CostBreakdown, StateRule } from '@/lib/types';
import { PartnerSlot } from './PartnerSlot';

interface CostSummaryCardProps {
  breakdown: CostBreakdown;
  rule: StateRule;
  purchasePrice: number;
}

export function CostSummaryCard({
  breakdown,
  rule,
  purchasePrice
}: CostSummaryCardProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val);
  };

  const ratePercent = Number((rule.exciseTaxRate * 100).toFixed(2));
  const rateLabel = `${ratePercent}%`;

  return (
    <div className="space-y-6 lg:sticky lg:top-8">
      {/* Primary Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 sm:p-8">
        {/* Subtle decorative glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/20" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/15" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              Estimated Total Breakdown
            </span>
            <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              First-Year Out-of-Pocket Cost
            </h2>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Jurisdiction
            </span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {rule.label}
            </p>
          </div>
        </div>

        {/* Hero Number Display */}
        <div className="my-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 text-white shadow-lg shadow-indigo-950/20 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
          <span className="text-xs font-medium uppercase tracking-wider text-indigo-300">
            Total True First-Year Cost
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              {breakdown.hasLocalTax &&
              breakdown.totalFirstYearCostMin !== undefined &&
              breakdown.totalFirstYearCostMax !== undefined &&
              (breakdown.localTaxMax ?? 0) > 0
                ? `${formatCurrency(breakdown.totalFirstYearCostMin)} – ${formatCurrency(breakdown.totalFirstYearCostMax)}`
                : formatCurrency(breakdown.totalFirstYearCost)}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-300">
            {rule.label === 'Delaware' ? 'Document Fee' : 'Sales/Excise Tax'}
            {breakdown.hasLocalTax ? ' (State + Local Range)' : ''} + Title Certificate + Tags &amp; Registration {breakdown.lienFilingFee > 0 ? '+ Lien Fee' : ''}
          </p>
        </div>

        {/* Itemized Breakdown List - Exact §3 Order */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Itemized Line Item</span>
            <span>Estimated Fee</span>
          </div>

          <div className="divide-y divide-slate-100 text-sm dark:divide-slate-800/80">
            {/* 1. Excise Tax */}
            <div className="flex items-center justify-between py-3">
              <div className="pr-4">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    1
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {breakdown.itemizedList[0]?.label || (rule.label === 'Delaware' ? `Document Fee (${rateLabel})` : `Vehicle Sales / Excise Tax (${rateLabel})`)}
                  </span>
                </div>
                <p className="mt-0.5 pl-6.5 text-xs text-slate-500 dark:text-slate-400">
                  {breakdown.itemizedList[0]?.description || `${rateLabel} on purchase price of ${formatCurrency(purchasePrice)}`}
                </p>
              </div>
              <span className="flex-shrink-0 font-bold text-slate-900 dark:text-white">
                {breakdown.hasLocalTax &&
                breakdown.combinedTaxMin !== undefined &&
                breakdown.combinedTaxMax !== undefined &&
                (breakdown.localTaxMax ?? 0) > 0
                  ? `${formatCurrency(breakdown.combinedTaxMin)} – ${formatCurrency(breakdown.combinedTaxMax)}`
                  : formatCurrency(breakdown.exciseTax)}
              </span>
            </div>

            {/* 2. Title Fee */}
            <div className="flex items-center justify-between py-3">
              <div className="pr-4">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    2
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Certificate of Title Fee
                  </span>
                </div>
                <p className="mt-0.5 pl-6.5 text-xs text-slate-500 dark:text-slate-400">
                  Standard state title certificate issuance
                </p>
              </div>
              <span className="flex-shrink-0 font-bold text-slate-900 dark:text-white">
                {formatCurrency(breakdown.titleFee)}
              </span>
            </div>

            {/* 3. Lien Filing Fee */}
            <div className="flex items-center justify-between py-3">
              <div className="pr-4">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    3
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Lien / Security Filing Fee
                  </span>
                </div>
                <p className="mt-0.5 pl-6.5 text-xs text-slate-500 dark:text-slate-400">
                  {breakdown.lienFilingFee > 0
                    ? 'Lien recording fee for financed purchase'
                    : 'Unfinanced / cash purchase (waived $0.00)'}
                </p>
              </div>
              <span className={`flex-shrink-0 font-bold ${breakdown.lienFilingFee > 0 ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                {formatCurrency(breakdown.lienFilingFee)}
              </span>
            </div>

            {/* 4. Registration & Tag Fee */}
            <div className="flex items-center justify-between py-3">
              <div className="pr-4">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    4
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Registration &amp; Tag Fee
                  </span>
                </div>
                <p className="mt-0.5 pl-6.5 text-xs text-slate-500 dark:text-slate-400">
                  Base license plates &amp; tags
                  {breakdown.evSurcharge > 0 && ` + ${formatCurrency(breakdown.evSurcharge)} EV surcharge`}
                </p>
              </div>
              <span className="flex-shrink-0 font-bold text-slate-900 dark:text-white">
                {formatCurrency(breakdown.registrationTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Informational VEIP Section (Maryland only if veipFee > 0) */}
        {breakdown.veipFee > 0 && (
          <div className="mt-6 rounded-2xl border border-slate-200/60 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  Informational Only
                </span>
                <h4 className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                  VEIP Vehicle Emissions Inspection
                </h4>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Required every 2 years in designated MD counties (${breakdown.veipFee}.00 full station / $26 kiosk). Not included in the MVA titling total.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                ${breakdown.veipFee}.00
              </span>
            </div>
          </div>
        )}

        {/* Contextual Warning / Info Pills */}
        <div className="mt-6 space-y-2">
          {breakdown.bookValueApplies && (
            <div className="rounded-xl border border-amber-200/90 bg-amber-50/90 p-3.5 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
              <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <span>Book Value Assessment Rule (≤ 7 Years Old)</span>
              </div>
              <p className="mt-1 leading-relaxed">
                Because this vehicle is 7 years old or newer ({breakdown.vehicleAge} years old), {rule.label} DMV may assess the {rateLabel} tax on book value instead of your purchase price unless accompanied by a verified or notarized bill of sale.
              </p>
            </div>
          )}

          {breakdown.tradeInIgnored && (
            <div className="rounded-xl border border-indigo-200/90 bg-indigo-50/90 p-3.5 text-xs text-indigo-900 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-200">
              <span className="font-bold">Trade-in Note:</span> {rule.label} does not permit trade-in deductions on private-party sales. Your tax is calculated on the full agreed vehicle price.
            </div>
          )}

          {rule.tradeInDeductible && breakdown.tradeInDeducted > 0 && (
            <div className="rounded-xl border border-emerald-200/90 bg-emerald-50/90 p-3.5 text-xs text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200">
              <span className="font-bold">Trade-in Credit Applied:</span> {rule.label} permits trade-in credits on private sales. {formatCurrency(breakdown.tradeInDeducted)} was deducted from your taxable base.
            </div>
          )}
        </div>
      </div>

      {/* Monetization Slot - Below Results */}
      <PartnerSlot position="below-results" />
    </div>
  );
}
