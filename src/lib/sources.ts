import sourceLinkStatus from '@/config/sourceLinkStatus.json';
import { StateRule } from './types';

/** Source URLs confirmed dead or unreachable in the last link check (see sourceLinkStatus.json). */
const HIDDEN_SOURCES = new Set(sourceLinkStatus.hidden.map((entry) => entry.url));

export interface SourceLink {
  url: string;
  /** Short display label: hostname without "www.", plus the page name when there is one. */
  label: string;
}

/** e.g. https://mva.maryland.gov/title-registration/fees-payment-options -> "mva.maryland.gov: fees payment options" */
export function labelForSource(url: string): string {
  try {
    const { hostname, pathname } = new URL(url);
    const host = hostname.replace(/^www\./, '');
    const segments = pathname.split('/').filter(Boolean);
    let page = segments[segments.length - 1] ?? '';
    if (/^(default|index)\.\w+$/i.test(page) || page.toLowerCase() === 'download') page = segments[segments.length - 2] ?? '';
    page = decodeURIComponent(page).replace(/\.\w+$/, '').replace(/[-_]+/g, ' ').trim();
    return page ? `${host}: ${page}` : host;
  } catch {
    return url;
  }
}

/** A state's official sources, minus links known to be dead. */
export function getVisibleSources(rule: StateRule): SourceLink[] {
  return rule.sources.filter((url) => !HIDDEN_SOURCES.has(url)).map((url) => ({ url, label: labelForSource(url) }));
}
