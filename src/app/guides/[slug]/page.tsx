import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import stateRulesData from '@/config/stateRules.json';
import { StateRule, StateRulesConfig } from '@/lib/types';
import { GUIDES, getGuideBySlug, getGuidesForState } from '@/config/guides';
import { Calculator } from '@/components/Calculator';
import { getStateOptions } from '@/lib/stateOptions';
import { isEmailEstimateEnabled } from '@/lib/emailEstimate';
import { FaqSection } from '@/components/FaqSection';
import { resolvePartnerHrefs } from '@/lib/partnerLinks';

const rules = stateRulesData as StateRulesConfig;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) {
    return { title: 'Guide Not Found', description: 'The requested guide could not be found.' };
  }
  const url = `/guides/${guide.slug}`;
  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: guide.metaTitle, description: guide.metaDescription, type: 'article', url },
    twitter: { card: 'summary_large_image', title: guide.metaTitle, description: guide.metaDescription }
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const rule = rules[guide.stateKey] as StateRule;
  const otherGuides = getGuidesForState(guide.stateKey).filter((g) => g.slug !== guide.slug);
  const calculatorHref = `/calculator/${rule.slug}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://cartaxhub.com/' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://cartaxhub.com/guides' },
      { '@type': 'ListItem', position: 3, name: guide.title, item: `https://cartaxhub.com/guides/${guide.slug}` }
    ]
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer }
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main className="min-h-screen bg-slate-50/50 py-10 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <article className="mx-auto max-w-3xl">
            {/* Breadcrumb Navigation */}
            <nav
              aria-label="Breadcrumb"
              className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400"
            >
              <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Home
              </Link>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <Link href="/guides" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Guides
              </Link>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="font-semibold text-slate-900 dark:text-white" aria-current="page">
                {guide.shortTitle}
              </span>
            </nav>

            {/* Header */}
            <header className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
                <span>{rule.label} Guide</span>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                {guide.title}
              </h1>
              <p id="guide-last-verified" className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                Last verified: {guide.lastVerified} against {guide.agency} sources
              </p>
              <div className="mt-4 space-y-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {guide.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </header>

            {/* Steps */}
            <section aria-labelledby="guide-steps" className="space-y-4">
              <h2 id="guide-steps" className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Step by step
              </h2>
              <ol className="space-y-4">
                {guide.steps.map((step, idx) => (
                  <li
                    key={step.title}
                    className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white dark:bg-indigo-500">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{step.title}</h3>
                      <div className="mt-1.5 space-y-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {step.body.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Extra explainer sections (tax rules, exceptions) */}
            {guide.sections?.map((section) => (
              <section
                key={section.heading}
                className="mt-8 rounded-2xl border border-amber-200/80 bg-amber-50/60 p-5 dark:border-amber-900/50 dark:bg-amber-950/20"
              >
                <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">{section.heading}</h2>
                {section.intro && (
                  <p className="mt-1.5 text-sm text-slate-700 dark:text-slate-300">{section.intro}</p>
                )}
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}

            {/* Documents checklist */}
            <section
              aria-labelledby="guide-checklist"
              className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <h2 id="guide-checklist" className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                What to bring
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {guide.checklist.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </article>

          {/* Embedded calculator */}
          <section aria-labelledby="guide-calculator" className="mt-12 border-t border-slate-200 pt-10 dark:border-slate-800">
            <div className="mx-auto mb-6 max-w-3xl lg:mx-0 lg:max-w-none">
              <h2 id="guide-calculator" className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Estimate your {rule.label} costs
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{guide.calculatorNote}</p>
              <Link
                href={calculatorHref}
                className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                <span>Open the full {rule.label} calculator</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
            <Calculator initialRule={{ ...rule, faqs: [] }} partnerHrefs={resolvePartnerHrefs()} embedded allStates={getStateOptions()} emailEnabled={isEmailEstimateEnabled()} />
          </section>

          <div className="mx-auto max-w-3xl">
            {/* FAQ */}
            <FaqSection
              faqs={guide.faqs}
              stateLabel={rule.label}
              heading="Frequently Asked Questions"
              intro={`Common questions about this ${guide.agency} process.`}
            />

            {/* Sources */}
            <section aria-labelledby="guide-sources" className="mt-12">
              <h2 id="guide-sources" className="text-base font-bold text-slate-900 dark:text-white">
                Sources
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Last verified: {guide.lastVerified}. Rules change, so check with {guide.agency} before you go.
              </p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {guide.sources.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700 dark:text-indigo-400"
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            {/* Related guides and calculator */}
            <section aria-labelledby="guide-related" className="mt-12 border-t border-slate-200 pt-10 dark:border-slate-800">
              <h2 id="guide-related" className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                More {rule.label} guides
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {otherGuides.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/guides/${other.slug}`}
                    className="flex min-h-[44px] flex-col rounded-xl border border-slate-200/80 bg-white/70 p-4 transition-all hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
                  >
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{other.title}</span>
                    <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">{other.cardDescription}</span>
                  </Link>
                ))}
              </div>
              <Link
                href={calculatorHref}
                className="mt-6 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                <span>{rule.label} Private Party Car Tax Calculator</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
