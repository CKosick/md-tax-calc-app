'use client';

import React from 'react';
import partnerSlotsData from '@/config/partnerSlots.json';
import { PartnerSlotConfig } from '@/lib/types';

interface PartnerSlotProps {
  position: 'below-results' | 'sidebar';
  className?: string;
}

function buildPartnerUrl(href: string, trackingParams?: Record<string, string>): string {
  if (!href || href === '#' || !trackingParams) {
    return href || '#';
  }
  try {
    const url = new URL(href, 'https://example.com');
    Object.entries(trackingParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    // Return relative or absolute based on input
    if (href.startsWith('http://') || href.startsWith('https://')) {
      return url.toString();
    }
    return url.pathname + url.search + url.hash;
  } catch {
    return href;
  }
}

export function PartnerSlot({ position, className = '' }: PartnerSlotProps) {
  const slots = (partnerSlotsData as PartnerSlotConfig[]).filter(
    (slot) => slot.position === position
  );

  if (slots.length === 0) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      {slots.map((slot) => {
        const destinationUrl = buildPartnerUrl(slot.href, slot.trackingParams);
        const isExternal = slot.href.startsWith('http://') || slot.href.startsWith('https://');

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
