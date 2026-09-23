import { describe, it, expect } from 'vitest';
import stateRulesData from '../src/config/stateRules.json';
import partnerSlotsData from '../src/config/partnerSlots.json';
import { StateRule, PartnerSlotConfig } from '../src/lib/types';

const allRules = stateRulesData as Record<string, StateRule>;

describe('State Rules Schema & Config Validation', () => {
  const midAtlanticStates = [
    'maryland',
    'virginia',
    'pennsylvania',
    'delaware',
    'district-of-columbia'
  ];

  const batch1States = [
    'california',
    'texas',
    'florida',
    'new-york',
    'illinois',
    'ohio',
    'georgia',
    'north-carolina',
    'michigan'
  ];

  const batch2States = [
    'new-jersey',
    'washington',
    'arizona',
    'tennessee',
    'massachusetts',
    'indiana',
    'missouri',
    'wisconsin',
    'colorado'
  ];

  const batch3States = [
    'minnesota',
    'south-carolina',
    'alabama',
    'louisiana',
    'kentucky',
    'oregon',
    'oklahoma',
    'connecticut',
    'utah'
  ];

  const batch4States = [
    'iowa',
    'nevada',
    'arkansas',
    'mississippi',
    'kansas',
    'new-mexico',
    'nebraska',
    'idaho',
    'west-virginia'
  ];

  const batch5States = [
    'hawaii',
    'new-hampshire',
    'maine',
    'montana',
    'rhode-island',
    'south-dakota',
    'north-dakota',
    'alaska',
    'vermont',
    'wyoming'
  ];

  it('contains exactly 51 configured jurisdictions (50 US States + District of Columbia)', () => {
    expect(Object.keys(allRules)).toHaveLength(51);
  });

  it('contains all 5 Mid-Atlantic regional states', () => {
    for (const stateKey of midAtlanticStates) {
      expect(allRules[stateKey]).toBeDefined();
    }
  });

  it('contains all 9 Batch 1 mega-states', () => {
    for (const stateKey of batch1States) {
      const rule = allRules[stateKey];
      expect(rule, `State ${stateKey} should be defined`).toBeDefined();
      expect(rule.slug).toBe(`${stateKey}-private-sale-tax-calculator`);
      expect(typeof rule.titleFee).toBe('number');
      expect(typeof rule.exciseTaxRate).toBe('number');
      expect(Array.isArray(rule.sources)).toBe(true);
      expect(rule.sources.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('contains all 9 Batch 2 high-traffic states', () => {
    for (const stateKey of batch2States) {
      const rule = allRules[stateKey];
      expect(rule, `State ${stateKey} should be defined`).toBeDefined();
      expect(rule.slug).toBe(`${stateKey}-private-sale-tax-calculator`);
      expect(typeof rule.titleFee).toBe('number');
      expect(typeof rule.exciseTaxRate).toBe('number');
      expect(Array.isArray(rule.sources)).toBe(true);
      expect(rule.sources.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('contains all 9 Batch 3 mid-sized states', () => {
    for (const stateKey of batch3States) {
      const rule = allRules[stateKey];
      expect(rule, `State ${stateKey} should be defined`).toBeDefined();
      expect(rule.slug).toBe(`${stateKey}-private-sale-tax-calculator`);
      expect(typeof rule.titleFee).toBe('number');
      expect(typeof rule.exciseTaxRate).toBe('number');
      expect(Array.isArray(rule.sources)).toBe(true);
      expect(rule.sources.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('contains all 9 Batch 4 heartland & mountain states', () => {
    for (const stateKey of batch4States) {
      const rule = allRules[stateKey];
      expect(rule, `State ${stateKey} should be defined`).toBeDefined();
      expect(rule.slug).toBe(`${stateKey}-private-sale-tax-calculator`);
      expect(typeof rule.titleFee).toBe('number');
      expect(typeof rule.exciseTaxRate).toBe('number');
      expect(Array.isArray(rule.sources)).toBe(true);
      expect(rule.sources.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('contains all 10 Batch 5 states', () => {
    for (const stateKey of batch5States) {
      const rule = allRules[stateKey];
      expect(rule, `State ${stateKey} should be defined`).toBeDefined();
      expect(rule.slug).toBe(`${stateKey}-private-sale-tax-calculator`);
      expect(typeof rule.titleFee).toBe('number');
      expect(typeof rule.exciseTaxRate).toBe('number');
      expect(Array.isArray(rule.sources)).toBe(true);
      expect(rule.sources.length).toBeGreaterThanOrEqual(1);
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

  it('validates Illinois Form RUT-50 flatTaxTable configuration', () => {
    const il = allRules.illinois;
    expect(il.flatTaxTable).toBeDefined();
    expect(il.flatTaxTable?.thresholdPrice).toBe(15000);
    expect(il.flatTaxTable?.tableAByAge).toHaveLength(11);
    expect(il.flatTaxTable?.tableBByPrice).toHaveLength(7);

    // Verify first and last brackets of Table A
    expect(il.flatTaxTable?.tableAByAge[0]).toEqual({ maxAge: 1, fee: 465 });
    expect(il.flatTaxTable?.tableAByAge[10]).toEqual({ fee: 100 });

    // Verify key brackets of Table B
    expect(il.flatTaxTable?.tableBByPrice[0]).toEqual({ minPrice: 15000, maxPrice: 19999.99, fee: 850 });
    expect(il.flatTaxTable?.tableBByPrice[6]).toEqual({ minPrice: 1000000, fee: 10100 });
  });

  it('validates statutory caps and luxury tax tier configurations (SC $500 cap, CT 7.75% over $50k)', () => {
    const sc = allRules['south-carolina'];
    expect(sc.maxExciseTax).toBe(500);

    const ct = allRules.connecticut;
    expect(ct.luxuryTaxThreshold).toBe(50000);
    expect(ct.luxuryTaxRate).toBe(0.0775);
    expect(ct.exciseTaxRate).toBe(0.0635);
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
      expect(rule.exciseTaxRate, `Tax rate in ${key} must be between 0 and 12%`).toBeGreaterThanOrEqual(0);
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
      expect(rule.faqs.length, `${key} must have at least 6 faqs`).toBeGreaterThanOrEqual(6);
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
