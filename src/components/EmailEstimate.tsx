'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CalculatorInputs, CostBreakdown, StateRule } from '@/lib/types';
import { buildEstimatePayload, sendEstimate } from '@/lib/emailEstimate';

interface EmailEstimateProps {
  /** Formspree form ID, resolved on the server (getFormspreeFormId). */
  formId: string;
  rule: StateRule;
  breakdown: CostBreakdown;
  purchasePrice: number;
  inputs?: CalculatorInputs;
}

/**
 * "Email me this estimate": posts the address and this estimate to Formspree without leaving the
 * page. Success replaces the form with a confirmation; failure keeps the typed address.
 */
export function EmailEstimate({ formId, rule, breakdown, purchasePrice, inputs }: EmailEstimateProps) {
  const [email, setEmail] = useState('');
  // Formspree honeypot: people never see or fill it, so a value marks the submission as spam
  const [gotcha, setGotcha] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    const payload = buildEstimatePayload({
      email: email.trim(),
      rule,
      breakdown,
      purchasePrice,
      inputs,
      pageUrl: window.location.href
    });
    if (gotcha) payload._gotcha = gotcha;
    setStatus((await sendEstimate(formId, payload)) ? 'sent' : 'error');
  };

  if (status === 'sent') {
    return (
      <div id="email-estimate" className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/30">
        <p id="email-estimate-sent" role="status" className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
          Sent. Your {rule.label} estimate is on its way to {email.trim()}.
        </p>
      </div>
    );
  }

  return (
    <div id="email-estimate" className="mt-6 rounded-2xl border border-slate-200/60 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
      <form onSubmit={handleSubmit}>
        <label htmlFor="email-estimate-input" className="block text-xs font-bold text-slate-900 dark:text-white">
          Email me this estimate
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id="email-estimate-input"
            type="email"
            name="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="block w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-3 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <input
            type="text"
            name="_gotcha"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={gotcha}
            onChange={(e) => setGotcha(e.target.value)}
            className="hidden"
          />
          <button
            type="submit"
            disabled={status === 'sending'}
            className="min-h-[44px] shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-60 cursor-pointer"
          >
            {status === 'sending' ? 'Sending…' : 'Send'}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          We email this estimate to the address you enter and use the address for nothing else. No newsletter, no
          marketing.{' '}
          <Link href="/privacy" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
            Privacy
          </Link>
        </p>
        {status === 'error' && (
          <p id="email-estimate-error" role="alert" className="mt-2 text-xs font-semibold text-red-700 dark:text-red-400">
            Sorry, the estimate could not be sent. Please check the address and try again.
          </p>
        )}
      </form>
    </div>
  );
}
