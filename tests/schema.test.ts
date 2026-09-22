import { describe, it, expect } from 'vitest';
import stateRulesData from '../src/config/stateRules.json';
import partnerSlotsData from '../src/config/partnerSlots.json';
import { StateRule, PartnerSlotConfig } from '../src/lib/types';

const allRules = stateRulesData as Record<string, StateRule>;

describe('State Rules Schema & Config Validation', () => {
  const expectedStates = [
    'maryland',
    'virginia',
    'pennsylvania',
    'delaware',
    'district-of-columbia'
  ];

  it('contains all 5 Mid-Atlantic regional states', () => {
    for (const stateKey of expectedStates) {
      expect(allRules[stateKey]).toBeDefined();
    }
  });

  it('validates Maryland stateRules.json schema completeness', () => {
    const md = allRules.maryland;
    expect(md.label).toBe('Maryland');
    expect(md.slug).toBe('maryland-private-sale-tax-calculator');
    expect(typeof md.exciseTaxRate).toBe('number');
    expect(md.exciseTaxRate).toBe(0.065);
    expect(md.minExciseTax).toBe(41.60);
    expect(md.titleFee).toBe(200);
    expect(md.lienFilingFee).toBe(40);
    expect(md.tradeInDeductible).toBe(false);
    expect(typeof md.bookValueRule).toBe('string');
  });

  it('validates Virginia, Pennsylvania, Delaware, and DC schema completeness', () => {
    const va = allRules.virginia;
    expect(va.label).toBe('Virginia');
    expect(va.exciseTaxRate).toBe(0.0415);
    expect(va.titleFee).toBe(15);
    expect(va.lienFilingFee).toBe(15);
    expect(va.tradeInDeductible).toBe(false);

    const pa = allRules.pennsylvania;
    expect(pa.label).toBe('Pennsylvania');
    expect(pa.exciseTaxRate).toBe(0.06);
    expect(pa.titleFee).toBe(72); // PennDOT Form MV-70S
    expect(pa.lienFilingFee).toBe(36);
    expect(pa.tradeInDeductible).toBe(false);

    const de = allRules.delaware;
    expect(de.label).toBe('Delaware');
    expect(de.exciseTaxRate).toBe(0.0525);
    expect(de.titleFee).toBe(35);
    expect(de.lienFilingFee).toBe(20);
    expect(de.tradeInDeductible).toBe(true); // Delaware allows trade-in credit

    const dc = allRules['district-of-columbia'];
    expect(dc.label).toBe('District of Columbia');
    expect(dc.exciseTaxRate).toBe(0.05);
    expect(dc.titleFee).toBe(26);
    expect(dc.lienFilingFee).toBe(20);
    expect(dc.taxBase).toBe('fairMarketValue');
  });

  it('validates every state entry contains verified official source URLs', () => {
    for (const [key, rule] of Object.entries(allRules)) {
      expect(Array.isArray(rule.sources), `State ${key} must have sources array`).toBe(true);
      expect(rule.sources.length, `State ${key} must have at least one source URL`).toBeGreaterThanOrEqual(1);

      for (const url of rule.sources) {
        expect(url.startsWith('https://') || url.startsWith('http://')).toBe(true);
      }
    }
  });

  it('validates sane tax rates and non-negative fees across all states', () => {
    for (const [key, rule] of Object.entries(allRules)) {
      expect(rule.exciseTaxRate, `Tax rate in ${key} must be between 0 and 12%`).toBeGreaterThan(0);
      expect(rule.exciseTaxRate, `Tax rate in ${key} must be between 0 and 12%`).toBeLessThanOrEqual(0.12);
      expect(rule.titleFee, `Title fee in ${key} must be >= 0`).toBeGreaterThanOrEqual(0);
      expect(rule.lienFilingFee, `Lien fee in ${key} must be >= 0`).toBeGreaterThanOrEqual(0);
    }
  });

  it('validates every state has statutory disclaimers and FAQs', () => {
    for (const [key, rule] of Object.entries(allRules)) {
      expect(Array.isArray(rule.disclaimers), `${key} must have disclaimers`).toBe(true);
      expect(rule.disclaimers.length, `${key} must have at least 2 disclaimers`).toBeGreaterThanOrEqual(2);

      expect(Array.isArray(rule.faqs), `${key} must have faqs`).toBe(true);
      expect(rule.faqs.length, `${key} must have at least 3 faqs`).toBeGreaterThanOrEqual(3);
    }
  });

  it('validates partnerSlots.json structure, positions, and trackingParams', () => {
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
      if (slot.trackingParams) {
        expect(typeof slot.trackingParams).toBe('object');
        expect(slot.trackingParams.utm_medium).toBe('affiliate');
      }
    }
  });
});
