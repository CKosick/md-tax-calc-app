import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us | CarTaxHub',
  description:
    'Contact CarTaxHub. Get in touch with our team via email for feedback, state tax rate updates, or partnership inquiries.',
  alternates: {
    canonical: '/contact'
  }
};

export default function ContactPage() {
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
            Contact
          </span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
            <span>Direct Communication</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Contact CarTaxHub
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
            Questions, fee schedule updates, or partnership inquiries? We are here to help.
          </p>
        </header>

        {/* Contact Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="p-6 sm:p-10">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Email Support
            </h2>
            <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
              To keep our operating overhead low and ensure direct responses from our development team, CarTaxHub handles all correspondence exclusively via email. We do not provide phone support or require cumbersome contact forms.
            </p>

            <div className="mt-8 rounded-2xl bg-indigo-50/80 p-6 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                Official Contact Email
              </span>
              <div className="mt-2 flex items-center gap-3">
                <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <a
                  href="mailto:contact@cartaxhub.com"
                  className="text-lg sm:text-2xl font-extrabold text-indigo-600 hover:text-indigo-700 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  contact@cartaxhub.com
                </a>
              </div>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Typical response time: within 1 to 2 business days.
              </p>
            </div>

            <div className="mt-8 space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                How We Can Assist You:
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Statutory Fee Corrections:</strong> If your state or county recently updated its vehicle sales tax rate, title fee, or registration weight tiers, let us know with an official state bulletin link.
                </li>
                <li>
                  <strong>Feature Requests:</strong> Suggestions for additional vehicle types, commercial tax schedules, or local county lookup tools.
                </li>
                <li>
                  <strong>Media &amp; Advertising:</strong> Inquiries regarding affiliate partnerships, advertising placements, or editorial syndication.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
