import React, { act } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn() }),
  notFound: vi.fn()
}));

const trackMock = vi.fn();
vi.mock('@vercel/analytics', () => ({
  track: (...args: unknown[]) => trackMock(...args)
}));

import { PartnerSlot, trackPartnerClick } from '../src/components/PartnerSlot';
import { Calculator } from '../src/components/Calculator';
import { resolvePartnerHrefs, getSlotHref } from '../src/lib/partnerLinks';
import stateRulesData from '../src/config/stateRules.json';
import partnerSlotsData from '../src/config/partnerSlots.json';
import { StateRule, StateRulesConfig, PartnerSlotConfig } from '../src/lib/types';

const slots = partnerSlotsData as PartnerSlotConfig[];
const mdRule = Object.values(stateRulesData as StateRulesConfig).find(
  (r) => r.label === 'Maryland'
) as StateRule;

const INSURANCE = 'https://partner.example.com/insurance';
const LOANS = 'https://partner.example.com/loans';
const bothHrefs = resolvePartnerHrefs(slots, {
  NEXT_PUBLIC_PARTNER_INSURANCE_URL: INSURANCE,
  NEXT_PUBLIC_PARTNER_LOAN_URL: LOANS
});

beforeEach(() => {
  trackMock.mockReset();
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe('resolvePartnerHrefs (server-side partner URL resolution)', () => {
  it('returns no slots when no env vars are set and config hrefs are "#"', () => {
    expect(resolvePartnerHrefs(slots, {})).toEqual({});
  });

  it('resolves the friendly alias env vars and appends tracking params', () => {
    expect(bothHrefs['insurance-compare']).toContain(INSURANCE);
    expect(bothHrefs['insurance-compare']).toContain('utm_campaign=insurance-compare');
    expect(bothHrefs['auto-loan-rates']).toContain(LOANS);
    expect(bothHrefs['auto-loan-rates']).toContain('utm_medium=affiliate');
  });

  it('resolves per-slot env names built from the slot id', () => {
    const hrefs = resolvePartnerHrefs(slots, {
      NEXT_PUBLIC_PARTNER_INSURANCE_COMPARE_URL: 'https://a.example.com/x',
      NEXT_PUBLIC_AFFILIATE_AUTO_LOAN_RATES_URL: 'https://b.example.com/y'
    });
    expect(hrefs['insurance-compare']).toContain('https://a.example.com/x');
    expect(hrefs['auto-loan-rates']).toContain('https://b.example.com/y');
  });

  it('supports the NEXT_PUBLIC_PARTNER_LINKS JSON bundle and ignores malformed JSON', () => {
    const hrefs = resolvePartnerHrefs(slots, {
      NEXT_PUBLIC_PARTNER_LINKS: JSON.stringify({ 'auto-loan-rates': 'https://bundle.example.com/loan' })
    });
    expect(hrefs['auto-loan-rates']).toContain('https://bundle.example.com/loan');
    expect(hrefs['insurance-compare']).toBeUndefined();

    expect(resolvePartnerHrefs(slots, { NEXT_PUBLIC_PARTNER_LINKS: '{not json' })).toEqual({});
  });

  it('omits placeholder "#" and blank env values', () => {
    const hrefs = resolvePartnerHrefs(slots, {
      NEXT_PUBLIC_PARTNER_INSURANCE_URL: '#',
      NEXT_PUBLIC_PARTNER_LOAN_URL: '   '
    });
    expect(hrefs).toEqual({});
  });

  it('reads process.env by default (server runtime)', () => {
    vi.stubEnv('NEXT_PUBLIC_PARTNER_INSURANCE_URL', INSURANCE);
    expect(resolvePartnerHrefs()['insurance-compare']).toContain(INSURANCE);
    expect(getSlotHref(slots[0])).toBe(INSURANCE);
  });
});

describe('PartnerSlot renders from server-resolved props', () => {
  it('renders the insurance slot from hrefs without reading env in the component', () => {
    render(<PartnerSlot position="below-results" hrefs={bothHrefs} stateSlug={mdRule.slug} />);
    const link = screen.getByRole('link', { name: /compare quotes/i });
    expect(link.getAttribute('href')).toContain(INSURANCE);
    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('stays hidden when no hrefs are resolved, even if env vars are set in this runtime', () => {
    // Simulates the browser: the component must not depend on dynamic process.env lookups
    vi.stubEnv('NEXT_PUBLIC_PARTNER_INSURANCE_URL', INSURANCE);
    const { container } = render(<PartnerSlot position="below-results" />);
    expect(container.innerHTML).toBe('');
  });

  it('respects the NEXT_PUBLIC_ENABLE_MONETIZATION kill switch unless forceShow is set', () => {
    vi.stubEnv('NEXT_PUBLIC_ENABLE_MONETIZATION', 'false');
    const { container } = render(<PartnerSlot position="below-results" hrefs={bothHrefs} />);
    expect(container.innerHTML).toBe('');
    cleanup();
    render(<PartnerSlot position="below-results" hrefs={bothHrefs} forceShow />);
    expect(screen.getByRole('link', { name: /compare quotes/i })).toBeDefined();
  });

  it('hydrates server HTML with no mismatch when env vars are absent in the browser', async () => {
    vi.stubEnv('NEXT_PUBLIC_PARTNER_INSURANCE_URL', INSURANCE);
    const hrefs = resolvePartnerHrefs();
    // Wrapped with a trailing sibling as on the real page; React ignores extra nodes at the very end of a root
    const element = (
      <div>
        <PartnerSlot position="below-results" hrefs={hrefs} stateSlug={mdRule.slug} />
        <footer>after slot</footer>
      </div>
    );
    const html = renderToString(element);
    expect(html).toContain(INSURANCE);

    // Browser bundle: dynamically named NEXT_PUBLIC_* vars are not inlined
    vi.unstubAllEnvs();
    delete process.env.NEXT_PUBLIC_PARTNER_INSURANCE_URL;

    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
    const recoverableErrors: unknown[] = [];
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    let root: ReturnType<typeof hydrateRoot> | undefined;
    await act(async () => {
      root = hydrateRoot(container, element, {
        onRecoverableError: (err) => recoverableErrors.push(err)
      });
    });
    expect(recoverableErrors).toEqual([]);
    expect(consoleError).not.toHaveBeenCalled();
    expect(container.querySelector('a')?.getAttribute('href')).toContain(INSURANCE);
    consoleError.mockRestore();
    act(() => root?.unmount());
    container.remove();
  });
});

describe('Partner click tracking', () => {
  it('emits partner_click with the slot id and state slug on click', () => {
    render(<PartnerSlot position="below-results" hrefs={bothHrefs} stateSlug={mdRule.slug} />);
    const link = screen.getByRole('link', { name: /compare quotes/i });
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(clickEvent);

    expect(trackMock).toHaveBeenCalledWith('partner_click', {
      slot: 'insurance-compare',
      state: mdRule.slug
    });
    // Navigation is not suppressed
    expect(clickEvent.defaultPrevented).toBe(false);
  });

  it('also sends a GA4 event when gtag is loaded', () => {
    const gtag = vi.fn();
    (window as unknown as { gtag: typeof gtag }).gtag = gtag;
    try {
      trackPartnerClick('auto-loan-rates', 'virginia-private-sale-tax-calculator');
      expect(gtag).toHaveBeenCalledWith('event', 'partner_click', {
        slot: 'auto-loan-rates',
        state: 'virginia-private-sale-tax-calculator'
      });
    } finally {
      delete (window as unknown as { gtag?: unknown }).gtag;
    }
  });

  it('never throws when analytics fails', () => {
    trackMock.mockImplementation(() => {
      throw new Error('analytics down');
    });
    expect(() => trackPartnerClick('insurance-compare', mdRule.slug)).not.toThrow();
  });
});

describe('Loan slot only shows when financed', () => {
  it('hides the loan slot when not financed, shows it when financed', () => {
    const { rerender } = render(
      <PartnerSlot position="sidebar" hrefs={bothHrefs} isFinanced={false} />
    );
    expect(screen.queryByRole('link', { name: /check auto loan rates/i })).toBeNull();

    rerender(<PartnerSlot position="sidebar" hrefs={bothHrefs} isFinanced />);
    expect(screen.getByRole('link', { name: /check auto loan rates/i })).toBeDefined();
  });

  it('forceShow overrides the financing gate for previews', () => {
    render(<PartnerSlot position="sidebar" hrefs={bothHrefs} forceShow />);
    expect(screen.getByRole('link', { name: /check auto loan rates/i })).toBeDefined();
  });

  it('in the full calculator: unchecked shows insurance only, checked shows both', () => {
    render(<Calculator initialRule={mdRule} partnerHrefs={bothHrefs} />);
    expect(screen.getByRole('link', { name: /compare quotes/i })).toBeDefined();
    expect(screen.queryByRole('link', { name: /check auto loan rates/i })).toBeNull();

    fireEvent.click(document.getElementById('financed-yes')!);
    expect(screen.getByRole('link', { name: /compare quotes/i })).toBeDefined();
    const loan = screen.getByRole('link', { name: /check auto loan rates/i });
    expect(loan.getAttribute('href')).toContain(LOANS);

    fireEvent.click(loan);
    expect(trackMock).toHaveBeenCalledWith('partner_click', {
      slot: 'auto-loan-rates',
      state: mdRule.slug
    });
  });
});

describe('Affiliate disclosure line on results', () => {
  const DISCLOSURE = "We may earn a commission if you use partner links. It doesn't change your estimate.";
  const loanOnly = resolvePartnerHrefs(slots, { NEXT_PUBLIC_PARTNER_LOAN_URL: LOANS });

  it('shows exactly once when partner offers are visible', () => {
    render(<Calculator initialRule={mdRule} partnerHrefs={bothHrefs} />);
    expect(screen.getAllByText(DISCLOSURE)).toHaveLength(1);
    // Cards keep their per-card Sponsored Link label
    expect(screen.getAllByText('Sponsored Link').length).toBeGreaterThan(0);
  });

  it('is hidden when no partner offer is showing', () => {
    render(<Calculator initialRule={mdRule} partnerHrefs={{}} />);
    expect(screen.queryByText(DISCLOSURE)).toBeNull();
  });

  it('follows the financed toggle when the loan offer is the only partner', () => {
    render(<Calculator initialRule={mdRule} partnerHrefs={loanOnly} />);
    expect(screen.queryByText(DISCLOSURE)).toBeNull();
    fireEvent.click(document.getElementById('financed-yes')!);
    expect(screen.getAllByText(DISCLOSURE)).toHaveLength(1);
  });

  it('respects the monetization kill switch', () => {
    vi.stubEnv('NEXT_PUBLIC_ENABLE_MONETIZATION', 'false');
    render(<Calculator initialRule={mdRule} partnerHrefs={bothHrefs} />);
    expect(screen.queryByText(DISCLOSURE)).toBeNull();
  });
});
