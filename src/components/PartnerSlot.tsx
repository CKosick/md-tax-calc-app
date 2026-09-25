'use client';

import React from 'react';
import partnerSlotsData from '@/config/partnerSlots.json';
import { PartnerSlotConfig } from '@/lib/types';

interface PartnerSlotProps {
  position: 'below-results' | 'sidebar';
  className?: string;
  forceShow?: boolean;
  slots?: PartnerSlotConfig[];
}

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
 * Resolves effective affiliate destination URL from environment variables or slot configuration.
 * Allows inserting production affiliate links dynamically without code modifications.
 */
export function getSlotHref(slot: PartnerSlotConfig): string | undefined {
  if (typeof process !== 'undefined' && process.env) {
    // Dynamic slot-specific env variable (e.g. NEXT_PUBLIC_PARTNER_INSURANCE_COMPARE_URL)
    const envKey = `NEXT_PUBLIC_PARTNER_${slot.id.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_URL`;
    const affiliateEnvKey = `NEXT_PUBLIC_AFFILIATE_${slot.id.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_URL`;

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
      envKey,
      affiliateEnvKey,
      ...(aliasMap[slot.id] || [])
    ];

    for (const key of candidateKeys) {
      const val = process.env[key];
      if (val && typeof val === 'string' && val.trim() !== '') {
        return val.trim();
      }
    }

    // Optional JSON bundle of partner links: NEXT_PUBLIC_PARTNER_LINKS='{"insurance-compare":"https://..."}'
    if (process.env.NEXT_PUBLIC_PARTNER_LINKS) {
      try {
        const parsed = JSON.parse(process.env.NEXT_PUBLIC_PARTNER_LINKS);
        if (parsed && typeof parsed[slot.id] === 'string' && parsed[slot.id].trim() !== '') {
          return parsed[slot.id].trim();
        }
      } catch {
        // ignore JSON parse error
      }
    }
  }

  // Fallback to static slot configuration
  return slot.href;
}

function buildPartnerUrl(href: string, trackingParams?: Record<string, string>): string {
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

export function PartnerSlot({
  position,
  className = '',
  forceShow = false,
  slots: customSlots
}: PartnerSlotProps) {
  // If monetization is explicitly killed via env and not forced, render nothing
  if (process.env.NEXT_PUBLIC_ENABLE_MONETIZATION === 'false' && !forceShow) {
    return null;
  }

  const sourceSlots = customSlots || (partnerSlotsData as PartnerSlotConfig[]);

  // Filter slots for the target position and resolve their effective URL from env/config
  const configuredSlots = sourceSlots
    .filter((slot) => slot.position === position)
    .map((slot) => ({
      ...slot,
      resolvedHref: getSlotHref(slot)
    }))
    // Hide slots everywhere unless a real destination URL is configured (render nothing if missing or '#')
    .filter((slot) => isValidRealUrl(slot.resolvedHref));

  // If no slots have a real URL configured, render nothing
  if (configuredSlots.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {configuredSlots.map((slot) => {
        const destinationUrl = buildPartnerUrl(slot.resolvedHref || '', slot.trackingParams);
        if (!isValidRealUrl(destinationUrl)) return null;
        const isExternal = destinationUrl.startsWith('http://') || destinationUrl.startsWith('https://');

        return (
          <div
            key={slot.id}
            className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-indigo-50/40 p-5 shadow-sm transition-all duration-200 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:from-slate-900/60 dark:to-indigo-950/20"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
                {slot.badge || 'Sponsored Partner'}
              </span>
              <span className="text-[11px] font-medium text-slate-400">Sponsored Link</span>
            </div>

            <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              {slot.headline}
            </h3>

            <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {slot.description}
            </p>

            <div className="mt-4">
              <a
                href={destinationUrl}
                rel="sponsored nofollow"
                target={isExternal ? '_blank' : undefined}
                className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                <span>{slot.ctaText}</span>
                <svg
                  className="ml-1.5 h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}

