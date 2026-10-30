import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn()
}));

vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-geist-sans' }),
  Geist_Mono: () => ({ variable: '--font-geist-mono' })
}));

import { getPublishedFaqs, isGenericFaq } from '../src/lib/faqs';
import CalculatorSlugPage from '../src/app/calculator/[slug]/page';
import HomePage from '../src/app/page';
import RootLayout from '../src/app/layout';
import { GUIDES } from '../src/config/guides';
import stateRulesData from '../src/config/stateRules.json';
import { StateRulesConfig } from '../src/lib/types';

const rules = stateRulesData as StateRulesConfig;
const RECHECKED = ['maryland', 'virginia', 'pennsylvania', 'texas', 'california', 'florida', 'new-york', 'illinois', 'ohio', 'michigan', 'minnesota', 'oklahoma', 'arkansas', 'connecticut', 'louisiana', 'utah', 'georgia', 'north-carolina', 'new-jersey'];
const GENERIC = /vary significantly by state|deadlines for private vehicle purchases vary by jurisdiction|many states offer reciprocal tax credit/i;

afterEach(() => cleanup());

describe('Generic FAQ answers are hidden on states not yet re-checked', () => {
  it('re-checked states have no generic answers and publish every FAQ', () => {
    for (const key of RECHECKED) {
      expect(rules[key].faqs.some(isGenericFaq)).toBe(false);
      expect(getPublishedFaqs(rules[key])).toEqual(rules[key].faqs);
    }
  });

  it('hides exactly the generic gift, deadline, and out-of-state answers, nothing else', () => {
    let hidden = 0;
    for (const [key, rule] of Object.entries(rules)) {
      const published = getPublishedFaqs(rule);
      expect(published.some((f) => GENERIC.test(f.answer))).toBe(false);
      // Every published FAQ is one of the state's own, in the original order
      expect(published).toEqual(rule.faqs.filter((f) => !GENERIC.test(f.answer)));
      hidden += rule.faqs.length - published.length;
      if (!RECHECKED.includes(key)) expect(published.length).toBeGreaterThanOrEqual(4);
    }
    // 24 states x 3 + 6 states x 1 (deadline only) + 1 state x 2 (gift and out-of-state);
    // Maryland's, Texas's, California's, Florida's, New York's, Illinois's, Ohio's, Michigan's, Minnesota's, Oklahoma's, Arkansas's, Connecticut's, Louisiana's, Utah's, Georgia's, North Carolina's, and New Jersey's were replaced with verified answers
    expect(hidden).toBe(24 * 3 + 6 * 1 + 1 * 2);
  });

  it('Maryland’s gift, deadline, and out-of-state answers are the verified ones', () => {
    const answers = rules.maryland.faqs.map((f) => f.answer).join(' ');
    expect(answers).toContain('Gift Certification (Form VR-103)');
    expect(answers).toContain('aged 65 or older');
    expect(answers).toContain('valid for 90 days');
    expect(answers).toContain('must meet Maryland standards');
  });

  it('the rate, fee, trade-in, and registration answers stay', () => {
    for (const rule of Object.values(rules)) {
      const questions = getPublishedFaqs(rule).map((f) => f.question);
      for (const q of rule.faqs.slice(0, 4).map((f) => f.question)) expect(questions).toContain(q);
    }
  });

  it('on a calculator page, the visible FAQ and the FAQPage structured data both omit them and match', async () => {
    const { container } = render(
      await CalculatorSlugPage({ params: Promise.resolve({ slug: 'texas-private-sale-tax-calculator' }) })
    );
    const faqSection = container.querySelector('section[aria-labelledby="faq-section-title"]');
    expect(faqSection?.textContent).not.toMatch(GENERIC);
    const visibleQuestions = [...(faqSection?.querySelectorAll('h3 button') ?? [])].map((b) => b.textContent?.trim());

    const ld = [...container.querySelectorAll('script[type="application/ld+json"]')]
      .map((s) => JSON.parse(s.textContent || '{}'))
      .find((x) => x['@type'] === 'FAQPage');
    expect(JSON.stringify(ld)).not.toMatch(GENERIC);
    const ldQuestions = ld.mainEntity.map((q: { name: string }) => q.name);
    expect(ldQuestions).toEqual(getPublishedFaqs(rules.texas).map((f) => f.question));
    expect(visibleQuestions).toEqual(ldQuestions);
  });
});

describe('Guides are linked from the header and the homepage', () => {
  it('the header nav links to /guides', () => {
    const { container } = render(
      <RootLayout>
        <div />
      </RootLayout>
    );
    const nav = container.querySelector('header nav');
    expect(nav?.querySelector('a[href="/guides"]')?.textContent).toBe('Guides');
  });

  it('the homepage guides section links every guide, grouped by state, plus All Guides', () => {
    const { container } = render(<HomePage />);
    const section = container.querySelector('#home-guides');
    expect(section).not.toBeNull();
    const hrefs = [...(section?.querySelectorAll('a') ?? [])].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/guides');
    for (const guide of GUIDES) expect(hrefs).toContain(`/guides/${guide.slug}`);
    const stateHeadings = [...(section?.querySelectorAll('h3') ?? [])].map((h) => h.textContent);
    expect(stateHeadings).toEqual([...new Set(GUIDES.map((g) => rules[g.stateKey].label))]);
  });
});
