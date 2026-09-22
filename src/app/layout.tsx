import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Private Party Vehicle Tax, Tags & Title Calculator',
  description: 'Fast, accurate first-year vehicle cost estimator for private-party auto sales across US states, starting with Maryland.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white dark:bg-slate-950 dark:text-slate-100">
        {/* Navigation Bar */}
        <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <a href="/calculator/maryland-private-sale-tax-calculator" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-sm dark:bg-indigo-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </span>
              <div>
                <span className="block text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                  AutoTaxCalc<span className="text-indigo-600 dark:text-indigo-400">.us</span>
                </span>
                <span className="block text-[10px] font-medium text-slate-400">
                  Private Party Sales Calculator
                </span>
              </div>
            </a>

            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 sm:inline-flex dark:bg-slate-800 dark:text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>Active: Maryland (MVA 2026)</span>
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1">{children}</div>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p>
              © {new Date().getFullYear()} AutoTaxCalc.us. Estimates only. Not affiliated with or endorsed by the Maryland Motor Vehicle Administration (MVA).
            </p>
            <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
              Statutory reference: Maryland Transportation Article § 13-809 (Excise Tax) &amp; § 13-912 (Registration).
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
