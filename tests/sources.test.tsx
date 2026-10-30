import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { CostSummaryCard } from '../src/components/CostSummaryCard';
import { calculateVehicleCosts } from '../src/lib/calculator';
import { getDefaultInputs } from '../src/lib/shareParams';
import { getVisibleSources, labelForSource } from '../src/lib/sources';
import stateRulesData from '../src/config/stateRules.json';
import sourceLinkStatus from '../src/config/sourceLinkStatus.json';
import { StateRule, StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const hidden = new Set(sourceLinkStatus.hidden.map((h) => h.url));

afterEach(() => cleanup());

const renderCard = (key: string) => {
  const rule = rules[key] as StateRule;
  const breakdown = calculateVehicleCosts(rule, getDefaultInputs(rule, 2026), 2026);
  return render(<CostSummaryCard breakdown={breakdown} rule={rule} purchasePrice={15000} />);
};

describe('Per-state last verified dates', () => {
  it('every state has a Month YYYY date; re-checked states are October 2026 and the rest September 2026', () => {
    const reverified = ['maryland', 'virginia', 'pennsylvania', 'texas', 'california', 'florida', 'new-york', 'illinois', 'ohio', 'michigan', 'minnesota', 'oklahoma', 'arkansas', 'connecticut', 'louisiana', 'utah', 'georgia', 'north-carolina', 'new-jersey'];
    for (const [key, rule] of Object.entries(rules)) {
      expect(rule.lastVerified).toMatch(/^(January|February|March|April|May|June|July|August|September|October|November|December) \d{4}$/);
      expect(rule.lastVerified).toBe(reverified.includes(key) ? 'October 2026' : 'September 2026');
    }
  });

  it('Maryland sources are the current MVA excise tax and fees pages', () => {
    expect(rules.maryland.sources).toEqual([
      'https://mva.maryland.gov/title-registration/fees-payment-options/excise-tax',
      'https://mva.maryland.gov/title-registration/fees-payment-options'
    ]);
  });

  it('Maryland VEIP full-station fee matches the MVA fee page ($30)', () => {
    expect(rules.maryland.veipFee).toBe(30);
    const { container } = renderCard('maryland');
    expect(container.textContent).toContain('$30.00 full station / $26 kiosk');
  });
});

describe('Known-dead source links are hidden', () => {
  it('every hidden entry matches a real state source, and Maryland has none hidden', () => {
    for (const entry of sourceLinkStatus.hidden) {
      expect(rules[entry.state]?.sources).toContain(entry.url);
      expect(entry.finding.length).toBeGreaterThan(0);
    }
    expect(sourceLinkStatus.hidden.some((h) => h.state === 'maryland')).toBe(false);
  });

  it('getVisibleSources drops hidden links and keeps the rest in order', () => {
    for (const rule of Object.values(rules)) {
      const visible = getVisibleSources(rule).map((s) => s.url);
      expect(visible).toEqual(rule.sources.filter((u) => !hidden.has(u)));
    }
  });

  it('a state with working and dead links shows only the working ones', () => {
    const { container } = renderCard('california');
    const links = [...container.querySelectorAll('#state-sources a')].map((a) => a.getAttribute('href'));
    expect(links.length).toBe(rules.california.sources.filter((u) => !hidden.has(u)).length);
    expect(links).not.toContain('https://www.cdtfa.ca.gov/taxes-and-fees/sales-use-tax-rates-7-25.htm');
  });

  it('no state is left with only dead links (batch 6 repaired the last four)', () => {
    for (const rule of Object.values(rules)) {
      expect(getVisibleSources(rule).length).toBeGreaterThan(0);
    }
  });

  it('a state with only dead links shows a plain "being updated" note and no links', () => {
    // No real state is left in this situation, so hide Louisiana's links for the test
    const deadUrl = sourceLinkStatus.hidden[0].url;
    const rule = { ...(rules.louisiana as StateRule), lastVerified: 'September 2026', sources: [deadUrl] };
    const breakdown = calculateVehicleCosts(rule, getDefaultInputs(rule, 2026), 2026);
    const { container } = render(<CostSummaryCard breakdown={breakdown} rule={rule} purchasePrice={15000} />);
    expect(container.querySelectorAll('#state-sources a')).toHaveLength(0);
    expect(container.querySelector('#state-sources')?.textContent).toContain(
      'Official source links for Louisiana are being updated.'
    );
    expect(container.querySelector('#state-sources')?.textContent).toContain('Louisiana rates last verified: September 2026');
  });

  it('no rendered calculator card links to a hidden URL', () => {
    for (const key of Object.keys(rules)) {
      const { container } = renderCard(key);
      for (const a of container.querySelectorAll('#state-sources a')) expect(hidden.has(a.getAttribute('href')!)).toBe(false);
      cleanup();
    }
  });
});

describe('Source labels', () => {
  it('labels links by site and page name', () => {
    expect(labelForSource('https://mva.maryland.gov/title-registration/fees-payment-options/excise-tax')).toBe('mva.maryland.gov: excise tax');
    expect(labelForSource('https://www.mass.gov/doc/rmv-schedule-of-fees/download')).toBe('mass.gov: rmv schedule of fees');
    expect(labelForSource('https://dmv.de.gov/forms/veh_serv_forms/pdfs/mv347.pdf')).toBe('dmv.de.gov: mv347');
    expect(labelForSource('https://tax.ri.gov')).toBe('tax.ri.gov');
  });
});
