import { MetadataRoute } from 'next';
import stateRulesData from '@/config/stateRules.json';
import { StateRulesConfig } from '@/lib/types';

const rules = stateRulesData as StateRulesConfig;
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://md-tax-calc-app.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // Root and hub index pages
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
    }
  ];

  // Dynamic state calculator routes
  const stateRoutes: MetadataRoute.Sitemap = Object.values(rules).map((rule) => ({
    url: `${BASE_URL}/calculator/${rule.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: rule.slug.startsWith('maryland') ? 1.0 : 0.9
  }));

  return [...staticRoutes, ...stateRoutes];
}
