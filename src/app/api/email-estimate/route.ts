import {
  addToSegment,
  buildEstimateFields,
  estimateFromShareParams,
  getResendConfig,
  isValidEmail,
  rateLimited,
  sendEstimateEmail
} from '@/lib/emailEstimate';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cartaxhub.com';

const json = (body: unknown, status = 200) => Response.json(body, { status });

/**
 * "Email me this estimate". The request carries only the address, the state slug, and the
 * share-link params; the estimate is recalculated here, emailed via Resend, and the address is
 * added to the Resend segment for follow-ups about this estimate.
 */
export async function POST(req: Request) {
  const config = getResendConfig();
  if (!config) return json({ ok: false, error: 'not_configured' }, 404);

  // Same-origin form posts only
  const origin = req.headers.get('origin');
  if (!origin || new URL(origin).host !== new URL(req.url).host) {
    return json({ ok: false, error: 'forbidden' }, 403);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: 'invalid' }, 400);
  }

  // Honeypot: people never fill it, so report success and send nothing
  if (typeof body._gotcha === 'string' && body._gotcha !== '') return json({ ok: true });

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const estimate = estimateFromShareParams(body.slug, body.params);
  if (!isValidEmail(email) || !estimate) return json({ ok: false, error: 'invalid' }, 400);

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) return json({ ok: false, error: 'rate_limited' }, 429);

  const fields = buildEstimateFields({ ...estimate, siteUrl });
  if (!(await sendEstimateEmail(config, email, fields))) {
    return json({ ok: false, error: 'send_failed' }, 502);
  }
  // The visitor has their email either way; a segment failure is logged, not shown
  if (!(await addToSegment(config, email))) {
    console.error('email-estimate: could not add the address to the Resend segment');
  }
  return json({ ok: true });
}
