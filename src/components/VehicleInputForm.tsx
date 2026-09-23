'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CalculatorInputs, StateRule, FuelType } from '@/lib/types';

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
}

export function VehicleInputForm({
  inputs,
  onChange,
  rule,
  allStates = []
}: VehicleInputFormProps) {
  const router = useRouter();
  const currentYear = 2026;

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
    <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-8">
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
              className="block w-full appearance-none rounded-2xl border border-slate-300 bg-white px-4 py-3.5 pr-10 text-sm font-bold text-slate-900 shadow-xs transition-all hover:border-indigo-400 focus:border-indigo-500 focus:outline-none focus:ring-3 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white cursor-pointer"
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
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
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
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
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
              className="block w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-8 pr-4 text-base font-bold text-slate-900 shadow-xs transition-all focus:border-indigo-500 focus:outline-none focus:ring-3 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
          {/* Quick preset chips */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[5000, 10000, 15000, 20000, 25000, 35000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => updateField('purchasePrice', preset)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  inputs.purchasePrice === preset
                    ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
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
                rule.slug === 'maryland-private-sale-tax-calculator' && currentYear - inputs.vehicleYear <= 7
                  ? 'font-bold text-amber-600 dark:text-amber-400'
                  : 'text-slate-400'
              }`}
            >
              {currentYear - inputs.vehicleYear} years old {rule.slug === 'maryland-private-sale-tax-calculator' ? (currentYear - inputs.vehicleYear <= 7 ? '(≤ 7 yrs rule)' : '(> 7 yrs)') : ''}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <input
              type="number"
              id="model-year-input"
              min="1970"
              max={currentYear + 1}
              value={inputs.vehicleYear || ''}
              onChange={(e) => updateField('vehicleYear', parseInt(e.target.value) || currentYear)}
              placeholder="2019"
              className="col-span-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-3 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
            <div className="col-span-2 flex items-center gap-1.5 overflow-x-auto">
              {[2024, 2021, 2019, 2017, 2015].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => updateField('vehicleYear', yr)}
                  className={`rounded-xl px-2.5 py-2.5 text-xs font-semibold transition-all ${
                    inputs.vehicleYear === yr
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Weight Class (Passenger Cars only) */}
        {inputs.vehicleType === 'passenger' && (
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Vehicle Weight Classification
              </label>
              <span className="text-[11px] text-slate-400">
                {rule.slug === 'maryland-private-sale-tax-calculator' ? 'Class A Passenger' : 'Standard Passenger'}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                id="weight-under-3700"
                onClick={() => updateField('weightClass', 'under3700lbs')}
                className={`rounded-2xl border p-3.5 text-left transition-all ${
                  inputs.weightClass === 'under3700lbs'
                    ? 'border-indigo-500 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/40'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Standard / Light
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    ≤ 3,700 lbs
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
                className={`rounded-2xl border p-3.5 text-left transition-all ${
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
                  Mid/full SUVs, pickups, vans
                </p>
              </button>
            </div>
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
          <div className="mt-2 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800/80">
            <button
              type="button"
              id="term-1-year"
              onClick={() => updateField('registrationTerm', 1)}
              className={`rounded-xl py-2.5 text-xs font-bold transition-all ${
                inputs.registrationTerm === 1
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              1-Year Term (Annual)
            </button>
            <button
              type="button"
              id="term-2-year"
              onClick={() => updateField('registrationTerm', 2)}
              className={`rounded-xl py-2.5 text-xs font-bold transition-all ${
                inputs.registrationTerm === 2
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              2-Year Term (Standard)
            </button>
          </div>
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
                className={`rounded-2xl border p-2.5 text-center transition-all ${
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
              className={`rounded-2xl border p-3 text-left transition-all ${
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
              className={`rounded-2xl border p-3 text-left transition-all ${
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

        {/* Trade-In Input with State-Specific Statute Notice */}
        <div className="rounded-2xl border border-slate-200/60 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
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
            ) : (
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {rule.label}: Non-Deductible
              </span>
            )}
          </div>

          <div className="relative mt-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <span className="text-sm font-bold text-slate-400">$</span>
            </div>
            <input
              type="number"
              id="trade-in-input"
              min="0"
              step="100"
              value={inputs.tradeInValue || ''}
              onChange={(e) => updateField('tradeInValue', Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="0"
              className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-7 pr-3 text-sm font-bold text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            {rule.tradeInDeductible ? (
              <>
                <strong>{rule.label} Statute:</strong> {rule.label} allows trade-in value on private sales to be deducted from the purchase price before applying the {(rule.exciseTaxRate * 100).toFixed(2)}% fee.
              </>
            ) : rule.exciseTaxRate === 0 ? (
              <>
                <strong>{rule.label} Notice:</strong> Private-party vehicle purchases in {rule.label} are exempt from vehicle sales tax (0% tax rate), so trade-in deductions do not apply.
              </>
            ) : (
              <>
                <strong>{rule.label} Notice:</strong> {rule.label} taxes the full agreed vehicle price — trade-ins do not reduce the tax base on private-party sales.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
