import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import stateRulesData from '@/config/stateRules.json';
import { StateRule, StateRulesConfig } from '@/lib/types';
import { formatFee } from '@/lib/formatters';
import { Calculator } from '@/components/Calculator';

const rules = stateRulesData as StateRulesConfig;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

function getRuleBySlug(slug: string): StateRule | undefined {
  return Object.values(rules).find((r) => r.slug === slug);
}

export async function generateStaticParams() {
  return Object.values(rules).map((rule) => ({
    slug: rule.slug
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const rule = getRuleBySlug(slug);

  if (!rule) {
    return {
      title: 'State Vehicle Tax Calculator Not Found',
      description: 'The requested state vehicle tax calculator could not be found.'
    };
  }

  // Concise title (<= 60 chars with "| CarTaxHub" template)
  const title = `${rule.label} Car Tax Calculator (2026)`;
  const rateFormatted = Number((rule.exciseTaxRate * 100).toFixed(2));
  const taxName = rule.label === 'Delaware' ? 'document fee' : rule.label === 'Virginia' ? 'SUT' : 'sales/use tax';
  const taxDetail = rule.flatTaxTable ? 'Form RUT-50 statutory tax tables' : `${rateFormatted}% ${taxName}`;
  const description = `Calculate your true first-year costs for a private car purchase in ${rule.label}. Accurate calculation for ${taxDetail}, ${formatFee(rule.titleFee)} title fee, 1 or 2-year tag registration, and book-value rules.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/calculator/${slug}`
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/calculator/${slug}`
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  };
}

export default async function CalculatorSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const rule = getRuleBySlug(slug);

  if (!rule) {
    notFound();
  }

  // JSON-LD Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://cartaxhub.com/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Calculators',
        item: 'https://cartaxhub.com/calculator'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${rule.label} Car Tax Calculator`,
        item: `https://cartaxhub.com/calculator/${rule.slug}`
      }
    ]
  };

  // JSON-LD FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: rule.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  // WebApplication Structured Data
  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${rule.label} Private Party Car Tax Calculator`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    description: `Online calculator for private party vehicle purchases in ${rule.label}, calculating sales tax, titling fees, and tag registrations.`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };

  return (
    <>
      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />

      <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
        <Calculator initialRule={rule} />
      </main>
    </>
  );
}
