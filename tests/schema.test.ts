import { describe, it, expect } from 'vitest';
import stateRulesData from '../src/config/stateRules.json';
import partnerSlotsData from '../src/config/partnerSlots.json';
import { StateRule, PartnerSlotConfig } from '../src/lib/types';

describe('State Rules Schema & Config Validation', () => {
  it('validates Maryland stateRules.json schema completeness', () => {
    const md = (stateRulesData as Record<string, StateRule>).maryland;
    expect(md).toBeDefined();
    expect(md.label).toBe('Maryland');
    expect(md.slug).toBe('maryland-private-sale-tax-calculator');
    expect(typeof md.exciseTaxRate).toBe('number');
    expect(md.exciseTaxRate).toBe(0.065);
    expect(md.minExciseTax).toBe(41.60);
    expect(md.titleFee).toBe(200);
    expect(md.lienFilingFee).toBe(40);
    expect(md.tradeInDeductible).toBe(false);
    expect(typeof md.bookValueRule).toBe('string');
    expect(md.bookValueRule.length).toBeGreaterThan(10);
  });

  it('validates registration term and category structure', () => {
    const md = (stateRulesData as Record<string, StateRule>).maryland;
    expect(md.registration.terms).toEqual([1, 2]);

    // Passenger under 3,700 lbs
    const under3700 = md.registration.passenger.under3700lbs as Record<string, number>;
    expect(under3700['1']).toBe(125.50);
    expect(under3700['2']).toBe(251.00);

    // Passenger over 3,700 lbs
    const over3700 = md.registration.passenger.over3700lbs as Record<string, number>;
    expect(over3700['1']).toBe(191.50);
    expect(over3700['2']).toBe(383.00);

    // Motorcycle
    const motorcycle = md.registration.motorcycle as Record<string, number>;
    expect(motorcycle['1']).toBe(105.00);
    expect(motorcycle['2']).toBe(210.00);

    // EV / PHEV surcharges
    expect(md.registration.evSurchargeAnnual).toBe(125);
    expect(md.registration.phevSurchargeAnnual).toBe(100);
  });

  it('validates mandatory disclaimers exist in config', () => {
    const md = (stateRulesData as Record<string, StateRule>).maryland;
    expect(Array.isArray(md.disclaimers)).toBe(true);

    const disclaimersText = md.disclaimers.join(' ');
    expect(disclaimersText).toContain('Estimates only');
    expect(disclaimersText).toContain('book value');
    expect(disclaimersText).toContain('trade-ins');
  });

  it('validates FAQ schema items have question and answer', () => {
    const md = (stateRulesData as Record<string, StateRule>).maryland;
    expect(Array.isArray(md.faqs)).toBe(true);
    expect(md.faqs.length).toBeGreaterThanOrEqual(4);

    for (const faq of md.faqs) {
      expect(typeof faq.question).toBe('string');
      expect(faq.question.length).toBeGreaterThan(10);
      expect(typeof faq.answer).toBe('string');
      expect(faq.answer.length).toBeGreaterThan(20);
    }
  });

  it('validates partnerSlots.json structure and positions', () => {
    const slots = partnerSlotsData as PartnerSlotConfig[];
    expect(slots.length).toBeGreaterThanOrEqual(2);

    const positions = slots.map((s) => s.position);
    expect(positions).toContain('below-results');
    expect(positions).toContain('sidebar');

    for (const slot of slots) {
      expect(typeof slot.id).toBe('string');
      expect(typeof slot.headline).toBe('string');
      expect(typeof slot.description).toBe('string');
      expect(typeof slot.ctaText).toBe('string');
      expect(slot.href).toBe('#');
    }
  });
});
