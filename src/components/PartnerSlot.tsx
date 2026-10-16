'use client';

import React from 'react';
import { track } from '@vercel/analytics';
import partnerSlotsData from '@/config/partnerSlots.json';
import { PartnerSlotConfig } from '@/lib/types';
import { PartnerHrefs, buildPartnerUrl, isValidRealUrl } from '@/lib/partnerLinks';

interface PartnerSlotProps {
  position: 'below-results' | 'sidebar';
  className?: string;
  forceShow?: boolean;
  slots?: PartnerSlotConfig[];
  /** Destination URLs resolved server-side by resolvePartnerHrefs(), keyed by slot id. */
  hrefs?: PartnerHrefs;
  /** Whether the user checked "financed"; slots with requiresFinancing stay hidden until then. */
  isFinanced?: boolean;
  /** State calculator slug, reported with partner click events. */
  stateSlug?: string;
}

type GtagWindow = Window & { gtag?: (...args: unknown[]) => void };

/**
 * Records a partner click in Vercel Analytics (and GA4 when gtag is loaded).
 * Never throws, so analytics failures cannot block navigation.
 */
export function trackPartnerClick(slotId: string, stateSlug?: string): void {
  const properties = { slot: slotId, state: stateSlug ?? 'unknown' };
  try {
    track('partner_click', properties);
  } catch {
    // analytics must never break the outbound link
  }
  try {
    const gtag = typeof window !== 'undefined' ? (window as GtagWindow).gtag : undefined;
    if (typeof gtag === 'function') {
      gtag('event', 'partner_click', properties);
    }
  } catch {
    // ignore
  }
}

interface VisibleSlotOptions {
  position?: PartnerSlotProps['position'];
  forceShow?: boolean;
  slots?: PartnerSlotConfig[];
  hrefs?: PartnerHrefs;
  isFinanced?: boolean;
}

/**
 * Partner slots that will actually render, with their destination URLs. Shared by PartnerSlot
 * and the results disclosure line so the two always agree. Omit position to check every slot.
 */
export function getVisiblePartnerSlots({
  position,
  forceShow = false,
  slots: customSlots,
  hrefs = {},
  isFinanced = false
}: VisibleSlotOptions) {
  // If monetization is explicitly killed via env and not forced, nothing renders
  if (process.env.NEXT_PUBLIC_ENABLE_MONETIZATION === 'false' && !forceShow) {
    return [];
  }

  const sourceSlots = customSlots || (partnerSlotsData as PartnerSlotConfig[]);

  // Filter slots for the target position and pick their server-resolved URL.
  // A static href in the slot config is identical on server and client, so it is a safe fallback.
  return sourceSlots
    .filter((slot) => position === undefined || slot.position === position)
    .filter((slot) => forceShow || !slot.requiresFinancing || isFinanced)
    .map((slot) => ({
      ...slot,
      destinationUrl: hrefs[slot.id] ?? buildPartnerUrl(slot.href, slot.trackingParams)
    }))
    // Hide slots everywhere unless a real destination URL is configured (render nothing if missing or '#')
    .filter((slot) => isValidRealUrl(slot.destinationUrl));
}

export function PartnerSlot({
  position,
  className = '',
  forceShow = false,
  slots,
  hrefs,
  isFinanced,
  stateSlug
}: PartnerSlotProps) {
  const configuredSlots = getVisiblePartnerSlots({ position, forceShow, slots, hrefs, isFinanced });

  // If no slots have a real URL configured, render nothing
  if (configuredSlots.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {configuredSlots.map((slot) => {
        const destinationUrl = slot.destinationUrl;
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
                onClick={() => trackPartnerClick(slot.id, stateSlug)}
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

