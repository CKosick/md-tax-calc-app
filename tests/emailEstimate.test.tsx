import React from 'react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, cleanup, fireEvent, act, waitFor } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn()
}));

import CalculatorSlugPage from '../src/app/calculator/[slug]/page';
import GuidePage from '../src/app/guides/[slug]/page';
import PrivacyPage from '../src/app/privacy/page';
import { POST } from '../src/app/api/email-estimate/route';
import { Calculator } from '../src/components/Calculator';
import { calculateVehicleCosts } from '../src/lib/calculator';
import {
  DEFAULT_FROM,
  buildEstimateFields,
  estimateFromShareParams,
  getResendConfig,
  isEmailEstimateEnabled,
  isValidEmail,
  renderEstimateEmail,
  resetRateLimit
} from '../src/lib/emailEstimate';
import { buildShareSearchParams, getDefaultInputs } from '../src/lib/shareParams';
import stateRulesData from '../src/config/stateRules.json';
import { CalculatorInputs, StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const pa = rules.pennsylvania as StateRule;
const md = rules.maryland as StateRule;
const ENV = { RESEND_API_KEY: 're_test_123', RESEND_SEGMENT_ID: 'seg_test' };
const usd = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const stubResendEnv = () => {
  vi.stubEnv('RESEND_API_KEY', ENV.RESEND_API_KEY);
  vi.stubEnv('RESEND_SEGMENT_ID', ENV.RESEND_SEGMENT_ID);
};
const clearResendEnv = () => {
  vi.stubEnv('RESEND_API_KEY', '');
  vi.stubEnv('RESEND_SEGMENT_ID', '');
  vi.stubEnv('RESEND_AUDIENCE_ID', '');
};

beforeEach(() => resetRateLimit());
afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

const estimate = (rule: StateRule, extra: Partial<CalculatorInputs> = {}) => {
  const inputs = { ...getDefaultInputs(rule, 2026), purchasePrice: 15000, ...extra };
  return { rule, inputs, breakdown: calculateVehicleCosts(rule, inputs, 2026) };
};

describe('Resend configuration gate', () => {
  it('needs an API key and a segment ID; the from address defaults', () => {
    expect(getResendConfig({})).toBeUndefined();
    expect(getResendConfig({ RESEND_API_KEY: 're_x' })).toBeUndefined();
    expect(getResendConfig({ RESEND_SEGMENT_ID: 'seg' })).toBeUndefined();
    expect(getResendConfig({ RESEND_API_KEY: 'not-a-key', RESEND_SEGMENT_ID: 'seg' })).toBeUndefined();
    expect(getResendConfig(ENV)).toEqual({ apiKey: 're_test_123', segmentId: 'seg_test', from: DEFAULT_FROM });
    expect(getResendConfig({ RESEND_API_KEY: 're_x', RESEND_AUDIENCE_ID: 'aud' })?.segmentId).toBe('aud');
    expect(getResendConfig({ ...ENV, RESEND_FROM_EMAIL: 'CarTaxHub <hi@send.cartaxhub.com>' })?.from).toBe('CarTaxHub <hi@send.cartaxhub.com>');
    expect(isEmailEstimateEnabled({})).toBe(false);
    expect(isEmailEstimateEnabled(ENV)).toBe(true);
  });

  it('with Resend unset, the calculator and guide pages show no email block', async () => {
    clearResendEnv();
    const calc = render(await CalculatorSlugPage({ params: Promise.resolve({ slug: 'maryland-private-sale-tax-calculator' }) }));
    expect(calc.container.querySelector('#email-estimate')).toBeNull();
    cleanup();
    const guide = render(await GuidePage({ params: Promise.resolve({ slug: 'how-to-title-a-private-car-sale-in-maryland' }) }));
    expect(guide.container.querySelector('#email-estimate')).toBeNull();
  });

  it('with Resend configured, both pages show the block in the results card and never the key', async () => {
    stubResendEnv();
    const calc = render(await CalculatorSlugPage({ params: Promise.resolve({ slug: 'maryland-private-sale-tax-calculator' }) }));
    expect(calc.container.querySelector('#calculator-results #email-estimate')).not.toBeNull();
    expect(calc.container.innerHTML).not.toContain('re_test_123');
    cleanup();
    const guide = render(await GuidePage({ params: Promise.resolve({ slug: 'how-to-title-a-private-car-sale-in-maryland' }) }));
    expect(guide.container.querySelector('#email-estimate')).not.toBeNull();
  });
});

describe('The emailed estimate carries every field', () => {
  it('a ranged state sends tax and total as min and max, plus state, price, fees, and the share link', () => {
    const e = estimate(pa);
    const f = buildEstimateFields({ ...e, siteUrl: 'https://cartaxhub.com' });
    expect(f).toMatchObject({
      state: 'Pennsylvania',
      state_slug: 'pennsylvania-private-sale-tax-calculator',
      vehicle_price: '$15,000.00',
      tax_min: '$900.00',
      tax_max: '$1,200.00',
      fees_total: usd(e.breakdown.totalFirstYearCost - e.breakdown.exciseTax),
      total_min: usd(e.breakdown.totalFirstYearCostMin!),
      total_max: usd(e.breakdown.totalFirstYearCostMax!)
    });
    expect(f.total).toBeUndefined();
    expect(f.locality).toBeUndefined();
    const link = new URL(f.share_link);
    expect(link.origin + link.pathname).toBe('https://cartaxhub.com/calculator/pennsylvania-private-sale-tax-calculator');
    expect(link.search.slice(1)).toBe(buildShareSearchParams(pa, 15000, e.inputs).toString());
  });

  it('a chosen locality sends one exact tax and total, the locality, and loc= in the link', () => {
    const e = estimate(pa, { localityId: 'philadelphia' });
    const f = buildEstimateFields({ ...e, siteUrl: 'https://cartaxhub.com' });
    expect(f.tax).toBe('$1,200.00');
    expect(f.total).toBe(usd(e.breakdown.totalFirstYearCost));
    expect(f.tax_min).toBeUndefined();
    expect(f.locality).toBe('Philadelphia');
    expect(new URL(f.share_link).searchParams.get('loc')).toBe('philadelphia');
  });

  it('the server rebuilds the same estimate from the share params', () => {
    const e = estimate(pa, { localityId: 'philadelphia', tradeInValue: 2000 });
    const rebuilt = estimateFromShareParams(pa.slug, buildShareSearchParams(pa, 15000, e.inputs).toString(), 2026)!;
    expect(rebuilt.rule.slug).toBe(pa.slug);
    expect(rebuilt.breakdown).toEqual(e.breakdown);
    expect(estimateFromShareParams('nope', 'price=1')).toBeUndefined();
    expect(estimateFromShareParams(pa.slug, 'year=2020')).toBeUndefined();
    expect(estimateFromShareParams(pa.slug, 'x'.repeat(1001))).toBeUndefined();
  });

  it('the email text and HTML list every field and the link, with no em dashes', () => {
    const f = buildEstimateFields({ ...estimate(pa), siteUrl: 'https://cartaxhub.com' });
    const { subject, text, html } = renderEstimateEmail(f);
    expect(subject).toBe('Your Pennsylvania car tax estimate from CarTaxHub');
    for (const v of [f.vehicle_price, f.tax_min, f.tax_max, f.fees_total, f.total_min, f.total_max]) {
      expect(text).toContain(v);
      expect(html).toContain(v);
    }
    expect(text).toContain(f.share_link);
    expect(html).toContain(f.share_link.replace(/&/g, '&amp;'));
    expect(text).toContain('follow-ups about this estimate');
    expect(text + html).not.toContain('—');
  });

  it('validates addresses', () => {
    expect(isValidEmail('a@b.co')).toBe(true);
    for (const bad of ['', 'a@b', 'a b@c.co', 'a@b.co\nBcc: x@y.z', `${'a'.repeat(250)}@b.co`, 5]) {
      expect(isValidEmail(bad)).toBe(false);
    }
  });
});

describe('POST /api/email-estimate', () => {
  const params = buildShareSearchParams(md, 15000, estimate(md).inputs).toString();
  const request = (body: unknown, headers: Record<string, string> = {}) =>
    new Request('https://cartaxhub.com/api/email-estimate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://cartaxhub.com', ...headers },
      body: typeof body === 'string' ? body : JSON.stringify(body)
    });
  const resendOk = () => vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: 'x' }), { status: 200 }));

  it('is unavailable when Resend is not configured', async () => {
    clearResendEnv();
    const fetchMock = resendOk();
    vi.stubGlobal('fetch', fetchMock);
    const res = await POST(request({ email: 'a@b.co', slug: md.slug, params }));
    expect(res.status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends the visitor the recalculated estimate, then adds the address to the segment', async () => {
    stubResendEnv();
    const fetchMock = resendOk();
    vi.stubGlobal('fetch', fetchMock);
    const res = await POST(request({ email: ' buyer@example.com ', slug: md.slug, params }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    const calls = fetchMock.mock.calls.map(([url, init]) => ({ url, init }));
    expect(calls.map((c) => c.url)).toEqual([
      'https://api.resend.com/emails',
      'https://api.resend.com/contacts',
      'https://api.resend.com/contacts/buyer%40example.com/segments/seg_test'
    ]);
    for (const c of calls) expect(c.init.headers.Authorization).toBe('Bearer re_test_123');

    const sent = JSON.parse(calls[0].init.body);
    expect(sent.from).toBe(DEFAULT_FROM);
    expect(sent.to).toEqual(['buyer@example.com']);
    expect(sent.subject).toBe('Your Maryland car tax estimate from CarTaxHub');
    const { breakdown } = estimate(md);
    expect(sent.text).toContain(`Tax: ${usd(breakdown.exciseTax)}`);
    expect(sent.text).toContain(`Estimated total: ${usd(breakdown.totalFirstYearCost)}`);
    expect(sent.text).toContain(`https://cartaxhub.com/calculator/${md.slug}?${params}`);

    const contact = JSON.parse(calls[1].init.body);
    expect(contact).toEqual({ email: 'buyer@example.com' });
  });

  it('still reports success when the email went out but the segment add failed', async () => {
    stubResendEnv();
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async (url: string) =>
        new Response('{}', { status: url.endsWith('/emails') ? 200 : 422 })
      )
    );
    const res = await POST(request({ email: 'a@b.co', slug: md.slug, params }));
    expect(res.status).toBe(200);
    expect(errSpy).toHaveBeenCalled();
    errSpy.mockRestore();
  });

  it('reports a failed send and skips the segment', async () => {
    stubResendEnv();
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 500 }));
    vi.stubGlobal('fetch', fetchMock);
    const res = await POST(request({ email: 'a@b.co', slug: md.slug, params }));
    expect(res.status).toBe(502);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('rejects bad input, other origins, and quietly drops honeypot hits', async () => {
    stubResendEnv();
    const fetchMock = resendOk();
    vi.stubGlobal('fetch', fetchMock);
    expect((await POST(request({ email: 'nope', slug: md.slug, params }))).status).toBe(400);
    expect((await POST(request({ email: 'a@b.co', slug: 'unknown', params }))).status).toBe(400);
    expect((await POST(request({ email: 'a@b.co', slug: md.slug }))).status).toBe(400);
    expect((await POST(request('not json'))).status).toBe(400);
    expect((await POST(request({ email: 'a@b.co', slug: md.slug, params }, { Origin: 'https://evil.example' }))).status).toBe(403);
    const honeypot = await POST(request({ email: 'a@b.co', slug: md.slug, params, _gotcha: 'bot' }));
    expect(honeypot.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('limits repeat sends from one address', async () => {
    stubResendEnv();
    vi.stubGlobal('fetch', resendOk());
    const send = () => POST(request({ email: 'a@b.co', slug: md.slug, params }, { 'x-forwarded-for': '203.0.113.9' }));
    for (let i = 0; i < 5; i++) expect((await send()).status).toBe(200);
    expect((await send()).status).toBe(429);
  });
});

describe('Submitting from the results card', () => {
  const renderWithEmail = () => render(<Calculator initialRule={md} emailEnabled />);

  it('posts the address, slug, and share params to our route and confirms in the card without navigating', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal('fetch', fetchMock);
    const startHref = window.location.href;
    const { container } = renderWithEmail();
    fireEvent.change(container.querySelector('#email-estimate-input')!, { target: { value: 'buyer@example.com' } });
    await act(async () => {
      fireEvent.submit(container.querySelector('#email-estimate form')!);
    });
    await waitFor(() => expect(container.querySelector('#email-estimate-sent')).not.toBeNull());
    expect(container.querySelector('#email-estimate-sent')?.textContent).toContain('buyer@example.com');
    expect(container.querySelector('#email-estimate-input')).toBeNull();
    expect(window.location.href).toBe(startHref);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/email-estimate');
    expect(init.method).toBe('POST');
    const body = JSON.parse(init.body);
    expect(body).toEqual({
      email: 'buyer@example.com',
      slug: md.slug,
      params: buildShareSearchParams(md, 15000, getDefaultInputs(md, new Date().getFullYear())).toString()
    });
  });

  it('a failure shows a plain error and keeps the typed address', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => ({ ok: false }) }));
    const { container } = renderWithEmail();
    fireEvent.change(container.querySelector('#email-estimate-input')!, { target: { value: 'buyer@example.com' } });
    await act(async () => {
      fireEvent.submit(container.querySelector('#email-estimate form')!);
    });
    await waitFor(() => expect(container.querySelector('#email-estimate-error')).not.toBeNull());
    expect((container.querySelector('#email-estimate-input') as HTMLInputElement).value).toBe('buyer@example.com');

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    await act(async () => {
      fireEvent.submit(container.querySelector('#email-estimate form')!);
    });
    await waitFor(() => expect(container.querySelector('#email-estimate-error')).not.toBeNull());
  });

  it('includes a hidden honeypot and the follow-ups-only microcopy', () => {
    const { container } = renderWithEmail();
    const honeypot = container.querySelector('input[name="_gotcha"]') as HTMLInputElement;
    expect(honeypot.className).toContain('hidden');
    expect(honeypot.tabIndex).toBe(-1);
    const text = container.querySelector('#email-estimate')?.textContent ?? '';
    expect(text).toContain('keep your address only for follow-ups about it');
    expect(text).toContain('no marketing unless you sign up for it separately');
    expect(text).not.toContain('—');
  });

  it('server HTML posts the form and keeps Send disabled until hydration, so the address never lands in a URL', async () => {
    const { renderToString } = await import('react-dom/server');
    const { EmailEstimate } = await import('../src/components/EmailEstimate');
    const html = renderToString(<EmailEstimate rule={md} purchasePrice={15000} />);
    expect(html).toMatch(/<form[^>]*method="post"/);
    expect(html).toMatch(/<button[^>]*type="submit"[^>]*disabled=""/);
    const { container } = renderWithEmail();
    expect((container.querySelector('#email-estimate button[type=submit]') as HTMLButtonElement).disabled).toBe(false);
  });

  it('without Resend the card has no email block', () => {
    const { container } = render(<Calculator initialRule={md} />);
    expect(container.querySelector('#email-estimate')).toBeNull();
  });
});

describe('Privacy page names Resend as this feature’s processor', () => {
  it('says what is sent, that the address is kept for estimate follow-ups only, and no marketing without a signup', () => {
    const { container } = render(<PrivacyPage />);
    const section = container.querySelector('#email-estimate-processor')?.textContent ?? '';
    expect(section).toContain('Resend');
    expect(section).not.toContain('Formspree');
    expect(section).toContain('email address you enter');
    expect(section).toContain('only for follow-ups about the estimate you asked for');
    expect(section).toContain('unless you sign up for them separately');
    expect(container.textContent).not.toContain('Formspree');
    expect(container.textContent).toContain('Last Updated: October 2026');
    expect(container.textContent).not.toContain('—');
  });
});
