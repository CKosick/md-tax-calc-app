import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  })
}));

vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-geist-sans' }),
  Geist_Mono: () => ({ variable: '--font-geist-mono' })
}));

import { GUIDES, getGuidesForState } from '../src/config/guides';
import GuidePage, { generateMetadata, generateStaticParams } from '../src/app/guides/[slug]/page';
import GuidesIndexPage from '../src/app/guides/page';
import CalculatorSlugPage from '../src/app/calculator/[slug]/page';
import RootLayout from '../src/app/layout';
import sitemap from '../src/app/sitemap';

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

const renderGuide = async (slug: string) => render(await GuidePage({ params: Promise.resolve({ slug }) }));
const allStrings = (value: unknown): string[] =>
  typeof value === 'string'
    ? [value]
    : Array.isArray(value)
      ? value.flatMap(allStrings)
      : value && typeof value === 'object'
        ? Object.values(value).flatMap(allStrings)
        : [];

describe('Guide content (batch 1: Maryland)', () => {
  it('has the three Maryland guides with unique slugs', () => {
    expect(GUIDES.map((g) => g.slug)).toEqual([
      'how-to-title-a-private-car-sale-in-maryland',
      'how-to-gift-a-car-in-maryland',
      'titling-a-car-in-maryland-after-moving-from-another-state'
    ]);
    expect(getGuidesForState('maryland')).toHaveLength(3);
  });

  it('each guide is complete, dated, sourced from MVA pages, and has short titles', () => {
    for (const guide of GUIDES) {
      expect(guide.lastVerified).toBe('October 2026');
      expect(guide.steps.length).toBeGreaterThanOrEqual(5);
      expect(guide.checklist.length).toBeGreaterThanOrEqual(5);
      expect(guide.faqs.length).toBeGreaterThanOrEqual(3);
      expect(guide.sources.length).toBeGreaterThan(0);
      for (const source of guide.sources) expect(source.url.startsWith('https://mva.maryland.gov/')).toBe(true);
      expect(`${guide.metaTitle} | CarTaxHub`.length).toBeLessThanOrEqual(60);
      expect(guide.metaDescription.length).toBeLessThanOrEqual(200);
    }
  });

  it('uses no em dashes anywhere (house style)', () => {
    for (const text of allStrings(GUIDES)) expect(text).not.toContain(String.fromCharCode(0x2014));
  });

  it('keeps the verified key facts', () => {
    const [privateSale, gift, moving] = GUIDES.map((g) => allStrings(g).join(' '));
    for (const fact of ['6.5%', '$640', '$41.60', '$500 below', '90 days', '$200 title fee', '30-day temporary registration ($50)', 'October 1, 2026']) {
      expect(privateSale).toContain(fact);
    }
    for (const fact of ['VR-103', 'VR-299', 'at least 65', 'GIFT', 'parent and child']) expect(gift).toContain(fact);
    for (const fact of ['60 days', '$100', '2.5%', '$41.60', '$7 per day', '$420', 'VEIP']) expect(moving).toContain(fact);
  });
});

describe('Guide pages', () => {
  it('statically generates all guide routes', async () => {
    expect((await generateStaticParams()).map((p) => p.slug)).toEqual(GUIDES.map((g) => g.slug));
  });

  it('metadata is written per guide with a canonical URL', async () => {
    for (const guide of GUIDES) {
      const meta = await generateMetadata({ params: Promise.resolve({ slug: guide.slug }) });
      expect(meta.title).toBe(guide.metaTitle);
      expect(meta.description).toBe(guide.metaDescription);
      expect(meta.alternates?.canonical).toBe(`/guides/${guide.slug}`);
    }
  });

  it.each(GUIDES.map((g) => [g.slug, g] as const))('%s renders the full guide layout', async (slug, guide) => {
    const { container } = await renderGuide(slug);

    // One H1, the guide question; the embedded calculator adds no H1 or calculator FAQ
    const h1s = container.querySelectorAll('h1');
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toBe(guide.title);
    expect(container.textContent).not.toContain('Frequently Asked Questions: Maryland Vehicle Taxes');

    expect(container.querySelector('#guide-last-verified')?.textContent).toContain('Last verified: October 2026');
    expect(container.querySelectorAll('ol > li')).toHaveLength(guide.steps.length);
    expect(screen.getByRole('heading', { name: 'What to bring' })).toBeDefined();

    // Embedded calculator
    expect(container.querySelector('#purchase-price-input')).not.toBeNull();
    expect(container.querySelector('#calculator-results')).not.toBeNull();

    // FAQ structured data matches the guide FAQs
    const ld = [...container.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent || '{}'));
    expect(ld.map((x) => x['@type'])).toEqual(['BreadcrumbList', 'FAQPage']);
    expect(ld[1].mainEntity.map((q: { name: string }) => q.name)).toEqual(guide.faqs.map((f) => f.question));

    // Links to the other two guides and the Maryland calculator
    const hrefs = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    for (const other of GUIDES.filter((g) => g.slug !== slug)) expect(hrefs).toContain(`/guides/${other.slug}`);
    expect(hrefs).toContain('/calculator/maryland-private-sale-tax-calculator');
  });

  it('the embedded calculator calculates and shows partner offers with one disclosure', async () => {
    vi.stubEnv('NEXT_PUBLIC_PARTNER_VIN_CHECK_URL', 'https://epicvin.com?a_aid=oihxljfdeecka');
    const { container } = await renderGuide('how-to-title-a-private-car-sale-in-maryland');
    const results = () => container.querySelector('#calculator-results')?.textContent ?? '';
    expect(results()).toContain('$1,416.00');

    fireEvent.change(container.querySelector('#purchase-price-input')!, { target: { value: '20000' } });
    expect(results()).toContain('$1,300.00'); // 6.5% of $20,000

    expect(screen.getByRole('link', { name: /check the vin/i }).getAttribute('href')).toContain('a_aid=oihxljfdeecka');
    expect(container.querySelectorAll('#partner-disclosure')).toHaveLength(1);
  });

  it('unknown slugs 404', async () => {
    await expect(GuidePage({ params: Promise.resolve({ slug: 'nope' }) })).rejects.toThrow('NEXT_NOT_FOUND');
  });
});

describe('Guide links and discovery', () => {
  it('the Maryland calculator page links to all three guides; other states show no guides block', async () => {
    const md = render(await CalculatorSlugPage({ params: Promise.resolve({ slug: 'maryland-private-sale-tax-calculator' }) }));
    const block = md.container.querySelector('#state-guides');
    expect(block?.textContent).toContain('Maryland Guides');
    const hrefs = [...(block?.querySelectorAll('a') ?? [])].map((a) => a.getAttribute('href'));
    for (const guide of GUIDES) expect(hrefs).toContain(`/guides/${guide.slug}`);
    cleanup();

    const va = render(await CalculatorSlugPage({ params: Promise.resolve({ slug: 'virginia-private-sale-tax-calculator' }) }));
    expect(va.container.querySelector('#state-guides')).toBeNull();
  });

  it('the guides index lists every guide', () => {
    const { container } = render(<GuidesIndexPage />);
    const hrefs = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    for (const guide of GUIDES) expect(hrefs).toContain(`/guides/${guide.slug}`);
  });

  it('the sitemap includes the guides index and every guide', () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain('https://cartaxhub.com/guides');
    for (const guide of GUIDES) expect(urls).toContain(`https://cartaxhub.com/guides/${guide.slug}`);
  });

  it('the site footer links to the guides', () => {
    const { container } = render(
      <RootLayout>
        <div />
      </RootLayout>
    );
    expect(container.querySelector('footer a[href="/guides"]')).not.toBeNull();
  });
});
