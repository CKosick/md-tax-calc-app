'use client';

import React, { useState } from 'react';
import { FaqItem } from '@/lib/types';

interface FaqSectionProps {
  faqs: FaqItem[];
  stateLabel?: string;
}

export function FaqSection({ faqs, stateLabel = 'Maryland' }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section aria-labelledby="faq-section-title" className="mt-16 border-t border-slate-200 pt-12 dark:border-slate-800">
      <div className="mb-8">
        <h2 id="faq-section-title" className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          Frequently Asked Questions: {stateLabel} Vehicle Taxes &amp; Fees
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Essential statutory answers regarding {stateLabel} vehicle sales taxes, titling requirements, and registration fees.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white/70 shadow-xs transition-all dark:border-slate-800 dark:bg-slate-900/60"
            >
              <h3>
                <button
                  type="button"
                  id={`faq-btn-${idx}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${idx}`}
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <span className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    {faq.question}
                  </span>
                  <span
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-transform duration-200 dark:bg-slate-800 dark:text-slate-400 ${
                      isOpen ? 'rotate-180 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400' : ''
                    }`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </button>
              </h3>

              <div
                id={`faq-panel-${idx}`}
                role="region"
                aria-labelledby={`faq-btn-${idx}`}
                hidden={!isOpen}
                className={`px-5 pb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300 ${isOpen ? 'block' : 'hidden'}`}
              >
                <p className="border-t border-slate-100 pt-3 dark:border-slate-800/80">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
