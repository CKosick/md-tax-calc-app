import { Metadata } from 'next';
import Link from 'next/link';
import { getComparisonDataset } from '@/lib/stateComparison';
import { VehicleTaxComparisonTables } from '@/components/VehicleTaxComparisonTables';
import { formatFee } from '@/lib/formatters';

export const metadata: Metadata = {
  title: 'Vehicle Tax by State (2026)',
  description:
    'Compare private-party vehicle sales tax, title fees, and total first-year costs across all 50 states + DC. Ranked tables from 2026 statutory rates.',
  alternates: {
    canonical: '/vehicle-tax-by-state'
  },
  openGraph: {
    title: 'Vehicle Tax by State (2026) | CarTaxHub',
    description:
      'Compare private-party vehicle sales tax, title fees, and total first-year costs across all 50 states + DC. Ranked tables from 2026 statutory rates.',
    url: '/vehicle-tax-by-state',
    type: 'article',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vehicle Sales Tax by State: 2026 Comparison - CarTaxHub'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vehicle Tax by State (2026) | CarTaxHub',
    description:
      'Compare private-party vehicle sales tax, title fees, and total first-year costs across all 50 states + DC. Ranked tables from 2026 statutory rates.',
    images: ['/og-image.png']
  }
};

export default function VehicleTaxByStatePage() {
  const dataset = getComparisonDataset();
  const { heroRows, taxRateRows, titleFeeRows, stats, lastVerifiedDate } = dataset;

  // 1. Dataset JSON-LD Schema
  const datasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: '2026 Vehicle Sales Tax, Title Fees, and First-Year Registration Costs by US State',
    description:
      'Comprehensive comparative dataset of state statutory vehicle sales and use tax rates, DMV certificate of title fees, annual passenger registration fees, and total first-year out-of-pocket costs for private-party vehicle purchases across all 50 US states and Washington D.C.',
    url: 'https://cartaxhub.com/vehicle-tax-by-state',
    keywords: [
      'vehicle sales tax by state',
      'car sales tax rates',
      'title fees by state',
      'vehicle registration fees',
      'private party car purchase tax',
      'car tax comparison 2026'
    ],
    creator: {
      '@type': 'Organization',
      name: 'CarTaxHub',
      url: 'https://cartaxhub.com'
    },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    isAccessibleForFree: true,
    temporalCoverage: '2026',
    spatialCoverage: {
      '@type': 'Place',
      name: 'United States'
    },
    variableMeasured: [
      'State Vehicle Sales and Use Tax Rate',
      'State Certificate of Title Fee',
      'Annual Passenger Registration Fee',
      'Total First-Year Out-of-Pocket Vehicle Titling Cost'
    ]
  };

  // 2. BreadcrumbList JSON-LD Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://cartaxhub.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Compare',
        item: 'https://cartaxhub.com/vehicle-tax-by-state'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Vehicle Tax by State',
        item: 'https://cartaxhub.com/vehicle-tax-by-state'
      }
    ]
  };

  // 3. FAQPage JSON-LD Schema
  const faqs = [
    {
      question: 'How is the total first-year vehicle cost calculated?',
      answer:
        'The total first-year cost reflects the mandatory out-of-pocket expenses required to legally title and register a private-party vehicle purchase. It equals the state vehicle sales or excise tax, plus the certificate of title fee, lien recording fee (if financed), and the state annual license plate registration fee for a standard passenger vehicle.'
    },
    {
      question: 'Why do vehicle sales taxes and fees differ so dramatically across states?',
      answer:
        'Vehicle taxation is governed entirely by individual state statutes and legislative revenue policies. Several states levy 0% statewide tax on private sales (or have no sales tax at all), while others levy sales tax rates over 7%. Furthermore, states fund their transportation and motor vehicle departments through different mechanisms—some rely on higher percentage sales taxes with low flat registration fees, while others charge higher annual tag or titling fees.'
    },
    {
      question: 'Do local, county, or municipal taxes apply to private-party vehicle sales?',
      answer:
        'In several states (such as Colorado, California, Nebraska, and Kansas), local counties, cities, or special transportation districts may impose additional local sales or use taxes on top of the state-level statutory rate. The figures in this comparison dataset represent statewide statutory baseline rates and fees.'
    },
    {
      question: 'What makes private-party vehicle sales different from dealership purchases?',
      answer:
        'Dealership sales often include dealer documentation fees (doc fees), trade-in sales tax credits, and manufacturer incentives that alter the final tax base. Furthermore, several states (such as Arizona, Nevada, and Hawaii) exempt occasional private-party vehicle sales from state sales tax entirely, while subjecting dealership retail sales to standard transaction privilege or general excise tax.'
    },
    {
      question: 'Can I register my vehicle in a 0% tax state to avoid paying sales tax?',
      answer:
        'No. Vehicle sales and use taxes are legally due in the owner’s state of legal residence where the vehicle will be principally garaged and operated. Registering a vehicle out-of-state in a jurisdiction where you do not reside or maintain a bona fide legal entity to evade sales tax is illegal in all 50 states and subject to severe civil and criminal tax penalties.'
    },
    {
      question: 'Is this comparison official tax or legal advice?',
      answer:
        'No. CarTaxHub provides objective computational estimates derived from statutory codes, published department of revenue guidelines, and official DMV fee schedules. Actual fees may vary based on exact vehicle curb weight, county of residence, municipal transit surcharges, and date of transfer. Always verify your final titling total with your local county clerk or state motor vehicle authority.'
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="min-h-screen bg-slate-50/50 py-10 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Home
                </Link>
              </li>
              <li>›</li>
              <li>
                <Link href="/calculator" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Calculators
                </Link>
              </li>
              <li>›</li>
              <li className="text-slate-800 dark:text-slate-200">
                Vehicle Tax by State
              </li>
            </ol>
          </nav>

          {/* Section 1: Intro */}
          <header className="border-b border-slate-200/80 pb-8 dark:border-slate-800">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              <span>{`Last verified: ${lastVerifiedDate} • All 50 States + DC`}</span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
              Vehicle Sales Tax by State: 2026 Comparison
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
              Comparing private-party vehicle sales tax, DMV title certificate fees, and mandatory license tag registration across all 50 US states and Washington D.C. This benchmark study ranks every jurisdiction by total first-year out-of-pocket costs based on current 2026 statutory rates.
            </p>
          </header>

          {/* Section 2: Key Findings Callouts (3-4 stat cards computed at build time) */}
          <section className="mt-10" aria-labelledby="key-findings-heading">
            <h2 id="key-findings-heading" className="sr-only">
              Key Findings &amp; Summary Statistics
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Card 1: 0% Tax States */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Tax-Exempt Private Sales
                </span>
                <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
                  {stats.zeroTaxCount} States
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Levy 0% statewide tax on private vehicle sales ({stats.zeroTaxStates.map((s) => s.label).join(', ')}). Title/tag fees still apply.
                </p>
              </div>

              {/* Card 2: Highest Tax Rate */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Highest Statutory Rate
                </span>
                <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
                  {stats.highestRateState.rateDisplay}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  <Link
                    href={`/calculator/${stats.highestRateState.slug}`}
                    className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    {stats.highestRateState.label}
                  </Link>{' '}
                  levies the highest baseline rate on private sales ($1,812.50 tax on a $25k purchase).
                </p>
              </div>

              {/* Card 3: Highest Title Fee */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Highest Title Fee
                </span>
                <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
                  {stats.highestTitleFeeState.feeDisplay}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  <Link
                    href={`/calculator/${stats.highestTitleFeeState.slug}`}
                    className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    {stats.highestTitleFeeState.label}
                  </Link>{' '}
                  charges the highest DMV certificate of title fee, followed closely by Maryland ($200.00).
                </p>
              </div>

              {/* Card 4: First-Year Cost Range */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  First-Year Cost Range
                </span>
                <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
                  {stats.cheapestState.totalDisplay} – {stats.mostExpensiveState.totalDisplay}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Cheapest: {stats.cheapestState.label} ({stats.cheapestState.totalDisplay}). Highest: {stats.mostExpensiveState.label} ({stats.mostExpensiveState.totalDisplay}).
                </p>
              </div>
            </div>
          </section>

          {/* Sections 3, 4, 5: Interactive Tables (Server-rendered HTML + client sorting & CSV download) */}
          <div className="mt-14">
            <VehicleTaxComparisonTables
              initialHeroRows={heroRows}
              initialTaxRateRows={taxRateRows}
              initialTitleFeeRows={titleFeeRows}
            />
          </div>

          {/* Section 6: "No Statewide Tax" Callout Section */}
          <section className="mt-16 rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6 sm:p-8 dark:border-emerald-900/60 dark:bg-emerald-950/30">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-xs">
                0%
              </span>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                  States With No Statewide Vehicle Tax on Private Sales
                </h2>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  7 jurisdictions exempt casual or private-party vehicle transactions from state sales tax
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              In most of the United States, transferring a vehicle title incurs state sales or excise tax. However, seven jurisdictions do not levy a statewide tax on casual, private-party sales between individuals:
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stats.zeroTaxStates.map((st) => (
                <Link
                  key={st.slug}
                  href={`/calculator/${st.slug}`}
                  className="flex items-center justify-between rounded-xl border border-emerald-200/80 bg-white px-4 py-3 shadow-xs transition-colors hover:border-emerald-400 hover:bg-emerald-50/40 dark:border-emerald-900/50 dark:bg-slate-900"
                >
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {st.label}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    0.00% Tax • View Fees →
                  </span>
                </Link>
              ))}
            </div>

            <p className="mt-4 text-xs text-slate-600 dark:text-slate-400">
              <strong>Important Note:</strong> While these seven jurisdictions do not levy a state vehicle purchase tax, buyers must still pay mandatory state DMV certificate of title fees and annual license plate tag registration fees upon titling.
            </p>
          </section>

          {/* Section 7: State Grid (All 51 Calculators for Link Equity) */}
          <section className="mt-16" aria-labelledby="all-calculators-grid">
            <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Complete Directory
              </span>
              <h2 id="all-calculators-grid" className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Individual State Car Tax Calculators
              </h2>
              <p className="mt-2 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                Explore dedicated statutory calculators for all 50 states + DC, featuring vehicle age adjustments, weight classes, and local tax rules:
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {heroRows
                .slice()
                .sort((a, b) => a.label.localeCompare(b.label))
                .map((st) => (
                  <Link
                    key={st.slug}
                    href={`/calculator/${st.slug}`}
                    className="group flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                        {st.label}
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {st.rateDisplay}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Title: {formatFee(st.titleFee)}</span>
                      <span className="font-semibold text-indigo-600 group-hover:underline dark:text-indigo-400">
                        Calculate →
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
          </section>

          {/* Section 8: FAQ Section */}
          <section className="mt-16" aria-labelledby="faq-heading">
            <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Statutory Guidance
              </span>
              <h2 id="faq-heading" className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Frequently Asked Questions: Vehicle Tax by State
              </h2>
            </div>

            <div className="mt-8 space-y-6">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900"
                >
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 9: Methodology Section */}
          <section className="mt-16 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900" aria-labelledby="methodology-heading">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Research &amp; Data Standards
              </span>
            </div>
            <h2 id="methodology-heading" className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Comparative Ranking Methodology
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <p>
                To provide an objective, apples-to-apples comparison across disparate state vehicle codes, all rankings and total cost figures in this dataset are modeled using a single standardized vehicle purchasing scenario:
              </p>

              <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  The Standard Vehicle Scenario
                </h3>
                <ul className="mt-2 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2 sm:text-sm text-slate-700 dark:text-slate-300">
                  <li>• <strong>Purchase Price:</strong> $25,000.00 cash transaction</li>
                  <li>• <strong>Vehicle Class:</strong> Standard passenger car (curb weight ≤ 3,700 lbs)</li>
                  <li>• <strong>Registration Term:</strong> 1-year registration cycle</li>
                  <li>• <strong>Financing:</strong> Unfinanced cash purchase ($0.00 lien filing fee)</li>
                  <li>• <strong>Trade-In Credit:</strong> $0.00 (private sales do not involve dealership trade-ins)</li>
                  <li>• <strong>Vehicle Age:</strong> Model year 2015 (exempts 7-year statutory book-value minimums)</li>
                  <li>• <strong>Fuel Type:</strong> Standard gasoline (excludes electric/hybrid battery surcharges)</li>
                </ul>
              </div>

              <p>
                <strong>Statutory Data Sources:</strong> Tax rates, title certificate charges, and annual license tag fees are verified against official state statutes (e.g. California Revenue &amp; Taxation Code, Maryland Transportation Article, Texas Tax Code, and Illinois Form RUT-50) and state department of motor vehicles published fee schedules.
              </p>

              <p>
                <strong>Freshness &amp; Verification:</strong> Data last reviewed and audited in <strong>{lastVerifiedDate}</strong>. When legislative bodies enact fee adjustments or tax modifications, CarTaxHub automatically updates its computational model.
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                <strong>Disclaimer:</strong> This dataset is published for consumer informational and research benchmarking purposes only and does not constitute formal tax, financial, or legal counsel. Actual vehicle titling costs can vary based on exact vehicle curb weight, county and municipal local option taxes, inspection fees, and late titling penalties. Consult your local county title clerk or state DMV prior to completing transactions.
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
