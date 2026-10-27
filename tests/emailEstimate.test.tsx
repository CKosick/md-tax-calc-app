import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, fireEvent, act, waitFor } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn()
}));

import CalculatorSlugPage from '../src/app/calculator/[slug]/page';
import GuidePage from '../src/app/guides/[slug]/page';
import PrivacyPage from '../src/app/privacy/page';
import { Calculator } from '../src/components/Calculator';
import { calculateVehicleCosts } from '../src/lib/calculator';
import { buildEstimatePayload, formspreeEndpoint, getFormspreeFormId } from '../src/lib/emailEstimate';
import { getDefaultInputs } from '../src/lib/shareParams';
import stateRulesData from '../src/config/stateRules.json';
import { CalculatorInputs, StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const pa = rules.pennsylvania as StateRule;
const md = rules.maryland as StateRule;
const TEST_FORM_ID = 'xtestform';

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

const estimate = (rule: StateRule, extra: Partial<CalculatorInputs> = {}) => {
  const inputs = { ...getDefaultInputs(rule, 2026), purchasePrice: 15000, ...extra };
  return { inputs, breakdown: calculateVehicleCosts(rule, inputs, 2026) };
};

describe('NEXT_PUBLIC_FORMSPREE_FORM_ID contract', () => {
  it('unset, blank, or malformed means no form; a Formspree-style ID is used as is', () => {
    expect(getFormspreeFormId({})).toBeUndefined();
    expect(getFormspreeFormId({ NEXT_PUBLIC_FORMSPREE_FORM_ID: '' })).toBeUndefined();
    expect(getFormspreeFormId({ NEXT_PUBLIC_FORMSPREE_FORM_ID: 'https://formspree.io/f/abc' })).toBeUndefined();
    expect(getFormspreeFormId({ NEXT_PUBLIC_FORMSPREE_FORM_ID: ' xyzabcde ' })).toBe('xyzabcde');
    expect(formspreeEndpoint('xyzabcde')).toBe('https://formspree.io/f/xyzabcde');
  });

  it('with the variable unset, the calculator and guide pages show no email block', async () => {
    vi.stubEnv('NEXT_PUBLIC_FORMSPREE_FORM_ID', '');
    const calc = render(await CalculatorSlugPage({ params: Promise.resolve({ slug: 'maryland-private-sale-tax-calculator' }) }));
    expect(calc.container.querySelector('#email-estimate')).toBeNull();
    cleanup();
    const guide = render(await GuidePage({ params: Promise.resolve({ slug: 'how-to-title-a-private-car-sale-in-maryland' }) }));
    expect(guide.container.querySelector('#email-estimate')).toBeNull();
  });

  it('with a form ID set, both pages show the block in the results card', async () => {
    vi.stubEnv('NEXT_PUBLIC_FORMSPREE_FORM_ID', TEST_FORM_ID);
    const calc = render(await CalculatorSlugPage({ params: Promise.resolve({ slug: 'maryland-private-sale-tax-calculator' }) }));
    expect(calc.container.querySelector('#calculator-results #email-estimate')).not.toBeNull();
    expect(calc.container.textContent).toContain('Email me this estimate');
    cleanup();
    const guide = render(await GuidePage({ params: Promise.resolve({ slug: 'how-to-title-a-private-car-sale-in-maryland' }) }));
    expect(guide.container.querySelector('#email-estimate')).not.toBeNull();
  });
});

describe('The estimate payload carries every field', () => {
  it('a ranged state sends tax and total as min and max, plus state, price, fees, and the share link', () => {
    const { inputs, breakdown } = estimate(pa);
    const p = buildEstimatePayload({ email: 'a@b.co', rule: pa, breakdown, purchasePrice: 15000, inputs, pageUrl: 'https://cartaxhub.com/calculator/pennsylvania-private-sale-tax-calculator#x' });
    expect(p).toMatchObject({
      email: 'a@b.co',
      state: 'Pennsylvania',
      state_slug: 'pennsylvania-private-sale-tax-calculator',
      vehicle_price: '$15,000.00',
      tax_min: '$900.00',
      tax_max: '$1,200.00'
    });
    expect(p.total_min).toBeDefined();
    expect(p.total_max).toBeDefined();
    expect(p.total).toBeUndefined();
    expect(p.locality).toBeUndefined();
    expect(p.fees_total).toBe(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(breakdown.totalFirstYearCost - breakdown.exciseTax));
    const link = new URL(p.share_link);
    expect(link.origin + link.pathname).toBe('https://cartaxhub.com/calculator/pennsylvania-private-sale-tax-calculator');
    expect(link.hash).toBe('');
    expect(link.searchParams.get('price')).toBe('15000');
  });

  it('a chosen locality sends one exact tax and total, the locality, and loc= in the link', () => {
    const { inputs, breakdown } = estimate(pa, { localityId: 'philadelphia' });
    const p = buildEstimatePayload({ email: 'a@b.co', rule: pa, breakdown, purchasePrice: 15000, inputs, pageUrl: 'https://cartaxhub.com/calculator/pennsylvania-private-sale-tax-calculator' });
    expect(p.tax).toBe('$1,200.00');
    expect(p.total).toBe(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(breakdown.totalFirstYearCost));
    expect(p.tax_min).toBeUndefined();
    expect(p.locality).toBe('Philadelphia');
    expect(new URL(p.share_link).searchParams.get('loc')).toBe('philadelphia');
  });

  it('the payload does not change the estimate itself', () => {
    const { inputs, breakdown } = estimate(md);
    const before = JSON.stringify(breakdown);
    buildEstimatePayload({ email: 'a@b.co', rule: md, breakdown, purchasePrice: 15000, inputs, pageUrl: 'https://cartaxhub.com/x' });
    expect(JSON.stringify(breakdown)).toBe(before);
  });
});

describe('Submitting from the results card', () => {
  const renderWithForm = () => render(<Calculator initialRule={md} emailFormId={TEST_FORM_ID} />);

  it('posts JSON to the Formspree form and shows the in-card confirmation without navigating', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal('fetch', fetchMock);
    const startHref = window.location.href;
    const { container } = renderWithForm();
    fireEvent.change(container.querySelector('#email-estimate-input')!, { target: { value: 'buyer@example.com' } });
    await act(async () => {
      fireEvent.submit(container.querySelector('#email-estimate form')!);
    });
    await waitFor(() => expect(container.querySelector('#email-estimate-sent')).not.toBeNull());
    expect(container.querySelector('#email-estimate-sent')?.textContent).toContain('buyer@example.com');
    expect(container.querySelector('#email-estimate-input')).toBeNull();
    expect(window.location.href).toBe(startHref);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://formspree.io/f/xtestform');
    expect(init.method).toBe('POST');
    expect(init.headers.Accept).toBe('application/json');
    const body = JSON.parse(init.body);
    for (const field of ['email', 'state', 'state_slug', 'vehicle_price', 'tax', 'fees_total', 'total', 'share_link']) {
      expect(body[field], field).toBeTruthy();
    }
    expect(body.email).toBe('buyer@example.com');
    expect(body._gotcha).toBeUndefined();
  });

  it('a failure shows a plain error and keeps the typed address', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => ({ errors: [] }) }));
    const { container } = renderWithForm();
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

  it('includes a hidden Formspree honeypot and single-purpose microcopy', () => {
    const { container } = renderWithForm();
    const honeypot = container.querySelector('input[name="_gotcha"]') as HTMLInputElement;
    expect(honeypot).not.toBeNull();
    expect(honeypot.className).toContain('hidden');
    expect(honeypot.tabIndex).toBe(-1);
    const text = container.querySelector('#email-estimate')?.textContent ?? '';
    expect(text).toContain('use the address for nothing else');
    expect(text).toContain('No newsletter, no marketing');
    expect(text).not.toContain('—');
  });

  it('without a form ID the card has no email block', () => {
    const { container } = render(<Calculator initialRule={md} />);
    expect(container.querySelector('#email-estimate')).toBeNull();
  });
});

describe('Privacy page names Formspree as this feature’s processor', () => {
  it('says what is sent, why, and that it is not used for marketing', () => {
    const { container } = render(<PrivacyPage />);
    const section = container.querySelector('#email-estimate-processor')?.textContent ?? '';
    expect(section).toContain('Formspree');
    expect(section).toContain('email address you enter');
    expect(section).toContain('only to send you the estimate you asked for');
    expect(section).toContain('not used for marketing');
    expect(container.textContent).toContain('Last Updated: October 2026');
    expect(container.textContent).not.toContain('—');
  });
});
