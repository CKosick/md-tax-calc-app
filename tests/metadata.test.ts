import { describe, it, expect, vi } from 'vitest';
import { generateStaticParams, generateMetadata } from '../src/app/calculator/[slug]/page';
import sitemap from '../src/app/sitemap';
import robots from '../src/app/robots';

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

    expect(meta.title).toBe('Maryland Private Party Car Tax Calculator — Excise Tax, Title & Tag Fees (2026)');
    expect(meta.description).toContain('6.5% excise tax');
    expect(meta.description).toContain('$200 title fee');
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
    expect(meta.description).toContain('$35 title fee');
  });

  it('generateMetadata handles Virginia with exact "SUT" tax wording', async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: 'virginia-private-sale-tax-calculator' })
    });

    expect(meta.description).toContain('4.15% SUT');
    expect(meta.description).toContain('$15 title fee');
  });

  it('generateMetadata handles Illinois with Form RUT-50 statutory tax table notice', async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: 'illinois-private-sale-tax-calculator' })
    });

    expect(meta.description).toContain('Form RUT-50 statutory tax tables');
    expect(meta.description).toContain('$165 title fee');
  });

  it('generateMetadata returns fallback not found metadata for invalid slug', async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: 'atlantis-private-sale-tax-calculator' })
    });

    expect(meta.title).toBe('State Vehicle Tax Calculator Not Found');
    expect(meta.description).toBe('The requested state vehicle tax calculator could not be found.');
  });

  it('sitemap generates valid XML sitemap entries for root, hub, and all 51 states', () => {
    const entries = sitemap();

    // 1 root + 1 hub (/calculator) + 51 state pages = 53 total entries
    expect(entries).toHaveLength(53);

    const urls = entries.map((e) => e.url);
    expect(urls.some((u) => u.endsWith('/calculator'))).toBe(true);
    expect(urls.some((u) => u.endsWith('/calculator/maryland-private-sale-tax-calculator'))).toBe(true);
    expect(urls.some((u) => u.endsWith('/calculator/california-private-sale-tax-calculator'))).toBe(true);

    // Verify priorities: root and Maryland get 1.0, others get 0.9
    const rootEntry = entries.find((e) => !e.url.includes('/calculator'));
    expect(rootEntry?.priority).toBe(1.0);

    const mdEntry = entries.find((e) => e.url.endsWith('maryland-private-sale-tax-calculator'));
    expect(mdEntry?.priority).toBe(1.0);

    const vaEntry = entries.find((e) => e.url.endsWith('virginia-private-sale-tax-calculator'));
    expect(vaEntry?.priority).toBe(0.9);
  });

  it('robots generates correct indexing rules and sitemap path', () => {
    const robotsConfig = robots();

    expect(robotsConfig.rules).toBeDefined();
    const rules = Array.isArray(robotsConfig.rules) ? robotsConfig.rules[0] : robotsConfig.rules;
    expect(rules.userAgent).toBe('*');
    expect(rules.allow).toBe('/');
    expect(rules.disallow).toContain('/api/');
    expect(robotsConfig.sitemap).toMatch(/\/sitemap\.xml$/);
  });
});
