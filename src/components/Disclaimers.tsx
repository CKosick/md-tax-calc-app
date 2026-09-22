import React from 'react';

interface DisclaimersProps {
  disclaimers?: string[];
  bookValueApplies?: boolean;
  tradeInIgnored?: boolean;
}

export function Disclaimers({
  disclaimers = [],
  bookValueApplies = false,
  tradeInIgnored = false
}: DisclaimersProps) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-center gap-2 mb-3">
        <svg
          className="h-4 w-4 text-slate-500 dark:text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.75}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Official Notice & Statutory Disclaimers
        </span>
      </div>

      <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
        {/* Core required disclaimers */}
        <p className="flex items-start gap-2 font-medium text-slate-700 dark:text-slate-200">
          <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400"></span>
          <span>
            <strong>Estimates only — not tax or legal advice.</strong> Verify final assessments directly with the Maryland Motor Vehicle Administration (MVA).
          </span>
        </p>

        <p className={`flex items-start gap-2 ${bookValueApplies ? 'font-medium text-amber-700 dark:text-amber-400' : ''}`}>
          <span className={`mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full ${bookValueApplies ? 'bg-amber-500' : 'bg-slate-400'}`}></span>
          <span>
            <strong>Maryland Book-Value Rule:</strong> Vehicles 7 years old or newer may be assessed on book value (NADA clean retail), not your purchase price, unless you present a notarized bill of sale (MVA Form VR-181).
          </span>
        </p>

        <p className={`flex items-start gap-2 ${tradeInIgnored ? 'font-medium text-indigo-700 dark:text-indigo-400' : ''}`}>
          <span className={`mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full ${tradeInIgnored ? 'bg-indigo-500' : 'bg-slate-400'}`}></span>
          <span>
            <strong>Trade-in Exemption Rule:</strong> Maryland taxes the full purchase price — trade-ins and rebates do not reduce excise tax on private-party vehicle transactions.
          </span>
        </p>

        {disclaimers.map((item, idx) => (
          <p key={idx} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400"></span>
            <span>{item}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
