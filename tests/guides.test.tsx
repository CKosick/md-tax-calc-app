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

const GUIDE_STATES = {
  maryland: { label: 'Maryland', agency: 'Maryland MVA', hosts: ['mva.maryland.gov'] },
  virginia: { label: 'Virginia', agency: 'Virginia DMV', hosts: ['www.dmv.virginia.gov', 'law.lis.virginia.gov'] },
  pennsylvania: { label: 'Pennsylvania', agency: 'PennDOT', hosts: ['www.pa.gov'] },
  texas: { label: 'Texas', agency: 'TxDMV and Texas Comptroller', hosts: ['www.txdmv.gov', 'comptroller.texas.gov'] },
  california: { label: 'California', agency: 'California DMV and CDTFA', hosts: ['www.dmv.ca.gov', 'cdtfa.ca.gov', 'www.bar.ca.gov'] },
  florida: { label: 'Florida', agency: 'FLHSMV and Florida DOR', hosts: ['www.flhsmv.gov', 'floridarevenue.com'] },
  'new-york': { label: 'New York', agency: 'NYS DMV and NYS Tax Department', hosts: ['dmv.ny.gov', 'www.tax.ny.gov'] },
  illinois: { label: 'Illinois', agency: 'Illinois SOS and IDOR', hosts: ['tax.illinois.gov', 'www.ilsos.gov'] },
  ohio: { label: 'Ohio', agency: 'Ohio BMV and Ohio Department of Taxation', hosts: ['tax.ohio.gov', 'bmv.ohio.gov', 'www.bmv.ohio.gov', 'codes.ohio.gov'] },
  michigan: { label: 'Michigan', agency: 'Michigan Secretary of State', hosts: ['www.michigan.gov', 'www.legislature.mi.gov'] },
  minnesota: { label: 'Minnesota', agency: 'Minnesota DVS and Minnesota Revenue', hosts: ['www.revenue.state.mn.us', 'dps.mn.gov'] },
  oklahoma: { label: 'Oklahoma', agency: 'Service Oklahoma', hosts: ['oklahoma.gov'] }
} as const;
const topics = (state: string) => [
  `how-to-title-a-private-car-sale-in-${state}`,
  `how-to-gift-a-car-in-${state}`,
  `titling-a-car-in-${state}-after-moving-from-another-state`
];

describe('Guide content (batches 1 and 2: Maryland, Virginia, Pennsylvania)', () => {
  it('has the same three guides for each state, with unique slugs', () => {
    expect(GUIDES.map((g) => g.slug)).toEqual(Object.keys(GUIDE_STATES).flatMap(topics));
    for (const state of Object.keys(GUIDE_STATES)) {
      expect(getGuidesForState(state).map((g) => g.slug)).toEqual(topics(state));
    }
  });

  it('each guide is complete, dated, sourced from its state agency, and has short titles', () => {
    for (const guide of GUIDES) {
      const state = GUIDE_STATES[guide.stateKey as keyof typeof GUIDE_STATES];
      expect(guide.lastVerified).toBe('October 2026');
      expect(guide.agency).toBe(state.agency);
      expect(guide.steps.length).toBeGreaterThanOrEqual(5);
      expect(guide.checklist.length).toBeGreaterThanOrEqual(5);
      expect(guide.faqs.length).toBeGreaterThanOrEqual(3);
      expect(guide.sources.length).toBeGreaterThan(0);
      for (const source of guide.sources) expect(state.hosts).toContain(new URL(source.url).hostname);
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

  it('keeps the verified Virginia and Pennsylvania key facts', () => {
    const text = (slug: string) => allStrings(GUIDES.find((g) => g.slug === slug)).join(' ');
    const [vaSale, vaGift, vaMove] = topics('virginia').map(text);
    for (const fact of ['4.15%', '$75', '$15 title fee', '30 days', 'SUT-1A', '$1,500', '4,000 lbs', '$30.75', '$35.75']) expect(vaSale).toContain(fact);
    for (const fact of ['SUT 3', 'biological and adopted', 'Stepchildren', 'NADA trade-in value', '$75 minimum']) expect(vaGift).toContain(fact);
    for (const fact of ['30 days', 'VSA 17A', 'last 12 months', '$600', '$145', 'Manassas Park']) expect(vaMove).toContain(fact);

    const [paSale, paGift, paMove] = topics('pennsylvania').map(text);
    for (const fact of ['notarized', '6%', '7%', '8%', '($72)', '($36 per lien)', '$48', '90 days', '20 days', '10 days', 'MV-3']) expect(paSale).toContain(fact);
    for (const fact of ['MV-13ST', 'without consideration', 'forgiveness', 'reciprocal', 'fair market value']) expect(paGift).toContain(fact);
    for (const fact of ['20 days', 'six months', 'MV-1', 'VIN', '10 days', 'Harrisburg']) expect(paMove).toContain(fact);
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
    const state = GUIDE_STATES[guide.stateKey as keyof typeof GUIDE_STATES];
    expect(container.textContent).not.toContain(`Frequently Asked Questions: ${state.label} Vehicle Taxes`);

    expect(container.querySelector('#guide-last-verified')?.textContent).toBe(
      `Last verified: October 2026 against ${state.agency} sources`
    );
    expect(container.querySelectorAll('ol > li')).toHaveLength(guide.steps.length);
    expect(screen.getByRole('heading', { name: 'What to bring' })).toBeDefined();

    // Embedded calculator
    expect(container.querySelector('#purchase-price-input')).not.toBeNull();
    expect(container.querySelector('#calculator-results')).not.toBeNull();

    // FAQ structured data matches the guide FAQs
    const ld = [...container.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent || '{}'));
    expect(ld.map((x) => x['@type'])).toEqual(['BreadcrumbList', 'FAQPage']);
    expect(ld[1].mainEntity.map((q: { name: string }) => q.name)).toEqual(guide.faqs.map((f) => f.question));

    // Links to the state's other two guides and its calculator, not other states' guides
    const hrefs = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    for (const other of getGuidesForState(guide.stateKey).filter((g) => g.slug !== slug)) {
      expect(hrefs).toContain(`/guides/${other.slug}`);
    }
    for (const foreign of GUIDES.filter((g) => g.stateKey !== guide.stateKey)) {
      expect(hrefs).not.toContain(`/guides/${foreign.slug}`);
    }
    expect(hrefs).toContain(`/calculator/${guide.stateKey}-private-sale-tax-calculator`);
  });

  it('the Pennsylvania guide calculator shows the 6% to 8% sales tax range', async () => {
    const { container } = await renderGuide('how-to-title-a-private-car-sale-in-pennsylvania');
    // $15,000 at 6% to 8% = $900 to $1,200 tax, plus $72 title and $96 two-year registration
    expect(container.querySelector('#calculator-results')?.textContent).toContain('$1,068.00 – $1,368.00');
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

describe('Batch 4 guides (New York, Illinois, Ohio)', () => {
  const text = (slug: string) => allStrings(GUIDES.find((g) => g.slug === slug)).join(' ');
  it('keeps the verified New York, Illinois, and Ohio key facts', () => {
    const [nySale, nyGift, nyMove] = topics('new-york').map(text);
    for (const fact of ['DTF-802', 'MV-82', '7% to 8.875%', '$50', '$56.50', '$25 for plates', '10 days', '180 days']) expect(nySale).toContain(fact);
    for (const fact of ['$0', 'section 6', 'stepparent', 'stepchild']) expect(nyGift).toContain(fact);
    for (const fact of ['30 days', 'DTF-803', 'DTF-804', 'Photocopies are not accepted']) expect(nyMove).toContain(fact);

    const [ilSale, ilGift, ilMove] = topics('illinois').map(text);
    for (const fact of ['RUT-50', '$465', '$850', '$10,100', 'flat $25', '30 days', '$165', '$151', 'VSD-190', 'Cook County']) expect(ilSale).toContain(fact);
    for (const fact of ['$15', 'civil union partner', 'fair market value', 'adopted']) expect(ilGift).toContain(fact);
    for (const fact of ['30 days', '3 months', 'RUT-25', '$41']) expect(ilMove).toContain(fact);

    const [ohSale, ohGift, ohMove] = topics('ohio').map(text);
    for (const fact of ['notarized', '30 days', '$5', '6.50% to 8.25%', '$18', '$23', '$36', '$8 deputy registrar fee', 'E-Check']) expect(ohSale).toContain(fact);
    for (const fact of ['exemption certificate', 'probate', 'transfer-on-death', 'divorce decree']) expect(ohGift).toContain(fact);
    for (const fact of ['30 days', 'VIN inspection', 'six months', 'clerk of courts']) expect(ohMove).toContain(fact);
  });
});

describe('Batch 5 guides (Michigan, Minnesota, Oklahoma)', () => {
  const text = (slug: string) => allStrings(GUIDES.find((g) => g.slug === slug)).join(' ');
  it('keeps the verified Michigan, Minnesota, and Oklahoma key facts', () => {
    const [miSale, miGift, miMove] = topics('michigan').map(text);
    for (const fact of ['15 days', '$15 late fee', '6%', 'fair market value', '$178', 'No-Fault', 'seller keeps the plate']) expect(miSale).toContain(fact);
    for (const fact of ['half-siblings', 'legal guardian', 'Cousins', '175%']) expect(miGift).toContain(fact);
    for (const fact of ['no grace period', 'appointment-of-agent', 'Registration Only', '90 days']) expect(miMove).toContain(fact);

    const [mnSale, mnGift, mnMove] = topics('minnesota').map(text);
    for (const fact of ['6.875%', '10 days', '20 calendar days', '$36', '$8.25', '$3.50', '$10 tax', 'assigned to you']) expect(mnSale).toContain(fact);
    for (const fact of ['grandparents and a grandchild', 'No affidavit is required', 'fair market value', 'revocable trust']) expect(mnGift).toContain(fact);
    for (const fact of ['60 days', 'COPY', '1.575%', '$30']) expect(mnMove).toContain(fact);

    const [okSale, okGift, okMove] = topics('oklahoma').map(text);
    for (const fact of ['notarized', 'Form 718', 'Form 722-1', '2 months', '$20 on the first $1,500', '1.25%', '$29.50', '$96']) expect(okSale).toContain(fact);
    for (const fact of ['Form 794', 'stepparent', 'siblings', 'divorce decree']) expect(okGift).toContain(fact);
    for (const fact of ['Form 701-6', 'N Classen', '$4', 'lienholder']) expect(okMove).toContain(fact);
  });
});

describe('Guide links and discovery', () => {
  it('each guide state’s calculator page links to its own three guides; other states show no guides block', async () => {
    for (const [state, { label }] of Object.entries(GUIDE_STATES)) {
      const page = render(await CalculatorSlugPage({ params: Promise.resolve({ slug: `${state}-private-sale-tax-calculator` }) }));
      const block = page.container.querySelector('#state-guides');
      expect(block?.textContent).toContain(`${label} Guides`);
      const hrefs = [...(block?.querySelectorAll('a') ?? [])].map((a) => a.getAttribute('href'));
      expect(hrefs.filter((h) => h?.startsWith('/guides/'))).toEqual(topics(state).map((s) => `/guides/${s}`));
      cleanup();
    }

    const mi = render(await CalculatorSlugPage({ params: Promise.resolve({ slug: 'louisiana-private-sale-tax-calculator' }) }));
    expect(mi.container.querySelector('#state-guides')).toBeNull();
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

describe('Guides index metadata', () => {
  it('names every state that has guides, generated from the guides data', async () => {
    const { metadata } = await import('../src/app/guides/page');
    const states = [...new Set(GUIDES.map((g) => g.stateKey))].map((k) => Object.keys(GUIDE_STATES).includes(k) && GUIDE_STATES[k as keyof typeof GUIDE_STATES].label);
    for (const label of states) expect(String(metadata.description)).toContain(String(label));
    expect(String(metadata.description)).toContain('Ohio, Michigan, Minnesota, and Oklahoma.');
  });
});
