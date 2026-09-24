import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import stateRulesData from '../src/config/stateRules.json';
import { StateRule, StateRulesConfig, CalculatorInputs } from '../src/lib/types';
import { calculateVehicleCosts } from '../src/lib/calculator';
import { CostSummaryCard } from '../src/components/CostSummaryCard';
import RootLayout from '../src/app/layout';
import PrivacyPage from '../src/app/privacy/page';
import AboutPage from '../src/app/about/page';
import ContactPage from '../src/app/contact/page';

const rules = stateRulesData as StateRulesConfig;

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn()
  })
}));

vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-geist-sans' }),
  Geist_Mono: () => ({ variable: '--font-geist-mono' })
}));

const baseInputs: CalculatorInputs = {
  state: 'new-york',
  vehicleType: 'passenger',
  purchasePrice: 15000,
  vehicleYear: 2020,
  weightClass: 'under3700lbs',
  fuelType: 'gasoline',
  registrationTerm: 2,
  isFinanced: false,
  tradeInValue: 0
};

describe('Work Order Acceptance Tests', () => {
  describe('1. Headline totals must reflect local taxes (range display)', () => {
    it('NY, $15,000 purchase price satisfies all criteria', () => {
      const nyRule = rules['new-york'];
      expect(nyRule.localTaxMinRate).toBe(0.03);
      expect(nyRule.localTaxMaxRate).toBe(0.04875);

      const res = calculateVehicleCosts(nyRule, { ...baseInputs, state: 'new-york', purchasePrice: 15000 });

      // State tax shows $600.00
      expect(res.exciseTax).toBe(600.00);

      // Local range shows $450.00–$731.25
      expect(res.localTaxMin).toBe(450.00);
      expect(res.localTaxMax).toBe(731.25);

      // Combined tax range tops out at $1,331.25 ($600 state + $731.25 max local)
      expect(res.combinedTaxMin).toBe(1050.00);
      expect(res.combinedTaxMax).toBe(1331.25);

      // Itemized tax line description format
      const taxItem = res.itemizedList.find(i => i.id === 'excise-tax');
      expect(taxItem).toBeDefined();
      expect(taxItem?.description).toContain('State tax $600.00 + Local tax (varies by county) $450.00–$731.25');

      // Headline total is a range: min $1,168.00 to max $1,449.25 (includes $50 title + $68 2-yr reg)
      expect(res.totalFirstYearCostMin).toBe(1168.00);
      expect(res.totalFirstYearCostMax).toBe(1449.25);
      expect(res.hasLocalTax).toBe(true);

      // Verify CostSummaryCard renders range headline
      const { container } = render(
        <CostSummaryCard
          breakdown={res}
          rule={nyRule}
          purchasePrice={15000}
        />
      );

      const heroText = container.textContent || '';
      expect(heroText).toContain('$1,168.00 – $1,449.25');
      // Tax line shows combined range
      expect(heroText).toContain('$1,050.00 – $1,331.25');
      // Itemized description shows breakdown
      expect(heroText).toContain('State tax $600.00 + Local tax (varies by county) $450.00–$731.25');
    });

    it('Every state with local add-on taxes shows a ranged headline', () => {
      const statesWithLocalAddOn = [
        'new-york',
        'california',
        'ohio',
        'washington',
        'missouri',
        'wisconsin',
        'colorado',
        'alabama',
        'louisiana',
        'utah',
        'arkansas',
        'kansas',
        'nebraska',
        'wyoming'
      ];

      for (const st of statesWithLocalAddOn) {
        const rule = rules[st];
        expect(rule, `State ${st} must exist`).toBeDefined();
        expect(rule.localTaxMinRate, `${st} must have localTaxMinRate`).toBeTypeOf('number');
        expect(rule.localTaxMaxRate, `${st} must have localTaxMaxRate`).toBeTypeOf('number');

        const res = calculateVehicleCosts(rule, { ...baseInputs, state: st, purchasePrice: 20000 });
        expect(res.hasLocalTax, `${st} must have hasLocalTax true`).toBe(true);
        expect(res.totalFirstYearCostMin).toBeDefined();
        expect(res.totalFirstYearCostMax).toBeDefined();
        expect(res.totalFirstYearCostMax).toBeGreaterThan(res.totalFirstYearCostMin!);

        const { container } = render(
          <CostSummaryCard breakdown={res} rule={rule} purchasePrice={20000} />
        );
        const cardText = container.textContent || '';
        expect(cardText).toContain('–'); // Range separator
      }
    });

    it('States without local add-on taxes show a single total exactly as today', () => {
      const statesWithoutLocalAddOn = [
        'maryland',
        'virginia',
        'pennsylvania',
        'delaware',
        'district-of-columbia',
        'texas',
        'florida',
        'north-carolina',
        'michigan',
        'new-jersey'
      ];

      for (const st of statesWithoutLocalAddOn) {
        const rule = rules[st];
        expect(rule.localTaxMinRate).toBeUndefined();
        expect(rule.localTaxMaxRate).toBeUndefined();

        const res = calculateVehicleCosts(rule, { ...baseInputs, state: st, purchasePrice: 15000 });
        expect(res.hasLocalTax).toBe(false);
        expect(res.totalFirstYearCostMin).toBeUndefined();
        expect(res.totalFirstYearCostMax).toBeUndefined();

        const { container } = render(
          <CostSummaryCard breakdown={res} rule={rule} purchasePrice={15000} />
        );
        // The headline must be a single dollar figure, not a range
        const heroSection = container.querySelector('.rounded-2xl.bg-gradient-to-br');
        expect(heroSection).not.toBeNull();
        expect(heroSection?.textContent).not.toContain('–');
      }
    });

    it('Preserves existing county/local note text on state pages', () => {
      expect(rules['new-york'].localTaxNote).toContain('Local county and city sales taxes add between 3.00% and 4.875%');
      expect(rules['california'].localTaxNote).toContain('District and county sales taxes');
      expect(rules['ohio'].localTaxNote).toContain('Ohio counties levy permissive sales taxes');
    });
  });

  describe('2. Maryland registration tiers', () => {
    const mdRule = rules.maryland;

    it('MD calculator, 3,400-lb vehicle, 1-year term: registration line = $120.50', () => {
      // Test via numeric weight
      const resWithWeight = calculateVehicleCosts(mdRule, {
        ...baseInputs,
        state: 'maryland',
        registrationTerm: 1,
        vehicleWeight: 3400
      });
      expect(resWithWeight.baseRegistrationFee).toBe(120.50);
      expect(resWithWeight.registrationTotal).toBe(120.50);

      // Test via explicit under3500lbs weight class
      const resWithTier = calculateVehicleCosts(mdRule, {
        ...baseInputs,
        state: 'maryland',
        registrationTerm: 1,
        weightClass: 'under3500lbs'
      });
      expect(resWithTier.registrationTotal).toBe(120.50);
    });

    it('MD calculator, 3,600-lb vehicle, 1-year term: registration line = $125.50', () => {
      // Test via numeric weight
      const resWithWeight = calculateVehicleCosts(mdRule, {
        ...baseInputs,
        state: 'maryland',
        registrationTerm: 1,
        vehicleWeight: 3600
      });
      expect(resWithWeight.baseRegistrationFee).toBe(125.50);
      expect(resWithWeight.registrationTotal).toBe(125.50);

      // Test via explicit 3501to3700lbs weight class
      const resWithTier = calculateVehicleCosts(mdRule, {
        ...baseInputs,
        state: 'maryland',
        registrationTerm: 1,
        weightClass: '3501to3700lbs'
      });
      expect(resWithTier.registrationTotal).toBe(125.50);
    });

    it('MD calculator, 4,000-lb vehicle, 1-year term: registration line = $191.50', () => {
      // Test via numeric weight
      const resWithWeight = calculateVehicleCosts(mdRule, {
        ...baseInputs,
        state: 'maryland',
        registrationTerm: 1,
        vehicleWeight: 4000
      });
      expect(resWithWeight.baseRegistrationFee).toBe(191.50);
      expect(resWithWeight.registrationTotal).toBe(191.50);

      // Test via explicit over3700lbs weight class
      const resWithTier = calculateVehicleCosts(mdRule, {
        ...baseInputs,
        state: 'maryland',
        registrationTerm: 1,
        weightClass: 'over3700lbs'
      });
      expect(resWithTier.registrationTotal).toBe(191.50);
    });

    it('FAQ text states all three tiers with the 3,500 / 3,700 lb breakpoints', () => {
      const regFaq = mdRule.faqs.find(f => f.question.includes('registration and tag fees'));
      expect(regFaq).toBeDefined();
      const ans = regFaq!.answer;

      expect(ans).toContain('3,500');
      expect(ans).toContain('3,700');
      expect(ans).toContain('$120.50');
      expect(ans).toContain('$125.50');
      expect(ans).toContain('$191.50');
      expect(ans).toContain('EMS surcharge');
      expect(ans).toContain('$40');
      expect(ans).toContain('Class A');
      expect(ans).toContain('Class M');
    });
  });

  describe('3. Privacy, About, Contact pages', () => {
    it('/privacy, /about, /contact render without error and contain no lorem text', () => {
      const { container: privContainer } = render(<PrivacyPage />);
      expect(screen.getByRole('heading', { level: 1, name: /privacy policy/i })).toBeDefined();
      expect(privContainer.textContent?.toLowerCase()).not.toContain('lorem ipsum');

      const { container: aboutContainer } = render(<AboutPage />);
      expect(screen.getByRole('heading', { level: 1, name: /empowering private vehicle buyers/i })).toBeDefined();
      expect(aboutContainer.textContent?.toLowerCase()).not.toContain('lorem ipsum');

      const { container: contactContainer } = render(<ContactPage />);
      expect(screen.getByRole('heading', { level: 1, name: /contact cartaxhub/i })).toBeDefined();
      expect(contactContainer.textContent?.toLowerCase()).not.toContain('lorem ipsum');
    });

    it('Reachable from site-wide footer in RootLayout', () => {
      const { container } = render(
        <RootLayout>
          <div>Page content</div>
        </RootLayout>
      );

      const footer = container.querySelector('footer');
      expect(footer).not.toBeNull();

      const aboutLink = footer?.querySelector('a[href="/about"]');
      const privacyLink = footer?.querySelector('a[href="/privacy"]');
      const contactLink = footer?.querySelector('a[href="/contact"]');

      expect(aboutLink).not.toBeNull();
      expect(privacyLink).not.toBeNull();
      expect(contactLink).not.toBeNull();
    });

    it('Privacy page explicitly mentions Google AdSense/cookies and affiliate commissions (ClearVin, uShip, SmartFinancial)', () => {
      const { container } = render(<PrivacyPage />);
      const text = container.textContent || '';

      expect(text).toContain('Google AdSense');
      expect(text).toContain('cookies');
      expect(text).toContain('ClearVin');
      expect(text).toContain('uShip');
      expect(text).toContain('SmartFinancial');
      expect(text).toContain('contact@cartaxhub.com');
      // Inputs never leave browser
      expect(text).toMatch(/never leave (your|the) browser/i);
    });

    it('About page describes 51 jurisdictions, Cliff Kosick sole proprietorship, and methodology', () => {
      const { container } = render(<AboutPage />);
      const text = container.textContent || '';

      expect(text).toContain('51-jurisdiction');
      expect(text).toContain('Cliff Kosick');
      expect(text).toContain('sole proprietor');
      expect(text).toContain('Statutory');
      expect(text).toContain('Estimates');
    });

    it('Contact page specifies contact@cartaxhub.com email-only contact', () => {
      const { container } = render(<ContactPage />);
      const text = container.textContent || '';

      expect(text).toContain('contact@cartaxhub.com');
      const mailto = container.querySelector('a[href="mailto:contact@cartaxhub.com"]');
      expect(mailto).not.toBeNull();
    });
  });
});
