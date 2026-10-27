import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | CarTaxHub',
  description:
    'Privacy Policy for CarTaxHub. Discloses our browser-only calculator privacy, cookie usage, and affiliate partnerships.',
  alternates: {
    canonical: '/privacy'
  }
};

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
            <span>Transparency &amp; Consumer Privacy</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Last Updated: October 2026
          </p>
        </header>

        {/* Content Body */}
        <div className="space-y-8 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10 text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              1. Calculator Inputs and Data Storage
            </h2>
            <p className="text-sm sm:text-base">
              At CarTaxHub, we believe financial estimators should not require sacrificing personal privacy. All vehicle purchase prices, trade-in valuations, model years, weight classifications, and financing selections entered into our calculators are processed strictly inside your web browser using client-side JavaScript.
            </p>
            <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100">
              Your calculator inputs never leave your browser unless you choose to email yourself an estimate (see section 2). We do not log, sell, or store your private vehicle purchase numbers on our servers or in any external database.
            </p>
          </section>

          <section id="email-estimate-processor" className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              2. Emailing Yourself an Estimate (Resend)
            </h2>
            <p className="text-sm sm:text-base">
              If you use &quot;Email me this estimate&quot; on a calculator, we send the email address you enter and that estimate&apos;s details (the state, vehicle price, tax, fees, total, any locality you chose, and the link back to the estimate) to Resend, the email service that delivers the estimate to you for us.
            </p>
            <p className="text-sm sm:text-base">
              Resend also keeps your address in our contact list there. We use that list only for follow-ups about the estimate you asked for. We do not send you marketing or newsletters unless you sign up for them separately, and we do not share your address with anyone beyond Resend as the processor. Nothing is sent unless you submit the form.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              3. Cookies and Tracking Technologies
            </h2>
            <p className="text-sm sm:text-base">
              CarTaxHub uses standard first-party and third-party cookies, web beacons, and similar tracking technologies to ensure site functionality and understand audience engagement.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base">
              <li>
                <strong>Functional Cookies:</strong> Used to maintain responsive preferences and navigation state while exploring state calculators.
              </li>
              <li>
                <strong>Analytics:</strong> Aggregated, anonymous traffic analytics (Google Analytics, Cloudflare Web Analytics, and Vercel Analytics) to monitor page performance, visitor flow, and popular jurisdictional calculators. Cloudflare Web Analytics is cookieless and does not fingerprint visitors.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              4. Affiliate Relationships &amp; Commercial Disclosures
            </h2>
            <p className="text-sm sm:text-base">
              CarTaxHub is supported in part through affiliate marketing relationships. When you click on outbound recommendation links or promotional banners on our site and make a purchase or request a quote, we may receive a commission or referral fee at zero additional cost to you.
            </p>
            <p className="text-sm sm:text-base">
              Our current affiliate partners include:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
              <li>
                <strong>EpicVIN:</strong> Independent vehicle history reports and VIN checks.
              </li>
            </ul>
            <p className="text-sm sm:text-base">
              We also work with the CJ Affiliate and Impact networks, through which insurance comparison and auto loan partners may appear on calculator pages as those programs are approved.
            </p>
            <p className="text-sm sm:text-base">
              Partner categories may include vehicle history reports, auto insurance comparison, and auto loan marketplaces.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Affiliate partnerships do not influence our calculation formulas, statutory fee tables, or state tax rate algorithms, which remain strictly objective and grounded in state statutes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              5. Children&apos;s Online Privacy Protection
            </h2>
            <p className="text-sm sm:text-base">
              CarTaxHub is directed toward vehicle buyers of legal driving and contracting age. We do not knowingly collect or solicit personal information from individuals under the age of 13.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              6. Privacy Contact Information
            </h2>
            <p className="text-sm sm:text-base">
              If you have any questions or feedback regarding this Privacy Policy, our data handling practices, or cookie disclosures, please contact us by email:
            </p>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                CarTaxHub Privacy Contact
              </p>
              <p className="mt-1 text-sm">
                Email:{' '}
                <a
                  href="mailto:contact@cartaxhub.com"
                  className="font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  contact@cartaxhub.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
