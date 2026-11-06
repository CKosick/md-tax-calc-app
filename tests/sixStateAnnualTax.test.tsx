import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn()
}));

import { Calculator } from '../src/components/Calculator';
import { calculateVehicleCosts, listPriceAnnualTaxFor } from '../src/lib/calculator';
import { labelForSource } from '../src/lib/sources';
import { buildShareSearchParams, getDefaultInputs, inputsFromSearchParams } from '../src/lib/shareParams';
import stateRulesData from '../src/config/stateRules.json';
import { CalculatorInputs, StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const rule = (key: string) => rules[key] as StateRule;
const spec = (key: string) => rule(key).registration.listPriceAnnualTax!;
const calc = (key: string, extra: Partial<CalculatorInputs> = {}) =>
  calculateVehicleCosts(rule(key), { ...getDefaultInputs(rule(key), 2026), purchasePrice: 15000, ...extra }, 2026);
/** What a visitor can read: the page renders the disclaimers, the local tax note, and the FAQs, not rule.notes. */
const copy = (key: string) => {
  const { container } = render(<Calculator initialRule={rule(key)} />);
  const r = rule(key);
  const text = [container.textContent ?? '', ...r.faqs.map((f) => `${f.question} ${f.answer}`)].join(' ');
  cleanup();
  return text;
};

const SIX = ['iowa', 'nevada', 'nebraska', 'wyoming', 'new-hampshire', 'maine'];

afterEach(() => cleanup());

describe('Iowa value-based registration fee (Iowa Code 321.109, 321.113)', () => {
  const total = (vehicleYear: number, listPrice = 30000) => calc('iowa', { vehicleYear, listPrice }).registrationTotal;

  it('is 1% of list price plus the $14 weight part through 7 model years old', () => {
    expect(total(2026)).toBe(314);
    expect(total(2019)).toBe(314);
  });

  it('drops to 75% after 7 model years and 50% after 9', () => {
    expect(total(2018)).toBe(239);
    expect(total(2017)).toBe(239);
    expect(total(2016)).toBe(164);
    expect(total(2015)).toBe(164);
  });

  it('is a flat $50 from 12 model years, and $50 is the floor', () => {
    expect(total(2014)).toBe(50);
    expect(total(2000, 90000)).toBe(50);
    expect(total(2018, 3000)).toBe(50);
  });

  it('rounds to whole dollars', () => {
    expect(total(2026, 25555)).toBe(270);
  });

  it('leaves the motorcycle fee alone and adds the EV fee', () => {
    expect(calc('iowa', { vehicleType: 'motorcycle' }).registrationTotal).toBe(20);
    expect(calc('iowa', { vehicleYear: 2026, listPrice: 30000, fuelType: 'ev' }).registrationTotal).toBe(444);
  });
});

describe('Nevada Governmental Services Tax (NRS 371)', () => {
  it('matches the DMV example: a $20,000 MSRP two years old pays $238', () => {
    expect(listPriceAnnualTaxFor(spec('nevada'), 20000, 3)).toBe(238);
  });

  it('follows the statutory schedule to the 15% floor, with a $16 minimum', () => {
    const at = (year: number) => listPriceAnnualTaxFor(spec('nevada'), 30000, year);
    expect([at(1), at(2), at(8), at(9), at(10), at(25)]).toEqual([420, 399, 147, 105, 63, 63]);
    expect(listPriceAnnualTaxFor(spec('nevada'), 2000, 25)).toBe(16);
  });

  it('no longer says the flat registration includes the tax without adding it', () => {
    expect(calc('nevada').annualValueTax).toBe(147);
    expect(copy('nevada')).not.toContain('Washoe');
    expect(copy('nevada')).toContain('Clark and Churchill');
    expect(copy('nevada')).not.toContain('Registration includes an annual');
  });
});

describe('Nebraska motor vehicle tax and fee (Neb. Rev. Stat. 60-3,187, 60-3,190)', () => {
  const at = (price: number, year: number) => listPriceAnnualTaxFor(spec('nebraska'), price, year);

  it('has the 50 statutory value brackets and 14 age categories', () => {
    expect(spec('nebraska').classTable).toHaveLength(50);
    for (const row of spec('nebraska').classTable!) expect(row.feesByYear).toHaveLength(14);
  });

  it('adds the tax and the fee by bracket and age', () => {
    expect(at(30000, 1)).toBe(520);
    expect(at(30000, 8)).toBe(179);
    expect(at(39999, 6)).toBe(350.6);
    expect(at(40000, 6)).toBe(378);
    expect(at(100000, 1)).toBe(1930);
    expect(at(99999, 1)).toBe(1890);
  });

  it('applies the fee step at $20,000, with no age cut below it', () => {
    expect(at(19999, 1)).toBe(265);
    expect(at(20000, 1)).toBe(320);
    expect(at(3000, 20)).toBe(5);
  });

  it('keeps the fee after the tax ends in the 14th year', () => {
    expect(at(30000, 14)).toBe(7);
    expect(at(30000, 30)).toBe(7);
  });
});

describe('Wyoming county registration fee (Wyo. Stat. 31-3-101)', () => {
  it('is 3% of 60% down to 15% of the factory price, with a $5 minimum', () => {
    const at = (year: number) => listPriceAnnualTaxFor(spec('wyoming'), 30000, year);
    expect([at(1), at(2), at(3), at(4), at(5), at(6), at(25)]).toEqual([540, 450, 360, 270, 180, 135, 135]);
    expect(listPriceAnnualTaxFor(spec('wyoming'), 500, 25)).toBe(5);
  });
});

describe('New Hampshire municipal permit fee (RSA 261:153)', () => {
  it('is $18 down to $3 per $1,000 of list price, with a $5 minimum', () => {
    const at = (year: number) => listPriceAnnualTaxFor(spec('new-hampshire'), 30000, year);
    expect([at(1), at(2), at(3), at(4), at(5), at(6), at(25)]).toEqual([540, 450, 360, 270, 180, 90, 90]);
    expect(listPriceAnnualTaxFor(spec('new-hampshire'), 1000, 25)).toBe(5);
  });
});

describe('Maine municipal excise tax (36 M.R.S. 1482)', () => {
  it('is 24 down to 4 mills on list price, with a $5 minimum', () => {
    const at = (year: number) => listPriceAnnualTaxFor(spec('maine'), 30000, year);
    expect([at(1), at(2), at(3), at(4), at(5), at(6), at(25)]).toEqual([720, 525, 405, 300, 195, 120, 120]);
    expect(listPriceAnnualTaxFor(spec('maine'), 500, 25)).toBe(5);
  });

  it('calls the tax on the sale a sales tax, so it cannot be read as the excise tax', () => {
    expect(calc('maine').itemizedList[0].label).toBe('Vehicle Sales Tax (5.5%)');
  });
});

describe('All six states', () => {
  it('leave motorcycles out, and show the MSRP input that sets the tax', () => {
    for (const key of SIX) {
      expect(calc(key, { vehicleType: 'motorcycle' }).annualValueTax).toBe(0);
      const { container } = render(<Calculator initialRule={rule(key)} />);
      const input = container.querySelector('#list-price-input') as HTMLInputElement;
      expect(input).not.toBeNull();
      fireEvent.change(input, { target: { value: '40000' } });
      expect(container.querySelector('#calculator-results')?.textContent).toContain(`${spec(key).label} for a $40,000.00 list price`);
      cleanup();
    }
  });

  it('keep the MSRP in the share link', () => {
    for (const key of SIX) {
      const inputs = { ...getDefaultInputs(rule(key), 2026), purchasePrice: 15000, listPrice: 38000 };
      const params = buildShareSearchParams(rule(key), 15000, inputs);
      expect(params.get('msrp')).toBe('38000');
      expect(inputsFromSearchParams(rule(key), params, getDefaultInputs(rule(key), 2026)).listPrice).toBe(38000);
    }
  });

  it('say the estimate includes the tax, with no em dash in the new sentences', () => {
    for (const key of SIX) {
      expect(copy(key)).toMatch(/estimate (includes|uses)|calculator (includes|figures)/i);
      for (const d of rule(key).disclaimers) expect(copy(key)).toContain(d);
      const added = rule(key).notes.filter((n) => n.includes('$30,000 if blank'));
      expect(added).toHaveLength(1);
      expect(added[0]).not.toContain('—');
    }
  });

  it('cite the primary source, with a readable statute label', () => {
    expect(labelForSource('https://nebraskalegislature.gov/laws/statutes.php?statute=60-3,187')).toBe('nebraskalegislature.gov: Neb. Rev. Stat. 60-3,187');
    expect(labelForSource('https://legislature.maine.gov/statutes/36/title36sec1482.html')).toBe('legislature.maine.gov: 36 M.R.S. 1482');
    expect(labelForSource('https://www.wyoleg.gov/statutes/compress/title31.pdf')).toBe('wyoleg.gov: Wyo. Stat. Title 31');
    expect(rule('nevada').sources).toContain('https://www.leg.state.nv.us/nrs/nrs-371.html');
    expect(rule('iowa').sources).toContain('https://www.legis.iowa.gov/docs/code/321.109.pdf');
    expect(rule('new-hampshire').sources).toContain('https://gc.nh.gov/rsa/html/XXI/261/261-153.htm');
  });
});

describe('Copy-only states', () => {
  it('Washington names the Sound Transit tax and leaves it out of the estimate', () => {
    expect(copy('washington')).toContain('1.1% of the MSRP');
    expect(rule('washington').registration.listPriceAnnualTax).toBeUndefined();
    expect(calc('washington').registrationTotal).toBe(82.75);
    expect(rule('washington').sources).toContain('https://dol.wa.gov/vehicles-and-boats/vehicles/taxes-and-fees/regional-transit-authority-rta-tax');
  });

  it('Massachusetts stays copy-only', () => {
    expect(rule('massachusetts').registration.listPriceAnnualTax).toBeUndefined();
  });

  it('Missouri, Montana, Virginia, and West Virginia mention the local vehicle tax and do not add it', () => {
    expect(copy('missouri')).toContain('statement of non-assessment from your county for the prior year');
    expect(copy('montana')).toContain('local option vehicle tax');
    expect(copy('virginia')).toContain('Va. Code 58.1-3506');
    expect(copy('west-virginia')).toContain('County Assessor');
    expect(labelForSource('https://law.lis.virginia.gov/vacode/title58.1/chapter35/section58.1-3506/')).toBe('law.lis.virginia.gov: Va. Code 58.1-3506');
    expect(labelForSource('https://mca.legmt.gov/bills/mca/title_0610/chapter_0030/part_0050/section_0370/0610-0030-0050-0370.html')).toBe('mca.legmt.gov: MCA 61-3-537');
    for (const key of ['missouri', 'montana', 'virginia', 'west-virginia']) {
      expect(rule(key).registration.listPriceAnnualTax).toBeUndefined();
    }
  });
});
