import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About CarTaxHub | Private Party Vehicle Tax Estimator',
  description:
    'Learn about CarTaxHub, our mission, methodology, and how our 51-jurisdiction private-party vehicle tax engine helps car buyers avoid surprise DMV fees.',
  alternates: {
    canonical: '/about'
  }
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400"
        >
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Home
          </Link>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="font-semibold text-slate-900 dark:text-white" aria-current="page">
            About
          </span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
            <span>About CarTaxHub</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Empowering Private Vehicle Buyers
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
            Clear, honest first-year tax, title, and registration estimates across all 50 states and Washington, D.C.
          </p>
        </header>

        {/* Main Content Card */}
        <div className="space-y-8 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10 text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              What Is CarTaxHub?
            </h2>
            <p className="text-sm sm:text-base">
              CarTaxHub is an independent, 51-jurisdiction vehicle cost calculator dedicated specifically to private-party automotive sales. Unlike franchised car dealerships that calculate, bundle, and finance taxes and DMV fees automatically at the closing desk, private-party car buyers must handle all title transfers, state sales or excise taxes, lien recording fees, and license plate registrations directly at their state DMV or motor vehicle agency.
            </p>
            <p className="text-sm sm:text-base">
              Because state motor vehicle laws, trade-in credit rules, local county surtaxes, and registration fee schedules differ widely across borders, car buyers frequently face unexpected four-figure bills when transferring titles. CarTaxHub solves this by providing instant, itemized first-year out-of-pocket breakdowns before you make an offer.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Who Runs CarTaxHub?
            </h2>
            <p className="text-sm sm:text-base">
              CarTaxHub is owned, operated, and maintained by <strong>Cliff Kosick</strong>, sole proprietor and software engineer based in Maryland. Frustrated by outdated DMV government websites, convoluted fee formulas, and conflicting forum advice when purchasing used vehicles, Cliff built CarTaxHub to provide car enthusiasts and everyday drivers with an accurate, lightning-fast calculation engine.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Our Methodology &amp; Data Verification
            </h2>
            <p className="text-sm sm:text-base">
              Every jurisdictional rule in CarTaxHub is manually researched and codified directly from official state statutes, Department of Revenue bulletins, and Department of Motor Vehicles (DMV/MVA/BMV/PennDOT/CDTFA) fee schedules.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Statutory Tax Engines
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Accurately tracks statutory rates, statutory floor minimums, statutory caps, tiered luxury brackets, and state-specific flat-tax tables (such as Illinois Form RUT-50).
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Local County Surtaxes &amp; Weight Tiers
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Calculates local county/city sales tax ranges and vehicle weight schedules, including the 2025–2026 Maryland SB 362 Class A &amp; M passenger tiers.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Important Disclaimer: Estimates, Not Tax Advice
            </h2>
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-900/60 dark:bg-amber-950/30 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
              <p>
                <strong>Notice:</strong> All calculations, fee breakdowns, and statutory rate summaries provided on CarTaxHub.com are for informational and estimation purposes only. CarTaxHub is not a law firm, accounting firm, or tax advisory service, and is not affiliated with or endorsed by any state DMV, BMV, MVA, DOT, or Department of Revenue.
              </p>
              <p className="mt-2">
                While we make every effort to maintain verified, up-to-date data, official fees may fluctuate due to localized municipal surcharges, special district levies, or statutory amendments. Always verify your final transaction totals with your official state or county motor vehicle agency prior to purchase.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Get In Touch
            </h2>
            <p className="text-sm sm:text-base">
              Have feedback, noticed a statutory fee revision in your home state, or want to partner with us? We welcome input from drivers and title agents nationwide:{' '}
              <Link href="/contact" className="font-semibold text-indigo-600 underline hover:text-indigo-700 dark:text-indigo-400">
                Contact CarTaxHub
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
