import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn()
}));

import { Calculator } from '../src/components/Calculator';
import { generateMetadata } from '../src/app/calculator/[slug]/page';
import { formatPercent, formatTermPhrase, ratePercent } from '../src/lib/formatters';
import { labelForSource } from '../src/lib/sources';
import stateRulesData from '../src/config/stateRules.json';
import { StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const page = (key: string) => render(<Calculator initialRule={rules[key] as StateRule} />).container.textContent ?? '';

afterEach(() => cleanup());

describe('Rates display exactly', () => {
  it('keeps three-decimal rates and trims whole ones', () => {
    expect(ratePercent(0.04225)).toBe(4.225);
    expect(ratePercent(0.06625)).toBe(6.625);
    expect(ratePercent(0.06875)).toBe(6.875);
    expect(ratePercent(0.0525)).toBe(5.25);
    expect(ratePercent(0.06)).toBe(6);
    expect(formatPercent(0.06)).toBe('6.00%');
    expect(formatPercent(0.04225)).toBe('4.225%');
    expect(formatPercent(0.0725)).toBe('7.25%');
  });

  it('Missouri shows 4.225% and New Jersey 6.625% on the calculator, never rounded', () => {
    const mo = page('missouri');
    expect(mo).toContain('4.225%');
    expect(mo).not.toContain('4.23%');
    cleanup();
    const nj = page('new-jersey');
    expect(nj).toContain('6.625%');
    expect(nj).not.toContain('6.63%');
  });
});

describe('Registration term phrase follows each state’s terms', () => {
  it('formats one, two, or more terms', () => {
    expect(formatTermPhrase([1])).toBe('1-year');
    expect(formatTermPhrase([2])).toBe('2-year');
    expect(formatTermPhrase([2, 1])).toBe('1 or 2-year');
    expect(formatTermPhrase([3])).toBe('3-year');
    expect(formatTermPhrase([1, 2, 3])).toBe('1, 2 or 3-year');
  });

  it('one-term states no longer say "1 or 2-year"; two-term states still do', () => {
    const wa = page('washington');
    expect(wa).toContain('1-year tag registration');
    expect(wa).not.toContain('1 or 2-year');
    cleanup();
    expect(page('south-carolina')).toContain('2-year tag registration');
    cleanup();
    expect(page('maryland')).toContain('1 or 2-year tag registration');
  });

  it('the page description uses the same phrase', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'south-carolina-private-sale-tax-calculator' }) });
    expect(String(meta.description)).toContain('2-year tag registration');
    expect(String(meta.description)).not.toContain('1 or 2-year');
  });
});

describe('Statute source labels', () => {
  it('shows the citation instead of a file code or query string', () => {
    expect(labelForSource('https://www.azleg.gov/ars/28/02003.htm')).toBe('azleg.gov: A.R.S. 28-2003');
    expect(labelForSource('https://www.azleg.gov/ars/49/00551.htm')).toBe('azleg.gov: A.R.S. 49-551');
    expect(labelForSource('https://app.leg.wa.gov/RCW/default.aspx?cite=82.12.0251')).toBe('app.leg.wa.gov: RCW 82.12.0251');
    expect(labelForSource('https://revisor.mo.gov/main/OneSection.aspx?section=144.025')).toBe('revisor.mo.gov: RSMo 144.025');
    expect(labelForSource('https://www.revisor.mn.gov/statutes/cite/168.013')).toBe('revisor.mn.gov: Minn. Stat. 168.013');
    expect(labelForSource('https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_105/GS_105-187.3.html')).toBe('ncleg.gov: N.C.G.S. 105-187.3');
    expect(labelForSource('https://codes.ohio.gov/ohio-revised-code/section-4505.09')).toBe('codes.ohio.gov: Ohio Rev. Code 4505.09');
    expect(labelForSource('https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-257-801')).toBe('legislature.mi.gov: MCL 257.801');
    expect(labelForSource('https://www.scstatehouse.gov/code/t56c003.php')).toBe('scstatehouse.gov: S.C. Code Title 56, Chapter 3');
    expect(labelForSource('https://www.cga.ct.gov/current/pub/chap_246.htm')).toBe('cga.ct.gov: Conn. Gen. Stat. Chapter 246');
    expect(labelForSource('https://delcode.delaware.gov/title30/c030/index.html')).toBe('delcode.delaware.gov: Del. Code Title 30, Chapter 30');
  });

  it('leaves ordinary agency page labels unchanged', () => {
    expect(labelForSource('https://mva.maryland.gov/title-registration/fees-payment-options')).toBe('mva.maryland.gov: fees payment options');
    expect(labelForSource('https://dmv.sc.gov/fees')).toBe('dmv.sc.gov: fees');
  });
});
