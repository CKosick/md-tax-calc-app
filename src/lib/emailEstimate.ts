import stateRulesData from '@/config/stateRules.json';
import { calculateVehicleCosts } from './calculator';
import { getCalculationYear } from './constants';
import { buildShareSearchParams, getDefaultInputs, inputsFromSearchParams } from './shareParams';
import { CalculatorInputs, CostBreakdown, StateRule, StateRulesConfig } from './types';

// Server-only: reads the Resend secret and the full rules config. Client code must not import it.

type EnvSource = Record<string, string | undefined>;

export const DEFAULT_FROM = 'CarTaxHub <estimates@cartaxhub.com>';
const RESEND_API = 'https://api.resend.com';

export interface ResendConfig {
  apiKey: string;
  /** Resend Segment (formerly Audience) the address is added to. */
  segmentId: string;
  from: string;
}

/**
 * The Resend settings for "Email me this estimate". Needs RESEND_API_KEY and RESEND_SEGMENT_ID
 * (RESEND_AUDIENCE_ID is accepted too: Resend renamed Audiences to Segments). RESEND_FROM_EMAIL is
 * optional and defaults to estimates@cartaxhub.com. With anything required missing, the email
 * block is not rendered and the route refuses submissions.
 */
export function getResendConfig(env: EnvSource = process.env): ResendConfig | undefined {
  const apiKey = env.RESEND_API_KEY?.trim();
  const segmentId = (env.RESEND_SEGMENT_ID || env.RESEND_AUDIENCE_ID)?.trim();
  const from = env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM;
  if (!apiKey || !apiKey.startsWith('re_') || !segmentId) return undefined;
  return { apiKey, segmentId, from };
}

/** Resolved on the server and passed down as a prop, like the partner links. Never exposes the key. */
export function isEmailEstimateEnabled(env: EnvSource = process.env): boolean {
  return getResendConfig(env) !== undefined;
}

const EMAIL_PATTERN = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]+$/;

export function isValidEmail(email: unknown): email is string {
  return typeof email === 'string' && email.length <= 254 && EMAIL_PATTERN.test(email);
}

const rules = Object.values(stateRulesData as StateRulesConfig) as StateRule[];

/**
 * Rebuilds the estimate on the server from the state slug and the share-link params, so the email
 * carries our own numbers and never text supplied by the request.
 */
export function estimateFromShareParams(
  slug: unknown,
  params: unknown,
  calculationYear: number = getCalculationYear()
): { rule: StateRule; inputs: CalculatorInputs; breakdown: CostBreakdown } | undefined {
  if (typeof slug !== 'string' || typeof params !== 'string' || params.length > 1000) return undefined;
  const rule = rules.find((r) => r.slug === slug);
  if (!rule) return undefined;
  const search = new URLSearchParams(params);
  if (!search.has('price')) return undefined;
  const inputs = inputsFromSearchParams(rule, search, getDefaultInputs(rule, calculationYear));
  return { rule, inputs, breakdown: calculateVehicleCosts(rule, inputs, calculationYear) };
}

const money = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

export interface EstimateFields {
  state: string;
  state_slug: string;
  vehicle_price: string;
  fees_total: string;
  share_link: string;
  tax?: string;
  total?: string;
  tax_min?: string;
  tax_max?: string;
  total_min?: string;
  total_max?: string;
  locality?: string;
}

/**
 * The estimate as sent in the email. Tax and total are one value, or min and max when the state
 * shows a local tax range. The share link opens the state's calculator with these inputs.
 */
export function buildEstimateFields(args: {
  rule: StateRule;
  breakdown: CostBreakdown;
  inputs: CalculatorInputs;
  siteUrl: string;
}): EstimateFields {
  const { rule, breakdown, inputs, siteUrl } = args;
  const link = new URL(`/calculator/${rule.slug}`, siteUrl);
  link.search = buildShareSearchParams(rule, inputs.purchasePrice, inputs).toString();

  const ranged =
    breakdown.hasLocalTax &&
    breakdown.totalFirstYearCostMin !== undefined &&
    breakdown.totalFirstYearCostMax !== undefined &&
    (breakdown.localTaxMax ?? 0) > 0;

  const fields: EstimateFields = {
    state: rule.label,
    state_slug: rule.slug,
    vehicle_price: money(inputs.purchasePrice),
    fees_total: money(breakdown.totalFirstYearCost - breakdown.exciseTax),
    share_link: link.toString()
  };
  if (ranged) {
    fields.tax_min = money(breakdown.combinedTaxMin ?? breakdown.exciseTax);
    fields.tax_max = money(breakdown.combinedTaxMax ?? breakdown.exciseTax);
    fields.total_min = money(breakdown.totalFirstYearCostMin!);
    fields.total_max = money(breakdown.totalFirstYearCostMax!);
  } else {
    fields.tax = money(breakdown.exciseTax);
    fields.total = money(breakdown.totalFirstYearCost);
  }
  if (breakdown.localityLabel) fields.locality = breakdown.localityLabel;
  return fields;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** Subject, plain text, and HTML for the visitor's estimate email. */
export function renderEstimateEmail(fields: EstimateFields): { subject: string; text: string; html: string } {
  const rows: [string, string][] = [['Vehicle price', fields.vehicle_price]];
  if (fields.locality) rows.push(['Locality', fields.locality]);
  rows.push(['Tax', fields.tax ?? `${fields.tax_min} to ${fields.tax_max}`]);
  rows.push(['Fees', fields.fees_total]);
  rows.push(['Estimated total', fields.total ?? `${fields.total_min} to ${fields.total_max}`]);

  const intro = `Here is the ${fields.state} car tax estimate you asked for on CarTaxHub.`;
  const rangeNote = fields.tax_min
    ? 'Local tax varies by where you live, so the tax and total are shown as a range. Pick your locality on the calculator for an exact figure.'
    : '';
  const footer = [
    'This is an estimate. Confirm the final amounts with your state motor vehicle agency.',
    'You received this because you entered this address on cartaxhub.com. We keep it only for follow-ups about this estimate and never send marketing unless you sign up for it separately.'
  ];

  const text = [
    intro,
    '',
    ...rows.map(([k, v]) => `${k}: ${v}`),
    ...(rangeNote ? ['', rangeNote] : []),
    '',
    `Open this estimate: ${fields.share_link}`,
    '',
    ...footer
  ].join('\n');

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#0f172a;line-height:1.5">
<p>${escapeHtml(intro)}</p>
<table cellpadding="6" style="border-collapse:collapse">
${rows.map(([k, v]) => `<tr><td style="color:#475569">${escapeHtml(k)}</td><td style="font-weight:bold">${escapeHtml(v)}</td></tr>`).join('\n')}
</table>
${rangeNote ? `<p>${escapeHtml(rangeNote)}</p>` : ''}
<p><a href="${escapeHtml(fields.share_link)}">Open this estimate on CarTaxHub</a></p>
${footer.map((f) => `<p style="font-size:12px;color:#64748b">${escapeHtml(f)}</p>`).join('\n')}
</div>`;

  return { subject: `Your ${fields.state} car tax estimate from CarTaxHub`, text, html };
}

async function resendPost(config: ResendConfig, path: string, body?: unknown, idempotencyKey?: string) {
  return fetch(`${RESEND_API}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {})
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
}

/** Sends the estimate email. Resolves true when Resend accepts it. */
export async function sendEstimateEmail(config: ResendConfig, to: string, fields: EstimateFields): Promise<boolean> {
  const { subject, text, html } = renderEstimateEmail(fields);
  try {
    const res = await resendPost(config, '/emails', { from: config.from, to: [to], subject, text, html });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Adds the address to the Resend segment. Creating the contact fails harmlessly when it already
 * exists, so the segment is added in a second call either way. The unsubscribed flag is never sent,
 * so an earlier unsubscribe is kept. Resolves true when the address is in the segment.
 */
export async function addToSegment(config: ResendConfig, email: string): Promise<boolean> {
  try {
    await resendPost(config, '/contacts', { email });
    const res = await resendPost(config, `/contacts/${encodeURIComponent(email)}/segments/${encodeURIComponent(config.segmentId)}`);
    return res.ok;
  } catch {
    return false;
  }
}

// Best-effort limit per server instance (serverless instances do not share it): 5 sends per 10 minutes per IP
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

export function rateLimited(ip: string, now: number = Date.now()): boolean {
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) {
    recent.set(ip, hits);
    return true;
  }
  hits.push(now);
  recent.set(ip, hits);
  return false;
}

export function resetRateLimit() {
  recent.clear();
}
