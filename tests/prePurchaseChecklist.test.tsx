import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import CalculatorSlugPage from '../src/app/calculator/[slug]/page';
import GuidePage from '../src/app/guides/[slug]/page';
import { Calculator } from '../src/components/Calculator';
import { getChecklistAnswers, getCounterFees } from '../src/components/PrePurchaseChecklist';
import { calculateVehicleCosts } from '../src/lib/calculator';
import { getDefaultInputs } from '../src/lib/shareParams';
import { isGenericFaq } from '../src/lib/faqs';
import { GUIDES, getGuidesForState } from '../src/config/guides';
import stateRulesData from '../src/config/stateRules.json';
import { StateRule, StateRulesConfig } from '../src/lib/types';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn()
}));

afterEach(() => cleanup());

const rules = stateRulesData as StateRulesConfig;
const renderState = async (key: string) =>
  render(await CalculatorSlugPage({ params: Promise.resolve({ slug: rules[key].slug }) }));
const checklistOf = (container: HTMLElement) => container.querySelector('#pre-purchase-checklist');
const privateSale = (key: string) => getGuidesForState(key).find((g) => g.slug.startsWith('how-to-title-a-private-car-sale-in-'));

describe('Pre-purchase checklist', () => {
  it('every state calculator page has the checklist, and every item traces to a sourced field', { timeout: 120000 }, async () => {
    for (const key of Object.keys(rules)) {
      const rule = rules[key] as StateRule;
      const { container } = await renderState(key);
      const block = checklistOf(container);
      expect(block, key).not.toBeNull();
      expect(block?.textContent).toContain(`${rule.label} Pre-Purchase Checklist`);

      // Deadline and family items are the state's published FAQ answers, verbatim, or absent
      const { deadline, family } = getChecklistAnswers(rule);
      const deadlineEl = block?.querySelector('[data-checklist-source="deadline-faq"]');
      const familyEl = block?.querySelector('[data-checklist-source="family-faq"]');
      expect(deadlineEl?.textContent ?? undefined, key).toBe(deadline?.answer);
      expect(familyEl?.textContent ?? undefined, key).toBe(family?.answer);
      for (const faq of [deadline, family]) if (faq) expect(isGenericFaq(faq)).toBe(false);

      // Documents are exactly the private-sale guide's verified checklist, or absent
      const docs = [...(block?.querySelectorAll('[data-checklist-source="private-sale-guide"] li') ?? [])].map((li) => li.textContent);
      expect(docs, key).toEqual(privateSale(key)?.checklist ?? []);

      // Counter fees are the estimate's own itemized lines with an amount
      const breakdown = calculateVehicleCosts(rule, getDefaultInputs(rule, 2026), 2026);
      const feeLabels = [...(block?.querySelectorAll('[data-checklist-source="estimate"] li') ?? [])].map((li) => li.firstChild?.textContent);
      expect(feeLabels.slice(0, -1), key).toEqual(getCounterFees(breakdown).map((f) => f.label));
      expect(feeLabels.at(-1)).toBe('Total in your estimate');
      cleanup();
    }
  });

  it('never shows a generic placeholder answer: Vermont (held) shows only the fees; Tennessee has no deadline item', async () => {
    const vt = await renderState('vermont');
    const vtBlock = checklistOf(vt.container);
    expect(vtBlock?.querySelector('[data-checklist-source="deadline-faq"]')).toBeNull();
    expect(vtBlock?.querySelector('[data-checklist-source="family-faq"]')).toBeNull();
    expect(vtBlock?.querySelector('[data-checklist-source="private-sale-guide"]')).toBeNull();
    expect(vtBlock?.querySelector('[data-checklist-source="estimate"]')).not.toBeNull();
    expect(vtBlock?.textContent).not.toMatch(/vary significantly by state|vary by jurisdiction/);
    cleanup();

    const tn = await renderState('tennessee');
    expect(checklistOf(tn.container)?.querySelector('[data-checklist-source="deadline-faq"]')).toBeNull();
    expect(checklistOf(tn.container)?.querySelector('[data-checklist-source="family-faq"]')).not.toBeNull();
  });

  it('names the inspection steps only where the state guide lists them (e.g. Rhode Island VIN check, Delaware none)', async () => {
    const ri = await renderState('rhode-island');
    expect(checklistOf(ri.container)?.textContent).toContain('Forms TR-1 and T-334');
    cleanup();
    const tx = await renderState('texas');
    const txDocs = privateSale('texas')!.checklist;
    expect(txDocs.length).toBeGreaterThanOrEqual(5);
    for (const doc of txDocs) expect(checklistOf(tx.container)?.textContent).toContain(doc);
  });

  it('links the private-sale and gift guides', async () => {
    const { container } = await renderState('wyoming');
    const hrefs = [...(checklistOf(container)?.querySelectorAll('a') ?? [])].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/guides/how-to-title-a-private-car-sale-in-wyoming');
    expect(hrefs).toContain('/guides/how-to-gift-a-car-in-wyoming');
  });

  it('follows the estimate: financing adds the lien fee to the counter fees', () => {
    const rule = rules.delaware as StateRule;
    const { container } = render(<Calculator initialRule={rule} />);
    const fees = () => [...(checklistOf(container)?.querySelectorAll('[data-checklist-source="estimate"] li') ?? [])].map((li) => li.textContent ?? '');
    expect(fees().some((t) => t.startsWith('Lien'))).toBe(false);
    fireEvent.click(container.querySelector('#financed-yes') as HTMLElement);
    expect(fees().some((t) => /Lien/.test(t) && t.includes('$20.00'))).toBe(true);
  });

  it('is not shown on guide pages, where the calculator is embedded', async () => {
    const guide = GUIDES[0];
    const { container } = render(await GuidePage({ params: Promise.resolve({ slug: guide.slug }) }));
    expect(checklistOf(container)).toBeNull();
  });
});

describe('Pre-purchase checklist copy', () => {
  it('does not repeat the estimate total as a fee, and Vermont says only that it is built from the estimate', async () => {
    const vt = await renderState('vermont');
    const block = checklistOf(vt.container);
    const labels = [...(block?.querySelectorAll('[data-checklist-source="estimate"] li') ?? [])].map((li) => li.firstChild?.textContent);
    expect(labels).not.toContain('Total First-Year Out-of-Pocket Cost');
    expect(labels.filter((l) => l === 'Total in your estimate')).toHaveLength(1);
    expect(block?.textContent).toContain('Built from your estimate above.');
    expect(block?.textContent).not.toContain('verified Vermont answers');
  });
});
