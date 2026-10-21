import { FaqItem, StateRule } from './types';

/**
 * Placeholder FAQ answers that predate state-by-state verification. They hedge instead of
 * answering ("rules vary by state", "typically 10 to 30 days"), so they are hidden from the
 * page and from the FAQ structured data until the state's repair batch replaces them with
 * verified answers (as was done for Maryland, Virginia, and Pennsylvania).
 */
const GENERIC_FAQ_ANSWER_PATTERNS: RegExp[] = [
  // Family gifts
  /vary significantly by state/i,
  // Titling deadline
  /deadlines for private vehicle purchases vary by jurisdiction/i,
  // Out-of-state purchases
  /many states offer reciprocal tax credit/i
];

export function isGenericFaq(faq: FaqItem): boolean {
  return GENERIC_FAQ_ANSWER_PATTERNS.some((pattern) => pattern.test(faq.answer));
}

/** The FAQs to publish for a state: everything except the generic placeholder answers. */
export function getPublishedFaqs(rule: StateRule): FaqItem[] {
  return rule.faqs.filter((faq) => !isGenericFaq(faq));
}
