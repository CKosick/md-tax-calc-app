import sourceLinkStatus from '@/config/sourceLinkStatus.json';
import { StateRule } from './types';

/** Source URLs confirmed dead or unreachable in the last link check (see sourceLinkStatus.json). */
const HIDDEN_SOURCES = new Set(sourceLinkStatus.hidden.map((entry) => entry.url));

export interface SourceLink {
  url: string;
  /** Short display label: hostname without "www.", plus the page name when there is one. */
  label: string;
}

/** Formats the pattern's match in text, or undefined when it does not match. */
const cite = (text: string | null | undefined, pattern: RegExp, format: (m: RegExpMatchArray) => string) => {
  const m = (text ?? '').match(pattern);
  return m ? format(m) : undefined;
};

/** Kentucky Legislative Research Commission statute document ids -> citation (versions in force November 2026). */
const KY_STATUTE_IDS: Record<string, string> = {
  '55787': 'KRS 138.475',
  '56142': 'KRS 186.040',
  '56307': 'KRS 186.050',
  '57720': 'KRS 64.012',
  '57802': 'KRS 186A.130'
};

/**
 * Statute and code links get the citation as their page name, since their URLs end in codes
 * like "02003" or a query string: https://www.azleg.gov/ars/28/02003.htm -> "A.R.S. 28-2003".
 */
const STATUTE_LABELS: { host: RegExp; label: (url: URL) => string | undefined }[] = [
  { host: /(^|\.)azleg\.gov$/, label: (u) => cite(u.pathname, /\/ars\/(\d+)\/0*(\d+)\.htm$/i, (m) => `A.R.S. ${m[1]}-${m[2]}`) },
  { host: /^app\.leg\.wa\.gov$/, label: (u) => cite(u.searchParams.get('cite'), /^([\d.]+)$/, (m) => `RCW ${m[1]}`) },
  { host: /^revisor\.mo\.gov$/, label: (u) => cite(u.searchParams.get('section'), /^([\d.]+)$/, (m) => `RSMo ${m[1]}`) },
  { host: /(^|\.)revisor\.mn\.gov$/, label: (u) => cite(u.pathname, /\/statutes\/cite\/([\d.]+)/, (m) => `Minn. Stat. ${m[1]}`) },
  { host: /(^|\.)ncleg\.gov$/, label: (u) => cite(u.pathname, /GS_([\d.-]+)\.html$/i, (m) => `N.C.G.S. ${m[1]}`) },
  { host: /^codes\.ohio\.gov$/, label: (u) => cite(u.pathname, /section-([\d.]+)$/, (m) => `Ohio Rev. Code ${m[1]}`) },
  { host: /(^|\.)legislature\.mi\.gov$/, label: (u) => cite(u.searchParams.get('objectName'), /^mcl-(\d+)-(\w+)$/i, (m) => `MCL ${m[1]}.${m[2]}`) },
  { host: /(^|\.)scstatehouse\.gov$/, label: (u) => cite(u.pathname, /\/code\/t(\d+)c0*(\d+)\.php$/i, (m) => `S.C. Code Title ${Number(m[1])}, Chapter ${m[2]}`) },
  { host: /(^|\.)cga\.ct\.gov$/, label: (u) => cite(u.pathname, /chap_0*(\d+)\.htm$/i, (m) => `Conn. Gen. Stat. Chapter ${m[1]}`) },
  { host: /^delcode\.delaware\.gov$/, label: (u) => cite(u.pathname, /title(\d+)\/c0*(\d+)/i, (m) => `Del. Code Title ${m[1]}, Chapter ${m[2]}`) },
  { host: /(^|\.)nebraskalegislature\.gov$/, label: (u) => cite(u.searchParams.get('statute'), /^([\d-]+,[\d,]+)$/, (m) => `Neb. Rev. Stat. ${m[1]}`) },
  { host: /^ksrevisor\.gov$/, label: (u) => cite(u.pathname, /\/ch(\d+)\/\d+_0*(\d+)_0*(\d+)\.html$/i, (m) => `K.S.A. ${Number(m[1])}-${m[2]}${m[3].padStart(2, '0')}`) },
  { host: /(^|\.)nmlegis\.gov$/, label: (u) => cite(u.pathname, /\/final\/SB0*(\d+)\.pdf$/i, (m) => `N.M. Laws 2026, SB ${m[1]}`) },
  { host: /^ndlegis\.gov$/, label: (u) => cite(u.pathname, /\/t(\d+)c0*(\d+)\.pdf$/i, (m) => `N.D.C.C. Chapter ${m[1]}-${m[2].padStart(2, '0')}`) },
  { host: /^legislature\.maine\.gov$/, label: (u) => cite(u.pathname, /title(\d+)sec(\d+)\.html$/i, (m) => `${m[1]} M.R.S. ${m[2]}`) },
  { host: /^law\.lis\.virginia\.gov$/, label: (u) => cite(u.pathname, /section([\d.:-]+)\/?$/i, (m) => `Va. Code ${m[1]}`) },
  { host: /^mca\.legmt\.gov$/, label: (u) => cite(u.pathname, /\/0610-0030-0050-0(\d\d)0\.html$/, (m) => `MCA 61-3-5${m[1]}`) },
  { host: /^(www\.)?wyoleg\.gov$/, label: (u) => cite(u.pathname, /compress\/title(\d+)\.pdf$/i, (m) => `Wyo. Stat. Title ${m[1]}`) ?? cite(u.pathname, /\/(\d{4})\/Enroll\/HB0*(\d+)\.pdf$/i, (m) => `${m[1]} Wyo. HB ${m[2]}`) },
  { host: /^sdlegislature\.gov$/, label: (u) => cite(u.pathname, /\/Statutes\/([\d-]+)$/i, (m) => `SDCL ${m[1]}`) },
  { host: /^legislature\.vermont\.gov$/, label: (u) => cite(u.pathname, /\/statutes\/section\/(\d+)\/\d+\/0*(\d+)$/, (m) => `${m[1]} V.S.A. ${m[2]}`) },
  { host: /(^|\.)legis\.iowa\.gov$/, label: (u) => cite(u.pathname, /\/docs\/code\/(?:\d{4}\/)?(\d+[A-Z]?)(?:\.(\d+[A-Z]?))?\.pdf$/i, (m) => (m[2] ? `Iowa Code ${m[1]}.${m[2]}` : `Iowa Code chapter ${m[1]}`)) },
  { host: /(^|\.)leg\.state\.nv\.us$/, label: (u) => cite(u.pathname, /\/(nrs|nac)-(\d+[A-Z]?)\.html$/i, (m) => `${m[1].toUpperCase()} Chapter ${m[2]}`) },
  { host: /^alison\.legislature\.state\.al\.us$/, label: (u) => cite(u.searchParams.get('section'), /^([\d-]+)$/, (m) => `Ala. Code ${m[1]}`) },
  // Kentucky statute links carry only a document id, so the cited ones are listed here
  { host: /^apps\.legislature\.ky\.gov$/, label: (u) => KY_STATUTE_IDS[u.searchParams.get('id') ?? ''] }
];

/** e.g. https://mva.maryland.gov/title-registration/fees-payment-options -> "mva.maryland.gov: fees payment options" */
export function labelForSource(url: string): string {
  try {
    const parsed = new URL(url);
    const { hostname, pathname } = parsed;
    const host = hostname.replace(/^www\./, '');
    const statute = STATUTE_LABELS.find((s) => s.host.test(hostname))?.label(parsed);
    if (statute) return `${host}: ${statute}`;
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
