import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PartnerSlot } from '../src/components/PartnerSlot';
import { Disclaimers } from '../src/components/Disclaimers';
import { CostSummaryCard } from '../src/components/CostSummaryCard';
import { FaqSection } from '../src/components/FaqSection';
import { Calculator } from '../src/components/Calculator';
import CalculatorHubPage from '../src/app/calculator/page';
import HomePage from '../src/app/page';
import CalculatorSlugPage from '../src/app/calculator/[slug]/page';
import stateRulesData from '../src/config/stateRules.json';
import { StateRule, CostBreakdown } from '../src/lib/types';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn()
  })
}));

const mdRule = stateRulesData.maryland as StateRule;

describe('UI Component Unit Tests', () => {
  it('renders PartnerSlot for "below-results" with href="#" and rel="sponsored nofollow"', () => {
    render(<PartnerSlot position="below-results" forceShow={true} />);
    const link = screen.getByRole('link', { name: /compare quotes/i });
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('#');
    expect(link.getAttribute('rel')).toBe('sponsored nofollow');
    expect(screen.getByText(/need insurance for this vehicle\?/i)).toBeDefined();
  });

  it('renders PartnerSlot for "sidebar" with href="#" and rel="sponsored nofollow"', () => {
    render(<PartnerSlot position="sidebar" forceShow={true} />);
    const link = screen.getByRole('link', { name: /check auto loan rates/i });
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('#');
    expect(link.getAttribute('rel')).toBe('sponsored nofollow');
    expect(screen.getByText(/financing this purchase\?/i)).toBeDefined();
  });

  it('renders Disclaimers component with all required notices', () => {
    render(
      <Disclaimers
        disclaimers={mdRule.disclaimers}
        bookValueApplies={true}
        tradeInIgnored={true}
      />
    );

    // 1. Estimates only notice
    expect(screen.getAllByText(/estimates only/i).length).toBeGreaterThan(0);

    // 2. Book value rule notice
    expect(screen.getAllByText(/book value/i).length).toBeGreaterThan(0);

    // 3. Trade-in exemption rule notice
    expect(screen.getAllByText(/trade-in/i).length).toBeGreaterThan(0);
  });

  it('renders CostSummaryCard with hero total and itemized order', () => {
    const mockBreakdown: CostBreakdown = {
      exciseTax: 975.0,
      titleFee: 200.0,
      lienFilingFee: 0.0,
      baseRegistrationFee: 251.0,
      evSurcharge: 0.0,
      registrationTotal: 251.0,
      totalFirstYearCost: 1426.0,
      minTaxApplied: false,
      bookValueApplies: true,
      vehicleAge: 7,
      tradeInDeducted: 0,
      tradeInIgnored: false,
      veipFee: 14,
      taxBase: 'price',
      itemizedList: [
        { id: 'excise-tax', label: 'Vehicle Excise Tax (6.5%)', amount: 975.0 },
        { id: 'title-fee', label: 'Certificate of Title Fee', amount: 200.0 },
        { id: 'lien-filing-fee', label: 'Lien / Security Filing Fee', amount: 0.0 },
        { id: 'registration-fee', label: 'Registration & Tags (2-Year Term)', amount: 251.0 },
        { id: 'total-cost', label: 'Total First-Year Out-of-Pocket Cost', amount: 1426.0, isHero: true }
      ]
    };

    render(
      <CostSummaryCard
        breakdown={mockBreakdown}
        rule={mdRule}
        purchasePrice={15000}
      />
    );

    // Hero Total check
    expect(screen.getByText('$1,426.00')).toBeDefined();

    // Check itemized amounts
    expect(screen.getByText('$975.00')).toBeDefined();
    expect(screen.getByText('$200.00')).toBeDefined();
    expect(screen.getByText('$251.00')).toBeDefined();

    // Check VEIP informational badge
    expect(screen.getByText(/VEIP Vehicle Emissions Inspection/i)).toBeDefined();
  });

  it('renders FaqSection with all long-tail questions and toggles accordion panels on click', () => {
    render(<FaqSection faqs={mdRule.faqs} stateLabel="Maryland" />);

    expect(screen.getByText(/Do I pay sales tax on a private car sale in Maryland\?/i)).toBeDefined();
    expect(screen.getByText(/How much is the Maryland title transfer fee\?/i)).toBeDefined();

    // First item is open by default
    const firstBtn = screen.getByRole('button', { name: /Do I pay sales tax on a private car sale in Maryland\?/i });
    expect(firstBtn.getAttribute('aria-expanded')).toBe('true');

    // Click to collapse
    fireEvent.click(firstBtn);
    expect(firstBtn.getAttribute('aria-expanded')).toBe('false');

    // Second button
    const secondBtn = screen.getByRole('button', { name: /How much is the Maryland title transfer fee\?/i });
    expect(secondBtn.getAttribute('aria-expanded')).toBe('false');

    // Click to expand second button
    fireEvent.click(secondBtn);
    expect(secondBtn.getAttribute('aria-expanded')).toBe('true');
  });

  it('renders null for PartnerSlot when position has no configured slots', () => {
    const { container } = render(<PartnerSlot position={'invalid-pos' as unknown as 'below-results'} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders Delaware Calculator with exact 5.25% document fee copy and never rounds to 5.3%', () => {
    const deRule = (stateRulesData as Record<string, StateRule>).delaware;
    render(<Calculator initialRule={deRule} />);

    expect(screen.getAllByText(/5\.25% document fee/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText(/5\.3%/i)).toBeNull();
  });

  it('renders Illinois Calculator with Form RUT-50 statutory use tax copy', () => {
    const ilRule = (stateRulesData as Record<string, StateRule>).illinois;
    render(<Calculator initialRule={ilRule} />);

    expect(screen.getAllByText(/Form RUT-50/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/\$1,166\.00/i)).toBeDefined(); // $850 tax + $165 title + $151 tags
    expect(screen.getByText(/\$850\.00/i)).toBeDefined();
  });

  it('renders CalculatorHubPage with proper currency formatting and no .00 double-decimal bugs', () => {
    render(<CalculatorHubPage />);

    // Check Florida title fee is $75.25, NOT $75.25.00
    expect(screen.queryByText(/\$75\.25\.00/)).toBeNull();
    expect(screen.getAllByText(/\$75\.25/).length).toBeGreaterThanOrEqual(1);

    // Check North Carolina lien fee is $21.50, NOT $21.5.00
    expect(screen.queryByText(/\$21\.5\.00/)).toBeNull();
    expect(screen.getAllByText(/\$21\.50/).length).toBeGreaterThanOrEqual(1);

    // Check Illinois has Flat Table (RUT-50) badge
    expect(screen.getByText(/Flat Table \(RUT-50\)/i)).toBeDefined();
    expect(screen.getByText(/Form RUT-50 Table/i)).toBeDefined();
  });

  it('renders HomePage with brand H1, state quick-finder, and WebSite/Organization schemas', () => {
    const { container } = render(<HomePage />);

    expect(screen.getByRole('heading', { level: 1, name: /Private Party Car Tax Calculator for All 50 States \+ DC/i })).toBeDefined();
    expect(screen.getByText(/How CarTaxHub Calculates Your First-Year Costs/i)).toBeDefined();
    expect(screen.getByText(/Choose your registration state\.\.\./i)).toBeDefined();

    const jsonLdScripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(jsonLdScripts.length).toBe(3);

    const siteJson = JSON.parse(jsonLdScripts[0].textContent || '{}');
    expect(siteJson['@type']).toBe('WebSite');

    const orgJson = JSON.parse(jsonLdScripts[1].textContent || '{}');
    expect(orgJson['@type']).toBe('Organization');

    const appJson = JSON.parse(jsonLdScripts[2].textContent || '{}');
    expect(appJson['@type']).toBe('WebApplication');
    expect(appJson.name).toContain('CarTaxHub');
  });

  it('renders CalculatorSlugPage for Virginia with JSON-LD schemas', async () => {
    const PageComponent = await CalculatorSlugPage({
      params: Promise.resolve({ slug: 'virginia-private-sale-tax-calculator' })
    });
    const { container } = render(PageComponent);

    expect(screen.getAllByText(/Virginia/i).length).toBeGreaterThan(0);
    const jsonLdScripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(jsonLdScripts.length).toBe(3);

    const breadcrumbJson = JSON.parse(jsonLdScripts[0].textContent || '{}');
    expect(breadcrumbJson['@type']).toBe('BreadcrumbList');

    const faqJson = JSON.parse(jsonLdScripts[1].textContent || '{}');
    expect(faqJson['@type']).toBe('FAQPage');

    const appJson = JSON.parse(jsonLdScripts[2].textContent || '{}');
    expect(appJson['@type']).toBe('WebApplication');
    expect(appJson.name).toContain('Virginia');
  });
});
