'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface StateOption {
  key: string;
  label: string;
  slug: string;
}

interface HomeStateSelectorProps {
  states: StateOption[];
  featuredStates: { slug: string; label: string }[];
}

export function HomeStateSelector({ states, featuredStates }: HomeStateSelectorProps) {
  const router = useRouter();

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slug = e.target.value;
    if (slug) {
      router.push(`/calculator/${slug}`);
    }
  };

  return (
    <div className="mt-10 rounded-3xl border border-slate-200/90 bg-white p-5 shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-7">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full flex-1">
          <label htmlFor="home-state-select" className="sr-only">
            Select Your State
          </label>
          <select
            id="home-state-select"
            defaultValue=""
            onChange={handleSelect}
            className="block w-full appearance-none rounded-2xl border border-slate-300 bg-slate-50/80 px-4 py-3.5 pr-10 text-sm font-bold text-slate-900 shadow-xs transition-colors hover:border-indigo-400 focus:border-indigo-500 focus:outline-none focus:ring-3 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
          >
            <option value="" disabled>
              Choose your registration state...
            </option>
            {states.map((st) => (
              <option key={st.key} value={st.slug}>
                {st.label} Private Party Calculator
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
            <svg
              className="h-4 w-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>

        <Link
          href="/calculator"
          className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <span>Browse All States</span>
          <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>

      {/* Popular Quick-Jump Tags */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-slate-700 dark:text-slate-300">Popular:</span>
        {featuredStates.map((st) => (
          <Link
            key={st.slug}
            href={`/calculator/${st.slug}`}
            className="rounded-lg bg-slate-100 px-2 py-0.5 font-medium text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            {st.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
