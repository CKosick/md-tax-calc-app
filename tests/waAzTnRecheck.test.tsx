import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn()
}));

import { Calculator } from '../src/components/Calculator';
import { calculateVehicleCosts } from '../src/lib/calculator';
import { getDefaultInputs } from '../src/lib/shareParams';
import stateRulesData from '../src/config/stateRules.json';
import sourceLinkStatus from '../src/config/sourceLinkStatus.json';
import { CalculatorInputs, StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const wa = rules.washington as StateRule;
const az = rules.arizona as StateRule;
const tn = rules.tennessee as StateRule;
const calc = (rule: StateRule, extra: Partial<CalculatorInputs> = {}) =>
  calculateVehicleCosts(rule, { ...getDefaultInputs(rule, 2026), purchasePrice: 15000, ...extra }, 2026);

afterEach(() => cleanup());

describe('Washington re-check', () => {
  it('7.0% state rate plus the 1.1% to 4.2% local range, $39.50 title, $82.75 tabs, $104 new plates', () => {
    const b = calc(wa);
    expect(b.exciseTax).toBe(1050);
    expect(b.localTaxMin).toBe(165);
    expect(b.localTaxMax).toBe(630);
    expect(b.titleFee).toBe(39.5);
    expect(calc(wa, { isFinanced: true }).lienFilingFee).toBe(0);
    expect(b.registrationTotal).toBe(82.75);
    expect(b.newPlateFee).toBe(104);
    expect(b.totalFirstYearCost).toBe(1276.25);
    expect(b.totalFirstYearCostMin).toBe(1441.25);
    expect(b.totalFirstYearCostMax).toBe(1906.25);
    expect(b.itemizedList.map((i) => i.id)).not.toContain('initial-registration-fee');
  });

  it('weight fee by 4,000 lbs, motorcycle plate $22, $10 to transfer a plate, EV $225 and hybrid $75', () => {
    expect(calc(wa, { weightClass: 'over3700lbs' }).registrationTotal).toBe(112.75);
    const moto = calc(wa, { vehicleType: 'motorcycle' });
    expect(moto.registrationTotal).toBe(82.75);
    expect(moto.newPlateFee).toBe(22);
    const transfer = calc(wa, { hasPlateToTransfer: true });
    expect(transfer.newPlateFee).toBe(10);
    expect(transfer.plateTransferred).toBe(true);
    expect(transfer.itemizedList.find((i) => i.id === 'new-plate-fee')?.label).toBe('Plate Transfer Fee');
    expect(calc(wa, { fuelType: 'ev' }).registrationTotal).toBe(307.75);
    expect(calc(wa, { fuelType: 'phev' }).registrationTotal).toBe(157.75);
  });

  it('adds the 8% luxury tax only on the part above $102,000', () => {
    expect(calc(wa, { purchasePrice: 102000 }).exciseTax).toBe(7140);
    const lux = calc(wa, { purchasePrice: 120000 });
    expect(lux.exciseTax).toBe(9840);
    expect(lux.itemizedList[0].description).toContain('8% luxury tax above $102,000 ($1440.00)');
  });

  it('labels the weight split at 4,000 lbs and offers the plate question', () => {
    const { container } = render(<Calculator initialRule={wa} />);
    expect(container.textContent).toContain('4,000 lbs');
    expect(container.textContent).toContain('Do you have a Washington license plate to transfer?');
    expect(container.textContent).toContain('New plates, $104');
  });

  it('copy states the 0.5% motor vehicle tax, the 20% rule, and the 15-day deadline', () => {
    const text = [...wa.notes, ...wa.disclaimers, ...wa.faqs.map((f) => f.answer), wa.localTaxNote].join(' ');
    expect(text).toContain('0.5%');
    expect(text).toContain('20% below');
    expect(text).toContain('$7,500');
    expect(text).toContain('15 days');
    expect(text).toContain('more than 90 days');
  });
});

describe('Arizona re-check', () => {
  it('no sales tax on a casual sale, $4 title, no lien fee', () => {
    const b = calc(az);
    expect(b.exciseTax).toBe(0);
    expect(b.titleFee).toBe(4);
    expect(calc(az, { isFinanced: true }).lienFilingFee).toBe(0);
  });

  it('registration is $8 plus $1.50 air quality plus the VLT from list price and age, $10 minimum', () => {
    expect(calc(az).registrationTotal).toBe(159.84); // 2019 model, $30,000 default list price
    expect(calc(az, { vehicleYear: 2026, listPrice: 45000 }).registrationTotal).toBe(765.5); // 0.6 x 45,000 x 2.80%
    expect(calc(az, { vehicleYear: 2024, listPrice: 30000 }).registrationTotal).toBe(374.37);
    expect(calc(az, { vehicleYear: 2000, listPrice: 8000 }).registrationTotal).toBe(19.5);
    expect(calc(az, { vehicleType: 'motorcycle' }).registrationTotal).toBe(10.5);
  });

  it('copy covers the VLT rates and the 15-day and 30-day rules', () => {
    const text = [...az.notes, ...az.disclaimers, ...az.faqs.map((f) => f.answer)].join(' ');
    for (const fact of ['$2.80', '$2.89', '16.25%', '$10 minimum', '15 days', '30 days', 'casual sale']) expect(text).toContain(fact);
  });
});

describe('Tennessee re-check', () => {
  it('7% state tax plus the $44 single article tax, local 2.00% to 2.75% on the first $1,600', () => {
    const b = calc(tn);
    expect(b.exciseTax).toBe(1094);
    expect(b.localTaxMin).toBe(32);
    expect(b.localTaxMax).toBe(44);
    expect(b.titleFee).toBe(14);
    expect(b.registrationTotal).toBe(26.5);
    expect(b.totalFirstYearCost).toBe(1134.5);
    expect(b.totalFirstYearCostMin).toBe(1166.5);
    expect(b.totalFirstYearCostMax).toBe(1178.5);
    expect(b.itemizedList[0].description).toContain('2.75% single article tax');
  });

  it('single article tax covers only the band from $1,600 to $3,200', () => {
    expect(calc(tn, { purchasePrice: 1500 }).exciseTax).toBe(105);
    expect(calc(tn, { purchasePrice: 2000 }).exciseTax).toBe(151);
    expect(calc(tn, { purchasePrice: 2000 }).localTaxMax).toBe(44);
  });

  it('$11 lien, $19.50 motorcycle, EV $200 and hybrid $100, no trade-in credit', () => {
    expect(calc(tn, { isFinanced: true }).lienFilingFee).toBe(11);
    expect(calc(tn, { vehicleType: 'motorcycle' }).registrationTotal).toBe(19.5);
    expect(calc(tn, { fuelType: 'ev' }).registrationTotal).toBe(226.5);
    expect(calc(tn, { fuelType: 'phev' }).registrationTotal).toBe(126.5);
    expect(calc(tn, { tradeInValue: 5000 }).exciseTax).toBe(1094);
  });

  it('copy covers the family and gift exemptions and the 75% affidavit rule', () => {
    const text = [...tn.notes, ...tn.disclaimers, ...tn.faqs.map((f) => f.answer)].join(' ');
    for (const fact of ['siblings', 'lineal relatives', 'Affidavit of Non-Dealer Transfers', '75%', '$274', '30 days']) expect(text).toContain(fact);
  });
});

describe('Batch 8 source repair', () => {
  it('no hidden links remain for the three states, each has a repaired entry and verified sources', () => {
    for (const key of ['washington', 'arizona', 'tennessee']) {
      expect(sourceLinkStatus.hidden.some((h) => h.state === key)).toBe(false);
      expect(sourceLinkStatus.repaired.some((r) => r.state === key)).toBe(true);
      expect(rules[key].lastVerified).toBe('October 2026');
      expect(rules[key].sources.length).toBeGreaterThanOrEqual(5);
    }
  });

  it('new copy for the three states has no em dashes', () => {
    for (const rule of [wa, az, tn]) {
      const text = JSON.stringify([rule.localTaxNote, rule.notes, rule.disclaimers, rule.faqs]);
      expect(text).not.toContain('—');
    }
  });
});
