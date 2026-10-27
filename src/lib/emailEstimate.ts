import { CalculatorInputs, CostBreakdown, StateRule } from './types';
import { buildShareSearchParams } from './shareParams';

type EnvSource = Record<string, string | undefined>;

/**
 * The Formspree form ID for "Email me this estimate", from NEXT_PUBLIC_FORMSPREE_FORM_ID.
 * Resolved on the server and passed down as a prop, like the partner links: with no ID (or a
 * malformed one) the email block is not rendered at all.
 */
export function getFormspreeFormId(env: EnvSource = process.env): string | undefined {
  const id = env.NEXT_PUBLIC_FORMSPREE_FORM_ID?.trim();
  return id && /^[A-Za-z0-9]{4,32}$/.test(id) ? id : undefined;
}

export function formspreeEndpoint(formId: string): string {
  return `https://formspree.io/f/${formId}`;
}

const money = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

/**
 * The fields sent to Formspree for one estimate. Totals are a single value, or min and max when
 * the state shows a local tax range. `email` is Formspree's reply-to and autoresponse field.
 */
export function buildEstimatePayload(args: {
  email: string;
  rule: StateRule;
  breakdown: CostBreakdown;
  purchasePrice: number;
  inputs?: CalculatorInputs;
  pageUrl: string;
}): Record<string, string> {
  const { email, rule, breakdown, purchasePrice, inputs, pageUrl } = args;
  const url = new URL(pageUrl);
  url.search = buildShareSearchParams(rule, purchasePrice, inputs).toString();
  url.hash = '';

  const ranged =
    breakdown.hasLocalTax &&
    breakdown.totalFirstYearCostMin !== undefined &&
    breakdown.totalFirstYearCostMax !== undefined &&
    (breakdown.localTaxMax ?? 0) > 0;
  const feesTotal = breakdown.totalFirstYearCost - breakdown.exciseTax;

  const payload: Record<string, string> = {
    email,
    _subject: `Your ${rule.label} car tax estimate from CarTaxHub`,
    state: rule.label,
    state_slug: rule.slug,
    vehicle_price: money(purchasePrice),
    fees_total: money(feesTotal),
    share_link: url.toString()
  };
  if (ranged) {
    payload.tax_min = money(breakdown.combinedTaxMin ?? breakdown.exciseTax);
    payload.tax_max = money(breakdown.combinedTaxMax ?? breakdown.exciseTax);
    payload.total_min = money(breakdown.totalFirstYearCostMin!);
    payload.total_max = money(breakdown.totalFirstYearCostMax!);
  } else {
    payload.tax = money(breakdown.exciseTax);
    payload.total = money(breakdown.totalFirstYearCost);
  }
  if (breakdown.localityLabel) payload.locality = breakdown.localityLabel;
  return payload;
}

/** Posts the payload to Formspree's AJAX endpoint. Resolves true on success, false otherwise. */
export async function sendEstimate(formId: string, payload: Record<string, string>): Promise<boolean> {
  try {
    const res = await fetch(formspreeEndpoint(formId), {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch {
    return false;
  }
}
