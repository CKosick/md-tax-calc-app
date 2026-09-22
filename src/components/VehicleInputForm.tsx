'use client';

import React from 'react';
import { CalculatorInputs, StateRule, VehicleType, WeightClass, FuelType, RegistrationTerm } from '@/lib/types';

interface VehicleInputFormProps {
  inputs: CalculatorInputs;
  onChange: (inputs: CalculatorInputs) => void;
  rule: StateRule;
  allStates?: { key: string; label: string }[];
}

export function VehicleInputForm({
  inputs,
  onChange,
  rule,
  allStates = [{ key: 'maryland', label: 'Maryland' }]
}: VehicleInputFormProps) {
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

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-8">
      {/* Form Header */}
      <div className="border-b border-slate-100 pb-5 dark:border-slate-800">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Vehicle & Transaction Details
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Enter the purchase information to calculate true out-of-pocket MVA costs.
        </p>
      </div>

      <div className="space-y-6">
        {/* State Selection (Disabled/Locked for MVP) */}
        <div>
          <label
            htmlFor="state-select"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            State of Registration
          </label>
          <div className="relative mt-2">
            <select
              id="state-select"
              disabled
              value={inputs.state}
              className="block w-full appearance-none rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800 shadow-xs cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {allStates.map((st) => (
                <option key={st.key} value={st.key}>
                  {st.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                49 more states coming soon
              </span>
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
              <span>Motorcycle (Class D)</span>
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
            <span className="text-[11px] text-slate-400">MD 6.5% tax base</span>
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
                currentYear - inputs.vehicleYear <= 7
                  ? 'font-bold text-amber-600 dark:text-amber-400'
                  : 'text-slate-400'
              }`}
            >
              {currentYear - inputs.vehicleYear} years old {currentYear - inputs.vehicleYear <= 7 ? '(≤ 7 yrs rule)' : '(> 7 yrs)'}
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
                Vehicle Shipping Weight Class
              </label>
              <span className="text-[11px] text-slate-400">Class A Passenger</span>
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
                    ≤ 3,700 lbs
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    Standard Cars
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Sedans, compact SUVs, hatchbacks
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
                    &gt; 3,700 lbs
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    Heavy / Trucks
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
            <span className="text-[11px] text-slate-400">MD now offers 1 or 2 years</span>
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
              { id: 'ev', label: 'Battery EV', sub: '+$125/yr' },
              { id: 'phev', label: 'Plug-in Hybrid', sub: '+$100/yr' }
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
              Financing & Lien Filing
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

        {/* Optional Trade-In Input with Maryland Law Warning */}
        <div className="rounded-2xl border border-slate-200/60 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
          <div className="flex items-center justify-between">
            <label
              htmlFor="trade-in-input"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Trade-in Value (Optional)
            </label>
            <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              MD Law: Non-Deductible
            </span>
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
            <strong>Maryland Notice:</strong> Maryland taxes the full purchase price — trade-ins and rebates do not reduce excise tax on private sales.
          </p>
        </div>
      </div>
    </div>
  );
}
