import { Metadata } from 'next';
import Link from 'next/link';
import stateRulesData from '@/config/stateRules.json';
import { StateRulesConfig } from '@/lib/types';

const rules = stateRulesData as StateRulesConfig;

export const metadata: Metadata = {
  title: 'Private Party Vehicle Tax & Title Calculators by State (2026)',
  description: 'Select your state to calculate true out-of-pocket costs for a private vehicle sale: sales/excise tax, title certificate fees, tag registration, and lien fees across MD, VA, PA, DE, and DC.',
  alternates: {
    canonical: '/calculator'
  },
  openGraph: {
    title: 'Private Party Vehicle Tax & Title Calculators by State (2026)',
    description: 'Select your state to calculate true out-of-pocket costs for a private vehicle sale across MD, VA, PA, DE, and DC.',
    url: '/calculator',
    type: 'website'
  }
};

export default function CalculatorHubPage() {
  const stateList = Object.entries(rules).map(([key, rule]) => ({
    key,
    ...rule
  }));

  return (
    <main className="min-h-screen bg-slate-50/50 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            <span>2026 Mid-Atlantic State Directory</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
            Private-Party Vehicle Tax, Tags &amp; Title Calculators
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Buying a used car from a private seller? Every state calculates vehicle taxes, title certificate fees, and license plate tags differently. Choose your registration state below to get an exact, itemized out-of-pocket breakdown.
          </p>
        </header>

        {/* State Cards Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stateList.map((st) => {
            const taxPct = (st.exciseTaxRate * 100).toFixed(2);
            return (
              <div
                key={st.key}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white/90 p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-400 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/80"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {st.label}
                    </span>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {taxPct}% Rate
                    </span>
                  </div>

                  <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                    <Link href={`/calculator/${st.slug}`} className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {st.label} Vehicle Tax Calculator
                    </Link>
                  </h2>

                  <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    Calculates {st.label}&apos;s {taxPct}% {st.label === 'Delaware' ? 'document fee' : st.label === 'Virginia' ? 'SUT' : 'tax'}, ${st.titleFee} title certificate, and annual or multi-year tag fees.
                  </p>

                  <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs dark:border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Title Certificate:</span>
                      <span className="font-bold text-slate-900 dark:text-white">${st.titleFee}.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Lien Recordation:</span>
                      <span className="font-bold text-slate-900 dark:text-white">${st.lienFilingFee}.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Trade-in Credit:</span>
                      <span className={`font-bold ${st.tradeInDeductible ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                        {st.tradeInDeductible ? 'Deductible (Allowed)' : 'Not Deductible'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-indigo-600 group-hover:text-indigo-700 dark:text-indigo-400">
                  <span>Open {st.label} Calculator</span>
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* State Comparison Table */}
        <section className="mt-16 rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Mid-Atlantic State Fee Comparison (2026)
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Compare statutory vehicle taxes, title certificate fees, and trade-in deductibility across neighboring jurisdictions.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 font-bold uppercase tracking-wider text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <tr>
                  <th scope="col" className="px-4 py-3.5">State</th>
                  <th scope="col" className="px-4 py-3.5">Tax / Fee Rate</th>
                  <th scope="col" className="px-4 py-3.5">Tax Base</th>
                  <th scope="col" className="px-4 py-3.5">Title Fee</th>
                  <th scope="col" className="px-4 py-3.5">Lien Fee</th>
                  <th scope="col" className="px-4 py-3.5">Trade-in Credit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {stateList.map((st) => (
                  <tr key={st.key} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                      <Link href={`/calculator/${st.slug}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                        {st.label}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                      {(st.exciseTaxRate * 100).toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 capitalize">
                      {st.taxBase === 'fairMarketValue' ? 'Fair Market Value (NADA)' : st.taxBase}
                    </td>
                    <td className="px-4 py-3 text-slate-800 dark:text-slate-200">
                      ${st.titleFee}.00
                    </td>
                    <td className="px-4 py-3 text-slate-800 dark:text-slate-200">
                      ${st.lienFilingFee}.00
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        st.tradeInDeductible
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {st.tradeInDeductible ? 'Yes (Deducted)' : 'No (Taxes Full Price)'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
