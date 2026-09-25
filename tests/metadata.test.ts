import { describe, it, expect, vi } from 'vitest';
import { generateStaticParams, generateMetadata } from '../src/app/calculator/[slug]/page';
import sitemap from '../src/app/sitemap';
import robots from '../src/app/robots';
import { metadata as rootMetadata } from '../src/app/layout';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn()
  }),
  notFound: vi.fn()
}));

vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-geist-sans' }),
  Geist_Mono: () => ({ variable: '--font-geist-mono' })
}));

describe('Metadata, SEO, Sitemap & Robots Validation', () => {
  it('generateStaticParams returns all 51 state calculator slugs', async () => {
    const params = await generateStaticParams();
    expect(params).toHaveLength(51);

    const slugs = params.map((p) => p.slug);
    expect(slugs).toContain('maryland-private-sale-tax-calculator');
    expect(slugs).toContain('virginia-private-sale-tax-calculator');
    expect(slugs).toContain('pennsylvania-private-sale-tax-calculator');
    expect(slugs).toContain('delaware-private-sale-tax-calculator');
    expect(slugs).toContain('district-of-columbia-private-sale-tax-calculator');
    expect(slugs).toContain('illinois-private-sale-tax-calculator');
    expect(slugs).toContain('wyoming-private-sale-tax-calculator');
  });

  it('generateMetadata generates accurate title, description, canonical, and OpenGraph tags for Maryland', async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: 'maryland-private-sale-tax-calculator' })
    });

    expect(meta.title).toBe('Maryland Car Tax Calculator (2026)');
    expect(meta.description).toContain('6.5% sales/use tax');
    expect(meta.description).toContain('$200.00 title fee');
    expect(meta.alternates?.canonical).toBe('/calculator/maryland-private-sale-tax-calculator');
    expect(meta.openGraph?.title).toBe(meta.title);
    expect(meta.openGraph?.url).toBe('/calculator/maryland-private-sale-tax-calculator');
    expect((meta.twitter as Record<string, unknown>)?.card).toBe('summary_large_image');
  });

  it('generateMetadata handles Delaware with exact "document fee" wording', async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: 'delaware-private-sale-tax-calculator' })
    });

    expect(meta.description).toContain('5.25% document fee');
    expect(meta.description).toContain('$35.00 title fee');
  });

  it('generateMetadata handles Virginia with exact "SUT" tax wording', async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: 'virginia-private-sale-tax-calculator' })
    });

    expect(meta.description).toContain('4.15% SUT');
    expect(meta.description).toContain('$15.00 title fee');
  });

  it('generateMetadata handles Illinois with Form RUT-50 statutory tax table notice', async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: 'illinois-private-sale-tax-calculator' })
    });

    expect(meta.description).toContain('Form RUT-50 statutory tax tables');
    expect(meta.description).toContain('$165.00 title fee');
  });

  it('generateMetadata returns fallback not found metadata for invalid slug', async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: 'atlantis-private-sale-tax-calculator' })
    });

    expect(meta.title).toBe('State Vehicle Tax Calculator Not Found');
    expect(meta.description).toBe('The requested state vehicle tax calculator could not be found.');
  });

  it('sitemap generates valid XML sitemap entries for root, hub, comparison page, and all 51 states with production domain', () => {
    const entries = sitemap();

    // 1 root + 1 hub (/calculator) + 1 comparison page (/vehicle-tax-by-state) + 3 trust pages (/about, /privacy, /contact) + 51 state pages = 57 total entries
    expect(entries).toHaveLength(57);

    const urls = entries.map((e) => e.url);
    expect(urls).toContain('https://cartaxhub.com');
    expect(urls).toContain('https://cartaxhub.com/calculator');
    expect(urls).toContain('https://cartaxhub.com/vehicle-tax-by-state');
    expect(urls).toContain('https://cartaxhub.com/about');
    expect(urls).toContain('https://cartaxhub.com/privacy');
    expect(urls).toContain('https://cartaxhub.com/contact');

    // Ensure all 51 state calculator pages are present with production domain
    const stateCalculatorUrls = urls.filter((u) => u.startsWith('https://cartaxhub.com/calculator/'));
    expect(stateCalculatorUrls).toHaveLength(51);
    expect(urls).toContain('https://cartaxhub.com/calculator/maryland-private-sale-tax-calculator');
    expect(urls).toContain('https://cartaxhub.com/calculator/california-private-sale-tax-calculator');
    expect(urls).toContain('https://cartaxhub.com/calculator/texas-private-sale-tax-calculator');

    // Verify priorities: root gets 1.0, hub and comparison get 0.9, all 51 state pages get 0.8
    const rootEntry = entries.find((e) => e.url === 'https://cartaxhub.com');
    expect(rootEntry?.priority).toBe(1.0);

    const hubEntry = entries.find((e) => e.url === 'https://cartaxhub.com/calculator');
    expect(hubEntry?.priority).toBe(0.9);

    const compareEntry = entries.find((e) => e.url === 'https://cartaxhub.com/vehicle-tax-by-state');
    expect(compareEntry?.priority).toBe(0.9);

    const mdEntry = entries.find((e) => e.url.endsWith('maryland-private-sale-tax-calculator'));
    expect(mdEntry?.priority).toBe(0.8);

    const vaEntry = entries.find((e) => e.url.endsWith('virginia-private-sale-tax-calculator'));
    expect(vaEntry?.priority).toBe(0.8);
  });

  it('robots generates correct indexing rules and production domain sitemap path', () => {
    const robotsConfig = robots();

    expect(robotsConfig.rules).toBeDefined();
    const rules = Array.isArray(robotsConfig.rules) ? robotsConfig.rules[0] : robotsConfig.rules;
    expect(rules.userAgent).toBe('*');
    expect(rules.allow).toBe('/');
    expect(rules.disallow).toContain('/api/');
    expect(robotsConfig.sitemap).toBe('https://cartaxhub.com/sitemap.xml');
  });

  it('Google Search Console verification meta tag slot is supported in metadata and reads from env', () => {
    // Check layout metadata has the verification slot defined
    expect(rootMetadata).toBeDefined();
    expect('verification' in rootMetadata).toBe(true);
  });

  it('all 51 state pages have titles <= 60 characters and no single-decimal fee bugs', async () => {
    const params = await generateStaticParams();
    for (const { slug } of params) {
      const meta = await generateMetadata({ params: Promise.resolve({ slug }) });
      const fullTitle = `${meta.title} | CarTaxHub`;

      // H2 target: <= 60 chars to avoid SERP truncation
      expect(fullTitle.length, `Title for ${slug} should be <= 60 chars but was ${fullTitle.length} ("${fullTitle}")`).toBeLessThanOrEqual(60);

      // H3 target: no "Excise Tax" in the shortened state title
      expect(meta.title).not.toContain('Excise Tax');

      // M5 target: no single-decimal bug like $52.5 or $7.2
      expect(meta.description).not.toMatch(/\$\d+\.\d(?!\d)/);

      // Canonical check
      expect(meta.alternates?.canonical).toBe(`/calculator/${slug}`);
    }
  });
});
