'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CalculatorInputs, StateRule, FuelType, RegistrationTerm } from '@/lib/types';
import { getCalculationYear, getModelYearPresets } from '@/lib/constants';
import { formatVehicleAge } from '@/lib/formatters';
import { getOfferedTerms } from '@/lib/shareParams';

const TERM_LABELS: Record<RegistrationTerm, string> = {
  1: '1-Year Term (Annual)',
  2: '2-Year Term (Standard)',
  3: '3-Year Term'
};
const TERM_WORDS: Record<RegistrationTerm, string> = { 1: 'one year', 2: 'two years', 3: 'three years' };

interface StateOption {
  key: string;
  label: string;
  slug: string;
}

interface VehicleInputFormProps {
  inputs: CalculatorInputs;
  onChange: (inputs: CalculatorInputs) => void;
  rule: StateRule;
  allStates?: StateOption[];
  /** Calendar year for age math and model year presets (defaults to the current year). */
  calculationYear?: number;
}

export function VehicleInputForm({
  inputs,
  onChange,
  rule,
  allStates = [],
  calculationYear
}: VehicleInputFormProps) {
  const router = useRouter();
  const currentYear = calculationYear ?? getCalculationYear();
  const vehicleAge = currentYear - inputs.vehicleYear;
  // Three-tier (Maryland-style) states always ask; two-tier states ask only if the tiers differ
  const passenger = rule.registration.passenger;
  const passengerFeeVariesByWeight =
    Boolean(passenger.under3500lbs) || JSON.stringify(passenger.under3700lbs) !== JSON.stringify(passenger.over3700lbs);
  // Two-tier passenger states split at 3,700 lbs unless configured (Virginia: 4,000)
  const weightSplitLabel = (rule.registration.passengerWeightSplitLbs ?? 3700).toLocaleString('en-US');
  // Weight chart states (New York) ask for the weight in lbs instead of a weight class
  const weightChart = rule.registration.passengerWeightChart;
  // List price states (Michigan, Minnesota) ask for the MSRP; age-based states (Oklahoma) ask nothing
  const listPriceReg = rule.registration.listPriceRegistration;
  const feeNotByWeight = Boolean(listPriceReg || rule.registration.feesByRegistrationYear);
  // Only the registration terms the state offers (1, 2, or 3 years per its config)
  const offeredTerms = getOfferedTerms(rule);
  // Maryland book value rule applies to vehicles under the configured age limit
  const bookValueAgeLimit = rule.bookValueAssessment?.maxVehicleAge;
  const inBookValueWindow = bookValueAgeLimit !== undefined && vehicleAge < bookValueAgeLimit;
  const isMaryland = rule.slug === 'maryland-private-sale-tax-calculator' || rule.label.toLowerCase() === 'maryland';

  const updateField = <K extends keyof CalculatorInputs>(
    field: K,
    value: CalculatorInputs[K]
  ) => {
    onChange({
      ...inputs,
      [field]: value
    });
  };

  const handleStateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedKey = e.target.value;
    const selected = allStates.find((s) => s.key === selectedKey);
    if (selected) {
      router.push(`/calculator/${selected.slug}`);
    }
  };

  // Find the selected key matching current rule slug
  const currentOption = allStates.find((s) => s.slug === rule.slug);
  const selectedKey = currentOption ? currentOption.key : inputs.state;

  return (
    <div id="calculator-form" className="space-y-6 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-8">
      {/* Form Header */}
      <div className="border-b border-slate-100 pb-5 dark:border-slate-800">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Vehicle &amp; Transaction Details
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Enter purchase information to calculate true out-of-pocket costs in {rule.label}.
        </p>
      </div>

      <div className="space-y-6">
        {/* State Selection Dropdown */}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="state-select"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              State of Registration
            </label>
            <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              51 Jurisdictions Active
            </span>
          </div>
          <div className="relative mt-2">
            <select
              id="state-select"
              value={selectedKey}
              onChange={handleStateSelect}
              className="block w-full min-h-[44px] appearance-none rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm font-bold text-slate-900 shadow-xs transition-all hover:border-indigo-400 focus:border-indigo-500 focus:outline-none focus:ring-3 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white cursor-pointer"
            >
              {allStates.map((st) => (
                <option key={st.key} value={st.key}>
                  {st.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Locality (states with a short verified list of local rates, e.g. Pennsylvania) */}
        {rule.localities && rule.localities.length > 0 && (
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="locality-select"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Where will the vehicle be registered?
              </label>
              <span className="text-[11px] text-slate-400">Optional</span>
            </div>
            <div className="relative mt-2">
              <select
                id="locality-select"
                value={inputs.localityId ?? ''}
                onChange={(e) => updateField('localityId', e.target.value || undefined)}
                className="block w-full min-h-[44px] appearance-none rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm font-bold text-slate-900 shadow-xs transition-all hover:border-indigo-400 focus:border-indigo-500 focus:outline-none focus:ring-3 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white cursor-pointer"
              >
                <option value="">Not sure (show the range)</option>
                {rule.localities.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label} ({Number(((rule.exciseTaxRate + l.localRate) * 100).toFixed(3))}%)
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
            <p id="locality-help" className="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              Pick a place for one exact total, or leave it blank for the range.
            </p>
          </div>
        )}

        {/* Vehicle Type Toggle */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Vehicle Type
          </label>
          <div className="mt-2 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800/80">
            <button
              type="button"
              id="type-passenger"
              onClick={() => updateField('vehicleType', 'passenger')}
              className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                inputs.vehicleType === 'passenger'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V3.75m0 3.75a4.5 4.5 0 0 1 4.5 4.5v1.5m-4.5-6H4.875c-.621 0-1.125.504-1.125 1.125v7.875" />
              </svg>
              <span>Car / SUV / Truck</span>
            </button>
            <button
              type="button"
              id="type-motorcycle"
              onClick={() => updateField('vehicleType', 'motorcycle')}
              className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                inputs.vehicleType === 'motorcycle'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span>Motorcycle</span>
            </button>
          </div>
        </div>

        {/* Purchase Price Input */}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="purchase-price-input"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Purchase Price (Agreed Sale Price)
            </label>
            <span className="text-[11px] text-slate-400">
              {rule.flatTaxTable
                ? `${rule.label} Form RUT-50 Tax Table`
                : `${rule.label} ${Number((rule.exciseTaxRate * 100).toFixed(2))}% ${rule.label === 'Delaware' ? 'fee base' : 'tax base'}`}
            </span>
          </div>
          <div className="relative mt-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <span className="text-base font-bold text-slate-400">$</span>
            </div>
            <input
              type="number"
              id="purchase-price-input"
              min="0"
              step="100"
              value={inputs.purchasePrice || ''}
              onChange={(e) => updateField('purchasePrice', Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="15000"
              className="block w-full min-h-[44px] rounded-2xl border border-slate-200 bg-white py-3 pl-8 pr-4 text-base font-bold text-slate-900 shadow-xs transition-all focus:border-indigo-500 focus:outline-none focus:ring-3 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
          {/* Quick preset chips - 44px minimum tap targets */}
          <div className="mt-2.5 flex flex-wrap gap-2">
            {[5000, 10000, 15000, 20000, 25000, 35000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => updateField('purchasePrice', preset)}
                className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                  inputs.purchasePrice === preset
                    ? 'bg-indigo-600 text-white shadow-xs dark:bg-indigo-500'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                ${preset.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Model Year Input */}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="model-year-input"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Vehicle Model Year
            </label>
            <span
              className={`text-[11px] font-medium ${
                isMaryland && inBookValueWindow
                  ? 'font-bold text-amber-600 dark:text-amber-400'
                  : 'text-slate-400'
              }`}
            >
              {formatVehicleAge(inputs.vehicleYear, currentYear)}{' '}
              {isMaryland && bookValueAgeLimit !== undefined
                ? inBookValueWindow
                  ? `(under ${bookValueAgeLimit} yrs rule)`
                  : `(${bookValueAgeLimit}+ yrs)`
                : ''}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-12 sm:items-center sm:gap-2.5">
            <div className="sm:col-span-4">
              <input
                type="number"
                id="model-year-input"
                min="1970"
                max={currentYear + 1}
                value={inputs.vehicleYear || ''}
                onChange={(e) => updateField('vehicleYear', parseInt(e.target.value) || currentYear)}
                placeholder="2019"
                className="w-full min-h-[44px] rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-3 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-5 gap-1.5 sm:col-span-8 sm:gap-2">
              {getModelYearPresets(currentYear).map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => updateField('vehicleYear', yr)}
                  className={`flex min-h-[44px] min-w-0 items-center justify-center rounded-xl px-1 py-2 text-xs font-bold transition-all cursor-pointer ${
                    inputs.vehicleYear === yr
                      ? 'bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 active:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Book Value (states with a book value assessment rule, e.g. Maryland) */}
        {rule.bookValueAssessment && (
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="book-value-input"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Book Value (NADA Retail)
              </label>
              <span className="text-[11px] text-slate-400">Optional</span>
            </div>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="text-base font-bold text-slate-400">$</span>
              </div>
              <input
                type="number"
                id="book-value-input"
                min="0"
                step="100"
                value={inputs.bookValue || ''}
                onChange={(e) => {
                  const n = parseFloat(e.target.value);
                  updateField('bookValue', Number.isFinite(n) && n > 0 ? n : undefined);
                }}
                placeholder="Leave blank if unknown"
                className="block w-full min-h-[44px] rounded-2xl border border-slate-200 bg-white py-3 pl-8 pr-4 text-base font-bold text-slate-900 shadow-xs transition-all focus:border-indigo-500 focus:outline-none focus:ring-3 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
            <p id="book-value-help" className="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              {vehicleAge >= rule.bookValueAssessment.maxVehicleAge
                ? `Not used for vehicles ${rule.bookValueAssessment.maxVehicleAge} or more years old. They are taxed on the price.`
                : `Used only if your price is more than $${rule.bookValueAssessment.priceBelowBookThreshold.toLocaleString()} below book value. ${rule.label} may then assess the tax on the book value.`}
            </p>
          </div>
        )}

        {/* Standard Presumptive Value (states with a presumptive value rule, e.g. Texas) */}
        {rule.presumptiveValueRule && (
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="spv-input"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Standard Presumptive Value (SPV)
              </label>
              <span className="text-[11px] text-slate-400">Optional</span>
            </div>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="text-base font-bold text-slate-400">$</span>
              </div>
              <input
                type="number"
                id="spv-input"
                min="0"
                step="100"
                value={inputs.presumptiveValue || ''}
                onChange={(e) => {
                  const n = parseFloat(e.target.value);
                  updateField('presumptiveValue', Number.isFinite(n) && n > 0 ? n : undefined);
                }}
                placeholder="Look up on TxDMV's SPV calculator"
                className="block w-full min-h-[44px] rounded-2xl border border-slate-200 bg-white py-3 pl-8 pr-4 text-base font-bold text-slate-900 shadow-xs transition-all focus:border-indigo-500 focus:outline-none focus:ring-3 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
            <p id="spv-help" className="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              {rule.label} taxes the greater of your price or {Number((rule.presumptiveValueRule.minShareOfValue * 100).toFixed(0))}% of SPV.
            </p>

            {(inputs.presumptiveValue ?? 0) > 0 && (
              <div className="mt-3">
                <label
                  htmlFor="appraisal-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Certified Appraisal (Form 14-128)
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <span className="text-base font-bold text-slate-400">$</span>
                  </div>
                  <input
                    type="number"
                    id="appraisal-input"
                    min="0"
                    step="100"
                    value={inputs.appraisedValue || ''}
                    onChange={(e) => {
                      const n = parseFloat(e.target.value);
                      updateField('appraisedValue', Number.isFinite(n) && n > 0 ? n : undefined);
                    }}
                    placeholder="Only if you have one"
                    className="block w-full min-h-[44px] rounded-2xl border border-slate-200 bg-white py-3 pl-8 pr-4 text-base font-bold text-slate-900 shadow-xs transition-all focus:border-indigo-500 focus:outline-none focus:ring-3 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  An appraisal obtained within 30 days of the purchase replaces the SPV test. The tax is never on less than your price.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Vehicle weight in lbs (passenger cars in weight chart states, e.g. New York) */}
        {inputs.vehicleType === 'passenger' && weightChart && (
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="vehicle-weight-input"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Vehicle Weight (lbs)
              </label>
              <span className="text-[11px] text-slate-400">Sets the registration fee</span>
            </div>
            <input
              type="number"
              id="vehicle-weight-input"
              min="0"
              step="50"
              value={inputs.vehicleWeight || ''}
              onChange={(e) => {
                const n = parseFloat(e.target.value);
                updateField('vehicleWeight', Number.isFinite(n) && n > 0 ? n : undefined);
              }}
              placeholder={`${weightChart.defaultWeightLbs.toLocaleString('en-US')} if unknown`}
              className="mt-2 block w-full min-h-[44px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-bold text-slate-900 shadow-xs transition-all focus:border-indigo-500 focus:outline-none focus:ring-3 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
            <p id="vehicle-weight-help" className="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              {rule.label} prices registration by the vehicle&apos;s unladen weight. Check the sticker on the driver&apos;s side door frame.
              {!inputs.vehicleWeight && ` Blank uses ${weightChart.defaultWeightLbs.toLocaleString('en-US')} lbs.`}
            </p>
          </div>
        )}

        {/* Original list price (passenger cars in list price states, e.g. Michigan, Minnesota) */}
        {inputs.vehicleType === 'passenger' && listPriceReg && (
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="list-price-input"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Original MSRP (List Price)
              </label>
              <span className="text-[11px] text-slate-400">Sets the registration fee</span>
            </div>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="text-base font-bold text-slate-400">$</span>
              </div>
              <input
                type="number"
                id="list-price-input"
                min="0"
                step="500"
                value={inputs.listPrice || ''}
                onChange={(e) => {
                  const n = parseFloat(e.target.value);
                  updateField('listPrice', Number.isFinite(n) && n > 0 ? n : undefined);
                }}
                placeholder={`${listPriceReg.defaultListPrice.toLocaleString('en-US')} if unknown`}
                className="block w-full min-h-[44px] rounded-2xl border border-slate-200 bg-white py-3 pl-8 pr-4 text-base font-bold text-slate-900 shadow-xs transition-all focus:border-indigo-500 focus:outline-none focus:ring-3 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
            <p id="list-price-help" className="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              {rule.label} bases registration on the price when new, reduced as the vehicle ages.
              {!inputs.listPrice && ` Blank uses $${listPriceReg.defaultListPrice.toLocaleString('en-US')}.`}
            </p>
          </div>
        )}

        {/* Weight Class (Passenger Cars only; hidden when the state's fee does not depend on weight) */}
        {inputs.vehicleType === 'passenger' && !weightChart && !feeNotByWeight && passengerFeeVariesByWeight && (
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Vehicle Weight Classification
              </label>
              <span className="text-[11px] text-slate-400">
                {isMaryland ? 'Class A & M Tiers (SB 362)' : 'Standard Passenger'}
              </span>
            </div>

            {isMaryland || rule.registration.passenger.under3500lbs ? (
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  id="weight-under-3500"
                  onClick={() => updateField('weightClass', 'under3500lbs')}
                  className={`min-h-[44px] rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                    inputs.weightClass === 'under3500lbs'
                      ? 'border-indigo-500 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/40'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Light
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      0–3,500 lbs
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    $120.50/yr (Compacts, subcompacts)
                  </p>
                </button>

                <button
                  type="button"
                  id="weight-3501-3700"
                  onClick={() => updateField('weightClass', '3501to3700lbs')}
                  className={`min-h-[44px] rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                    inputs.weightClass === '3501to3700lbs'
                      ? 'border-indigo-500 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/40'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Standard
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      3,501–3,700 lbs
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    $125.50/yr (Mid-size sedans, compact SUVs)
                  </p>
                </button>

                <button
                  type="button"
                  id="weight-over-3700"
                  onClick={() => updateField('weightClass', 'over3700lbs')}
                  className={`min-h-[44px] rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                    inputs.weightClass === 'over3700lbs'
                      ? 'border-indigo-500 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/40'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Heavy / Trucks
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      &gt; 3,700 lbs
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    $191.50/yr (Mid/full SUVs, pickups, vans)
                  </p>
                </button>
              </div>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="weight-under-3700"
                  onClick={() => updateField('weightClass', 'under3700lbs')}
                  className={`min-h-[44px] rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                    inputs.weightClass === 'under3700lbs' || inputs.weightClass === 'under3500lbs' || inputs.weightClass === '3501to3700lbs'
                      ? 'border-indigo-500 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/40'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Standard / Light
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      ≤ {weightSplitLabel} lbs
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Sedans, compact crossovers, hatchbacks
                  </p>
                </button>

                <button
                  type="button"
                  id="weight-over-3700"
                  onClick={() => updateField('weightClass', 'over3700lbs')}
                  className={`min-h-[44px] rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                    inputs.weightClass === 'over3700lbs'
                      ? 'border-indigo-500 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/40'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Heavy / Trucks
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      &gt; {weightSplitLabel} lbs
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Mid/full SUVs, pickups, vans
                  </p>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Registration Term Toggle */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Registration Term
            </label>
            <span className="text-[11px] text-slate-400">{rule.label} tag options</span>
          </div>
          {offeredTerms.length === 1 ? (
            // A state with one registration term shows it as the only option, not a toggle
            <div className="mt-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800/80">
              <div
                id={`term-${offeredTerms[0]}-year`}
                className="flex min-h-[44px] items-center justify-center rounded-xl bg-white py-2.5 text-xs font-bold text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400"
              >
                {offeredTerms[0]}-Year Term ({rule.label} registers for {TERM_WORDS[offeredTerms[0]]})
              </div>
            </div>
          ) : (
            <div
              className={`mt-2 grid gap-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800/80 ${
                offeredTerms.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
              }`}
            >
              {offeredTerms.map((term) => (
                <button
                  key={term}
                  type="button"
                  id={`term-${term}-year`}
                  onClick={() => updateField('registrationTerm', term)}
                  className={`flex min-h-[44px] items-center justify-center rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer ${
                    inputs.registrationTerm === term
                      ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {TERM_LABELS[term]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Fuel Type / EV Surcharge Option */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Powertrain / Fuel Type
            </label>
            <span className="text-[11px] text-slate-400">EV surcharge rules</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {[
              { id: 'gasoline', label: 'Gas / Diesel', sub: '$0 surcharge' },
              {
                id: 'ev',
                label: 'Battery EV',
                sub: rule.registration.evSurchargeAnnual
                  ? `+$${rule.registration.evSurchargeAnnual}/yr`
                  : '$0 state fee'
              },
              {
                id: 'phev',
                label: 'Plug-in Hybrid',
                sub: rule.registration.phevSurchargeAnnual
                  ? `+$${rule.registration.phevSurchargeAnnual}/yr`
                  : '$0 state fee'
              }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => updateField('fuelType', f.id as FuelType)}
                className={`flex min-h-[44px] flex-col items-center justify-center rounded-2xl border p-2.5 text-center transition-all cursor-pointer ${
                  inputs.fuelType === f.id
                    ? 'border-indigo-500 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/40'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <span className="block text-xs font-bold text-slate-900 dark:text-white">
                  {f.label}
                </span>
                <span className="block text-[10px] font-medium text-slate-500 dark:text-slate-400">
                  {f.sub}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Financed Purchase Toggle (Lien Fee) */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Financing &amp; Lien Filing
            </label>
            <span className="text-[11px] font-medium text-slate-400">
              Lien fee: ${rule.lienFilingFee}.00
            </span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              id="financed-no"
              onClick={() => updateField('isFinanced', false)}
              className={`min-h-[44px] rounded-2xl border p-3 text-left transition-all cursor-pointer ${
                !inputs.isFinanced
                  ? 'border-emerald-500 bg-emerald-50/50 dark:border-emerald-500 dark:bg-emerald-950/40'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Cash Purchase
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  $0 Fee
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                Paid in full, no bank lien
              </p>
            </button>

            <button
              type="button"
              id="financed-yes"
              onClick={() => updateField('isFinanced', true)}
              className={`min-h-[44px] rounded-2xl border p-3 text-left transition-all cursor-pointer ${
                inputs.isFinanced
                  ? 'border-indigo-500 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/40'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Financed (Lender)
                </span>
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                  +${rule.lienFilingFee}.00
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                Security interest filing
              </p>
            </button>
          </div>
        </div>

        {/* Plate to transfer (states with one-time new plate fees, e.g. Florida) */}
        {rule.registration.newPlateFees && (
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Do you have a {rule.label} license plate to transfer?
              </label>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                id="plate-transfer-no"
                aria-pressed={!inputs.hasPlateToTransfer}
                onClick={() => updateField('hasPlateToTransfer', false)}
                className={`min-h-[44px] rounded-2xl border p-3 text-left transition-all cursor-pointer ${
                  !inputs.hasPlateToTransfer
                    ? 'border-indigo-500 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/40'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">No</span>
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    +${rule.registration.newPlateFees.initialRegistrationFee + rule.registration.newPlateFees.plateFee}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                  ${rule.registration.newPlateFees.initialRegistrationFee} initial registration + ${rule.registration.newPlateFees.plateFee} plate
                </p>
              </button>
              <button
                type="button"
                id="plate-transfer-yes"
                aria-pressed={Boolean(inputs.hasPlateToTransfer)}
                onClick={() => updateField('hasPlateToTransfer', true)}
                className={`min-h-[44px] rounded-2xl border p-3 text-left transition-all cursor-pointer ${
                  inputs.hasPlateToTransfer
                    ? 'border-emerald-500 bg-emerald-50/50 dark:border-emerald-500 dark:bg-emerald-950/40'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Yes</span>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">$0</span>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                  A plate registered in your name
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Trade-In Input with State-Specific Statute Notice (Item 5: Disabled for Maryland) */}
        <div className={`rounded-2xl border p-4 transition-all ${
          isMaryland
            ? 'border-slate-200/60 bg-slate-50/40 dark:border-slate-800/60 dark:bg-slate-800/20'
            : 'border-slate-200/60 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30'
        }`}>
          <div className="flex items-center justify-between">
            <label
              htmlFor="trade-in-input"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Trade-in Value (Optional)
            </label>
            {rule.tradeInDeductible ? (
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {rule.label}: Deductible
              </span>
            ) : isMaryland ? (
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Maryland: Non-Deductible (Dealer Only)
              </span>
            ) : (
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {rule.label}: Non-Deductible
              </span>
            )}
          </div>

          <div className="relative mt-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <span className={`text-sm font-bold ${isMaryland ? 'text-slate-300 dark:text-slate-600' : 'text-slate-400'}`}>$</span>
            </div>
            <input
              type="number"
              id="trade-in-input"
              min="0"
              step="100"
              disabled={isMaryland}
              value={isMaryland ? '' : (inputs.tradeInValue || '')}
              onChange={(e) => updateField('tradeInValue', Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder={isMaryland ? 'Disabled: Trade-ins not deductible on MD private sales' : '0'}
              className={`block w-full min-h-[44px] rounded-xl border border-slate-200 py-2.5 pl-7 pr-3 text-sm font-bold shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700 ${
                isMaryland
                  ? 'cursor-not-allowed bg-slate-100/90 text-slate-400 dark:bg-slate-800/80 dark:text-slate-500'
                  : 'bg-white text-slate-900 dark:bg-slate-900 dark:text-white'
              }`}
            />
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            {isMaryland ? (
              <>
                <strong>Maryland Statute:</strong> Maryland taxes the full agreed vehicle price. Trade-ins do not reduce the tax base on private-party sales. Trade-in deductions are legally permitted only on transactions through licensed Maryland motor vehicle dealers.
              </>
            ) : rule.tradeInDeductible ? (
              <>
                <strong>{rule.label} Statute:</strong> {rule.label} allows trade-in value on private sales to be deducted from the purchase price before applying the {(rule.exciseTaxRate * 100).toFixed(2)}% fee.
              </>
            ) : rule.exciseTaxRate === 0 ? (
              <>
                <strong>{rule.label} Notice:</strong> Private-party vehicle purchases in {rule.label} are exempt from vehicle sales tax (0% tax rate), so trade-in deductions do not apply.
              </>
            ) : (
              <>
                <strong>{rule.label} Notice:</strong> {rule.label} taxes the full agreed vehicle price. Trade-ins do not reduce the tax base on private-party sales.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
