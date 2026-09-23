import React from 'react';

interface DisclaimersProps {
  disclaimers?: string[];
  localTaxNote?: string;
  bookValueApplies?: boolean;
  tradeInIgnored?: boolean;
}

export function Disclaimers({
  disclaimers = [],
  localTaxNote,
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
          Official Notice &amp; Statutory Disclaimers
        </span>
      </div>

      <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
        {disclaimers.map((item, idx) => {
          const isEstimates = item.toLowerCase().includes('estimates only');
          const isBookValue = item.toLowerCase().includes('book value') || item.toLowerCase().includes('book-value');
          const isTradeIn = item.toLowerCase().includes('trade-in');

          let highlightClasses = '';
          let bulletClasses = 'bg-slate-400';

          if (isEstimates) {
            highlightClasses = 'font-medium text-slate-700 dark:text-slate-200';
          } else if (isBookValue && bookValueApplies) {
            highlightClasses = 'font-medium text-amber-700 dark:text-amber-400';
            bulletClasses = 'bg-amber-500';
          } else if (isTradeIn && tradeInIgnored) {
            highlightClasses = 'font-medium text-indigo-700 dark:text-indigo-400';
            bulletClasses = 'bg-indigo-500';
          }

          return (
            <p key={idx} className={`flex items-start gap-2 ${highlightClasses}`}>
              <span className={`mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full ${bulletClasses}`}></span>
              <span>{item}</span>
            </p>
          );
        })}

        {localTaxNote && (
          <p className="flex items-start gap-2 font-medium text-slate-800 dark:text-slate-100">
            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500"></span>
            <span><strong>County &amp; Local Tax Note:</strong> {localTaxNote}</span>
          </p>
        )}
      </div>
    </div>
  );
}
