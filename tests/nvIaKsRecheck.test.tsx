import { describe, it, expect } from 'vitest';
import { calculateVehicleCosts } from '../src/lib/calculator';
import { getDefaultInputs } from '../src/lib/shareParams';
import { getVisibleSources, labelForSource } from '../src/lib/sources';
import stateRulesData from '../src/config/stateRules.json';
import sourceLinkStatus from '../src/config/sourceLinkStatus.json';
import { CalculatorInputs, StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const nv = rules.nevada as StateRule;
const ia = rules.iowa as StateRule;
const ks = rules.kansas as StateRule;
const calc = (rule: StateRule, extra: Partial<CalculatorInputs> = {}) =>
  calculateVehicleCosts(rule, { ...getDefaultInputs(rule, 2026), purchasePrice: 15000, ...extra }, 2026);
const copy = (rule: StateRule) =>
  [rule.localTaxNote ?? '', rule.tradeInNote ?? '', ...rule.disclaimers, ...rule.faqs.map((f) => `${f.question} ${f.answer}`)].join(' ');

describe('Nevada re-check (November 2026)', () => {
  it('no sales tax, $28.25 title from NAC 482.907, $33 car and $39 motorcycle registration', () => {
    const b = calc(nv);
    expect(b.exciseTax).toBe(0);
    expect(b.titleFee).toBe(28.25);
    expect(calc(nv, { vehicleType: 'motorcycle' }).registrationTotal).toBe(39);
    expect(copy(nv)).toContain('$8.25 to process the endorsed title, NAC 482.907');
    expect(copy(nv)).toContain('$33 fee plus the $6 motorcycle safety fee (NRS 482.480)');
  });

  it('still adds no EV or plug-in hybrid fee while the written inquiry is open', () => {
    expect(nv.registration.fuelFeesUnverified).toBe(true);
    expect(nv.registration.evSurchargeAnnual).toBeUndefined();
    expect(nv.registration.phevSurchargeAnnual).toBeUndefined();
  });

  it('deadline, gift, and out-of-state answers are the verified ones', () => {
    const text = copy(nv);
    for (const fact of ['up to three days', '$1 online for 30 days', 'within 30 days of becoming a resident', 'NRS 482.385', 'family sales or gifts', 'VIN inspection (Form VP 015)']) expect(text).toContain(fact);
  });

  it('sources: the dead fees link and the tax homepage are gone; NAC and NRS chapters get citations', () => {
    expect(nv.sources).not.toContain('https://dmv.nv.gov/fees.htm');
    expect(nv.sources).not.toContain('https://tax.nv.gov');
    expect(getVisibleSources(nv)).toHaveLength(nv.sources.length);
    expect(labelForSource('https://www.leg.state.nv.us/NAC/NAC-482.html')).toBe('leg.state.nv.us: NAC Chapter 482');
    expect(labelForSource('https://www.leg.state.nv.us/nrs/nrs-371.html')).toBe('leg.state.nv.us: NRS Chapter 371');
    expect(nv.lastVerified).toBe('November 2026');
  });
});

describe('Iowa re-check (November 2026, figures for ruling unchanged)', () => {
  it('keeps the figures that wait on a ruling, and the verified date, as they were', () => {
    expect(ia.exciseTaxRate).toBe(0.05);
    expect(ia.tradeInDeductible).toBe(false);
    expect(calc(ia, { vehicleType: 'motorcycle', vehicleYear: 2015 }).registrationTotal).toBe(20);
    expect(ia.lastVerified).toBe('September 2026');
  });

  it('$35 title, $20 lien, EV $130 and plug-in hybrid $65', () => {
    expect(calc(ia).titleFee).toBe(35);
    expect(calc(ia, { isFinanced: true }).lienFilingFee).toBe(20);
    expect(ia.registration.evSurchargeAnnual).toBe(130);
    expect(ia.registration.phevSurchargeAnnual).toBe(65);
  });

  it('deadline, gift, and out-of-state answers are the verified ones', () => {
    const text = copy(ia);
    for (const fact of ['30 calendar days', 'Iowa Code 321.46', '$10 title penalty', 'Iowa Code 321.49', 'exempt from the fee for new registration', 'pay only the difference']) expect(text).toContain(fact);
  });

  it('sources: the dead DOT link and the treasurers homepage are gone; code links get citations', () => {
    expect(ia.sources).not.toContain('https://iowadot.gov/mvd/buyingselling/registering-a-vehicle');
    expect(ia.sources).not.toContain('https://iowatreasurers.org');
    expect(getVisibleSources(ia)).toHaveLength(ia.sources.length);
    expect(labelForSource('https://www.legis.iowa.gov/docs/code/321.105A.pdf')).toBe('legis.iowa.gov: Iowa Code 321.105A');
    expect(labelForSource('https://www.legis.iowa.gov/docs/code/2026/321.pdf')).toBe('legis.iowa.gov: Iowa Code chapter 321');
  });
});

describe('Kansas re-check (November 2026, surcharges for ruling)', () => {
  it('6.5% state tax plus the 0% to 4.25% local range from the October 2026 rate list', () => {
    const b = calc(ks);
    expect(b.exciseTax).toBe(975);
    expect(b.localTaxMin).toBe(0);
    expect(b.localTaxMax).toBe(637.5);
    expect(copy(ks)).toContain('6.5% to 10.75%');
    expect(copy(ks)).not.toContain('7.5%');
  });

  it('an all-electric car registers for $165 and a plug-in hybrid for $100, in place of the $30 fee', () => {
    expect(calc(ks).registrationTotal).toBe(30);
    expect(calc(ks, { fuelType: 'ev' }).registrationTotal).toBe(165);
    expect(calc(ks, { fuelType: 'phev' }).registrationTotal).toBe(100);
    expect(calc(ks, { vehicleType: 'motorcycle', fuelType: 'ev' }).registrationTotal).toBe(30);
    expect(copy(ks)).toContain('which is the +$135 and +$70 on the form');
  });

  it('$10 title and $1.50 lien service fee; verified date waits on the surcharge ruling', () => {
    expect(calc(ks).titleFee).toBe(10);
    expect(calc(ks, { isFinanced: true }).lienFilingFee).toBe(1.5);
    expect(ks.lastVerified).toBe('September 2026');
  });

  it('deadline, gift, and out-of-state answers are the verified ones', () => {
    const text = copy(ks);
    for (const fact of ['Within 60 days', 'K.S.A. 8-135', '61st day', 'Form TR-215', 'Form TR-12', 'cousins are taxed', 'up to the Kansas amount', 'MVE-1']) expect(text).toContain(fact);
  });

  it('sources: the dead rate link and the homepage are gone; statute links get citations', () => {
    expect(ks.sources).not.toContain('https://www.ksrevenue.gov/prtaxrates.html');
    expect(ks.sources).not.toContain('https://www.ksrevenue.gov/');
    expect(getVisibleSources(ks)).toHaveLength(ks.sources.length);
    expect(labelForSource('https://ksrevisor.gov/statutes/chapters/ch08/008_001_0035.html')).toBe('ksrevisor.gov: K.S.A. 8-135');
  });
});

describe('Source link status after batch 12', () => {
  it('no hidden or homepage-only links remain for the three states, and each has a repair note', () => {
    for (const state of ['nevada', 'iowa', 'kansas']) {
      expect(sourceLinkStatus.hidden.some((h) => h.state === state)).toBe(false);
      expect(sourceLinkStatus.homepageOnly.some((h) => h.state === state)).toBe(false);
      expect(sourceLinkStatus.repaired.some((r) => r.state === state && r.on === '2026-11-13')).toBe(true);
    }
  });
});
