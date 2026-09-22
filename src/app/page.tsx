import { Metadata } from 'next';
import stateRulesData from '@/config/stateRules.json';
import { StateRule, StateRulesConfig } from '@/lib/types';
import { Calculator } from '@/components/Calculator';

const rules = stateRulesData as StateRulesConfig;
const marylandRule = rules.maryland as StateRule;

export const metadata: Metadata = {
  title: 'Maryland Private Party Car Tax Calculator — Excise Tax, Title & Tag Fees (2026)',
  description: 'Calculate your true first-year costs for a private car purchase in Maryland. Accurate calculation for 6.5% MVA excise tax, $200 title fee, 1 or 2-year tag registration, and book-value rules.',
  alternates: {
    canonical: '/calculator/maryland-private-sale-tax-calculator'
  }
};

export default function HomePage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: marylandRule.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Maryland Private Party Vehicle Tax Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    description: 'Online calculator for private party vehicle purchases in Maryland, calculating excise tax, titling fees, and tag registrations.',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />

      <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
        <Calculator initialRule={marylandRule} />
      </main>
    </>
  );
}
