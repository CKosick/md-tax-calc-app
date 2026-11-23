import React from 'react';
import Link from 'next/link';
import { CostBreakdown, FaqItem, StateRule } from '@/lib/types';
import { getPublishedFaqs } from '@/lib/faqs';

/** The state's private-sale and gift guides, as far as the checklist uses them. */
export interface ChecklistGuides {
  privateSale?: { href: string; title: string; checklist: string[] };
  gift?: { href: string; title: string };
}

interface PrePurchaseChecklistProps {
  rule: StateRule;
  breakdown: CostBreakdown;
  guides?: ChecklistGuides;
  /** Optional content placed inside the checklist (an in-content partner block). */
  children?: React.ReactNode;
}

const DEADLINE_QUESTION = /how long do i have|deadline|how soon/i;
const FAMILY_QUESTION = /family|gift/i;

/**
 * The verified answers the checklist can use. Only published FAQs count: the generic placeholder
 * answers (hidden until a state is re-checked) never reach the checklist, so a state without a
 * verified deadline or family answer simply has no such item.
 */
export function getChecklistAnswers(rule: StateRule): { deadline?: FaqItem; family?: FaqItem } {
  const published = getPublishedFaqs(rule);
  return {
    deadline: published.find((f) => DEADLINE_QUESTION.test(f.question)),
    family: published.find((f) => FAMILY_QUESTION.test(f.question))
  };
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

/** Counter fees: the estimate's own itemized lines with an amount due. */
export function getCounterFees(breakdown: CostBreakdown): { id: string; label: string; amount: string }[] {
  return breakdown.itemizedList
    // The estimate's own total line is shown separately as the checklist total
    .filter((item) => item.id !== 'total-cost')
    .filter((item) => item.amount > 0 || (item.amountMax ?? 0) > 0)
    .map((item) => ({ id: item.id, label: item.label, amount: item.amountRangeFormatted ?? formatCurrency(item.amount) }));
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <li className="relative pl-10">
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white dark:bg-indigo-500"
      >
        {number}
      </span>
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
      <div className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{children}</div>
    </li>
  );
}

/**
 * Per-state pre-purchase checklist. Every item comes from data already verified for the state:
 * the published deadline and family FAQ answers, the private-sale guide's checklist, and the
 * fees in the current estimate. Nothing is written from general knowledge.
 */
export function PrePurchaseChecklist({ rule, breakdown, guides, children }: PrePurchaseChecklistProps) {
  const { deadline, family } = getChecklistAnswers(rule);
  const documents = guides?.privateSale?.checklist ?? [];
  const fees = getCounterFees(breakdown);
  const total =
    breakdown.hasLocalTax && breakdown.totalFirstYearCostMin !== undefined && breakdown.totalFirstYearCostMax !== undefined && (breakdown.localTaxMax ?? 0) > 0
      ? `${formatCurrency(breakdown.totalFirstYearCostMin)} – ${formatCurrency(breakdown.totalFirstYearCostMax)}`
      : formatCurrency(breakdown.totalFirstYearCost);

  let step = 0;
  return (
    <section id="pre-purchase-checklist" className="mt-16 border-t border-slate-200 pt-10 dark:border-slate-800">
      <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{rule.label} Pre-Purchase Checklist</h2>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {deadline || family || documents.length > 0
          ? `Built from the verified ${rule.label} answers and guide on this site and from your estimate above.`
          : 'Built from your estimate above.'}
      </p>

      <ol className="mt-6 space-y-6">
        {deadline && (
          <Step number={++step} title="Know your deadline">
            <p data-checklist-source="deadline-faq">{deadline.answer}</p>
          </Step>
        )}

        {documents.length > 0 && guides?.privateSale && (
          <Step number={++step} title="Bring these documents">
            <ul className="mt-1 space-y-2" data-checklist-source="private-sale-guide">
              {documents.map((doc) => (
                <li key={doc}>
                  <label className="flex min-h-[28px] cursor-pointer items-start gap-2.5">
                    <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    <span>{doc}</span>
                  </label>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs">
              From our guide:{' '}
              <Link href={guides.privateSale.href} className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
                {guides.privateSale.title}
              </Link>
            </p>
          </Step>
        )}

        {fees.length > 0 && (
          <Step number={++step} title="Fees due at the counter (from your estimate)">
            <ul className="mt-1 divide-y divide-slate-100 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800" data-checklist-source="estimate">
              {fees.map((fee) => (
                <li key={fee.id} className="flex items-center justify-between gap-3 px-3 py-2">
                  <span>{fee.label}</span>
                  <span className="font-semibold tabular-nums text-slate-900 dark:text-white">{fee.amount}</span>
                </li>
              ))}
              <li className="flex items-center justify-between gap-3 px-3 py-2 font-bold text-slate-900 dark:text-white">
                <span>Total in your estimate</span>
                <span className="tabular-nums">{total}</span>
              </li>
            </ul>
          </Step>
        )}

        {family && (
          <Step number={++step} title="If it is a gift or a family transfer">
            <p data-checklist-source="family-faq">{family.answer}</p>
            {guides?.gift && (
              <p className="mt-2 text-xs">
                Steps:{' '}
                <Link href={guides.gift.href} className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
                  {guides.gift.title}
                </Link>
              </p>
            )}
          </Step>
        )}
      </ol>

      {children}
    </section>
  );
}
