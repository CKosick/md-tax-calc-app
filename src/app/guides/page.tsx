import { Metadata } from 'next';
import Link from 'next/link';
import stateRulesData from '@/config/stateRules.json';
import { StateRulesConfig } from '@/lib/types';
import { GUIDES } from '@/config/guides';

const rules = stateRulesData as StateRulesConfig;

export const metadata: Metadata = {
  title: 'Car Title, Tax & Registration Guides',
  description:
    'Step-by-step guides to titling, gifting, and registering a vehicle, with the documents to bring and a built-in cost calculator. Starting with Maryland.',
  alternates: {
    canonical: '/guides'
  }
};

export default function GuidesIndexPage() {
  // Group guides by state, in the order they first appear
  const stateKeys = [...new Set(GUIDES.map((g) => g.stateKey))];

  return (
    <main className="min-h-screen bg-slate-50/50 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400"
        >
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Home
          </Link>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="font-semibold text-slate-900 dark:text-white" aria-current="page">
            Guides
          </span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Car Title, Tax &amp; Registration Guides
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
            Plain, step-by-step answers for buying, gifting, and moving a car, checked against the state motor vehicle
            agency. Each guide includes a working cost calculator.
          </p>
        </header>

        {stateKeys.map((stateKey) => {
          const rule = rules[stateKey];
          const stateGuides = GUIDES.filter((g) => g.stateKey === stateKey);
          return (
            <section key={stateKey} aria-labelledby={`guides-${stateKey}`} className="mb-10">
              <h2 id={`guides-${stateKey}`} className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {rule.label}
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-3">
                {stateGuides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="flex min-h-[44px] flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                  >
                    <span className="text-base font-bold text-slate-900 dark:text-white">{guide.title}</span>
                    <span className="mt-1 text-sm text-slate-600 dark:text-slate-300">{guide.cardDescription}</span>
                    <span className="mt-2 text-xs text-slate-400">Last verified: {guide.lastVerified}</span>
                  </Link>
                ))}
              </div>
              <Link
                href={`/calculator/${rule.slug}`}
                className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                <span>{rule.label} Private Party Car Tax Calculator</span>
              </Link>
            </section>
          );
        })}
      </div>
    </main>
  );
}
