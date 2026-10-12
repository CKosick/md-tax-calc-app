import partnerSlotsData from '@/config/partnerSlots.json';
import { PartnerSlotConfig } from './types';

/** Resolved, ready-to-render destination URLs keyed by partner slot id. */
export type PartnerHrefs = Record<string, string>;

type EnvSource = Record<string, string | undefined>;

/**
 * Checks whether an affiliate link is a valid real destination URL.
 * Missing, empty, or placeholder '#' links are rejected so the slot remains hidden.
 */
export function isValidRealUrl(href?: string | null): boolean {
  if (!href) return false;
  const trimmed = href.trim();
  if (trimmed === '' || trimmed === '#' || trimmed.startsWith('#')) {
    return false;
  }
  return true;
}

/**
 * Resolves a slot's affiliate destination from environment variables or slot configuration.
 *
 * Env var names are built from the slot id, so this must run on the server: Next.js only
 * inlines NEXT_PUBLIC_* values into client bundles when they are referenced literally.
 */
export function getSlotHref(slot: PartnerSlotConfig, env: EnvSource = process.env): string | undefined {
  const idKey = slot.id.toUpperCase().replace(/[^A-Z0-9]/g, '_');

  // Convenient friendly aliases for standard slots
  const aliasMap: Record<string, string[]> = {
    'insurance-compare': [
      'NEXT_PUBLIC_PARTNER_INSURANCE_URL',
      'NEXT_PUBLIC_AFFILIATE_INSURANCE_URL',
      'NEXT_PUBLIC_INSURANCE_PARTNER_URL'
    ],
    'auto-loan-rates': [
      'NEXT_PUBLIC_PARTNER_LOAN_URL',
      'NEXT_PUBLIC_AFFILIATE_LOAN_URL',
      'NEXT_PUBLIC_PARTNER_AUTO_LOAN_URL',
      'NEXT_PUBLIC_LOAN_PARTNER_URL'
    ]
  };

  const candidateKeys = [
    `NEXT_PUBLIC_PARTNER_${idKey}_URL`,
    `NEXT_PUBLIC_AFFILIATE_${idKey}_URL`,
    ...(aliasMap[slot.id] || [])
  ];

  for (const key of candidateKeys) {
    const val = env[key];
    if (val && val.trim() !== '') {
      return val.trim();
    }
  }

  // Optional JSON bundle of partner links: NEXT_PUBLIC_PARTNER_LINKS='{"insurance-compare":"https://..."}'
  if (env.NEXT_PUBLIC_PARTNER_LINKS) {
    try {
      const parsed = JSON.parse(env.NEXT_PUBLIC_PARTNER_LINKS);
      if (parsed && typeof parsed[slot.id] === 'string' && parsed[slot.id].trim() !== '') {
        return parsed[slot.id].trim();
      }
    } catch {
      // ignore JSON parse error
    }
  }

  // Fallback to static slot configuration
  return slot.href;
}

/** Appends tracking params to a destination URL. Returns '' for placeholder or missing links. */
export function buildPartnerUrl(href: string, trackingParams?: Record<string, string>): string {
  if (!isValidRealUrl(href)) {
    return '';
  }
  if (!trackingParams || Object.keys(trackingParams).length === 0) {
    return href;
  }
  try {
    const isAbsolute = href.startsWith('http://') || href.startsWith('https://');
    const url = new URL(href, 'https://example.com');
    Object.entries(trackingParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    // Return relative or absolute based on input
    if (isAbsolute) {
      return url.toString();
    }
    return url.pathname + url.search + url.hash;
  } catch {
    return href;
  }
}

/**
 * Server-side resolution of every configured partner slot. The result is passed to the
 * client PartnerSlot as props, so server HTML and browser hydration see identical links.
 * Slots without a real destination are omitted.
 */
export function resolvePartnerHrefs(
  slots: PartnerSlotConfig[] = partnerSlotsData as PartnerSlotConfig[],
  env: EnvSource = process.env
): PartnerHrefs {
  const hrefs: PartnerHrefs = {};
  for (const slot of slots) {
    const destination = buildPartnerUrl(getSlotHref(slot, env) || '', slot.trackingParams);
    if (isValidRealUrl(destination)) {
      hrefs[slot.id] = destination;
    }
  }
  return hrefs;
}
