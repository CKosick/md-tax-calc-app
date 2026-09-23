import { Metadata } from 'next';
import Link from 'next/link';
import stateRulesData from '@/config/stateRules.json';
import { StateRulesConfig } from '@/lib/types';
import { formatFee } from '@/lib/formatters';
import { HomeStateSelector } from '@/components/HomeStateSelector';

const rules = stateRulesData as StateRulesConfig;

export const metadata: Metadata = {
  title: 'Private Party Car Tax Calculator for All 50 States & DC',
  description:
    'Calculate exact first-year out-of-pocket costs for a private car purchase. Fast, accurate state vehicle sales tax, certificate of title fees, and tag registration across all 50 US states and DC.',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'Private Party Car Tax Calculator for All 50 States & DC | CarTaxHub',
    description:
      'Calculate exact out-of-pocket costs for private vehicle purchases across all 50 states + DC: vehicle sales tax, title fees, and tag registrations.',
    url: '/',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Private Party Car Tax Calculator for All 50 States & DC | CarTaxHub',
    description:
      'Calculate exact out-of-pocket costs for private vehicle purchases across all 50 states + DC: sales tax, title fees, and tag registrations.'
  }
};

const FEATURED_STATE_KEYS = [
  'california',
  'texas',
  'florida',
  'new-york',
  'pennsylvania',
  'illinois',
  'ohio',
  'georgia',
  'north-carolina',
  'michigan',
  'virginia',
  'maryland'
];

export default function HomePage() {
  const allStatesList = Object.entries(rules)
    .map(([key, rule]) => ({
      key,
      label: rule.label,
      slug: rule.slug,
      exciseTaxRate: rule.exciseTaxRate,
      titleFee: rule.titleFee,
      flatTaxTable: Boolean(rule.flatTaxTable)
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const featuredStates = FEATURED_STATE_KEYS.map((k) => rules[k]).filter(Boolean);

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CarTaxHub',
    url: 'https://cartaxhub.com',
    description:
      'Fast, accurate private-party vehicle sales tax, title certificate fee, and license tag registration calculators across all 50 US states and DC.'
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CarTaxHub',
    url: 'https://cartaxhub.com',
    logo: 'https://cartaxhub.com/og-image.png'
  };

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'CarTaxHub Private Party Car Tax Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    description:
      'Online statutory cost estimator for private-party vehicle transactions across all 50 US states and Washington DC.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-slate-200/80 bg-white/70 py-16 dark:border-slate-800 dark:bg-slate-900/50 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                <span>Verified 2026 Statutory Rates • 50 States + DC</span>
              </div>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
                Private Party Car Tax Calculator for All 50 States + DC
              </h1>

              <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
                Buying a car from a private seller? Calculate your true first-year out-of-pocket costs in seconds. Accurately estimates vehicle sales &amp; use taxes, DMV title certificate fees, tag registration, and trade-in exemptions.
              </p>

              {/* State Quick-Finder */}
              <HomeStateSelector
                states={allStatesList}
                featuredStates={featuredStates.slice(0, 6)}
              />
            </div>
          </div>
        </section>

        {/* Featured State Calculators Grid */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Statutory Estimators
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Popular State Vehicle Tax Calculators
              </h2>
              <p className="mt-2 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                Instant calculations tailored to state department of revenue and DMV guidelines:
              </p>
            </div>
            <Link
              href="/calculator"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <span>View All 51 Jurisdictions</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredStates.map((st) => {
              const taxPct = (st.exciseTaxRate * 100).toFixed(2);
              const rateBadge = st.flatTaxTable
                ? 'RUT-50 Flat Table'
                : st.exciseTaxRate === 0
                ? '0.00% (Exempt)'
                : `${taxPct}% Rate`;

              return (
                <Link
                  key={st.slug}
                  href={`/calculator/${st.slug}`}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-indigo-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {st.label}
                      </span>
                      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                        {rateBadge}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                      Title fee {formatFee(st.titleFee)} • {st.tradeInDeductible ? 'Trade-in deductible' : 'Full price taxed'}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:text-indigo-700 dark:text-indigo-400">
                    <span>Calculate {st.label}</span>
                    <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="border-t border-slate-200 bg-white/60 py-16 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Transparent &amp; Accurate
              </span>
              <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                How CarTaxHub Calculates Your First-Year Costs
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                Private sales avoid dealership doc fees, but DMV taxes and titling still add up. We model each jurisdiction&apos;s exact formulas:
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                  1
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                  State Sales, Use &amp; Excise Tax
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  Calculates statutory rates from 0% (in occasional-sale states like NV, NH, MT, OR, DE) up to tiered brackets (CT luxury tiers, DC weight/MPG formulas, IL Form RUT-50 tables).
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                  2
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                  Title &amp; Security Lien Fees
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  Itemizes mandatory state certificate of title transfer fees and optional security interest / lien recordation costs when financing through a private-party auto lender.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                  3
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                  Tags, Registration &amp; Fuel Surcharges
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  Accounts for vehicle weight tiers, 1- or 2-year renewal terms, passenger vs. motorcycle classification, and annual EV / plug-in hybrid statutory road improvement surcharges.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Directory Hub Call-to-Action */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-indigo-900 to-slate-900 p-8 text-center text-white shadow-xl sm:p-12">
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Ready to Calculate Your State&apos;s True Car Costs?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm text-indigo-200">
              Access all 50 US states and Washington DC in our comprehensive fee directory with comparison tables and statutory citations.
            </p>
            <div className="mt-6">
              <Link
                href="/calculator"
                className="inline-flex items-center rounded-2xl bg-white px-6 py-3.5 text-xs font-bold text-slate-900 shadow-md transition-all hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                <span>Open 51-State Calculator Directory</span>
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
