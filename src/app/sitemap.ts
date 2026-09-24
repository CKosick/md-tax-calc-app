import { MetadataRoute } from 'next';
import stateRulesData from '@/config/stateRules.json';
import { StateRulesConfig } from '@/lib/types';

const rules = stateRulesData as StateRulesConfig;
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cartaxhub.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // Root, hub, and comparison index pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0
    },
    {
      url: `${BASE_URL}/calculator`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/vehicle-tax-by-state`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6
    }
  ];

  // Dynamic state calculator routes (all 51 jurisdictions normalized to 0.8)
  const stateRoutes: MetadataRoute.Sitemap = Object.values(rules).map((rule) => ({
    url: `${BASE_URL}/calculator/${rule.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  return [...staticRoutes, ...stateRoutes];
}
