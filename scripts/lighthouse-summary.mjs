// Summarizes saved Lighthouse JSON reports: category scores, key metrics, and the failing audits
// with the largest estimated savings. Usage: node scripts/lighthouse-summary.mjs <dir> [prefix]
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const [dir, prefix = ''] = process.argv.slice(2);
const files = readdirSync(dir).filter((f) => f.startsWith(prefix) && f.endsWith('.report.json')).sort();

for (const file of files) {
  const r = JSON.parse(readFileSync(join(dir, file), 'utf8'));
  const c = r.categories;
  const score = (k) => Math.round((c[k]?.score ?? 0) * 100);
  const a = r.audits;
  const metric = (id) => a[id]?.displayValue ?? '-';
  console.log(
    `${file.replace('.report.json', '')}: perf ${score('performance')} | a11y ${score('accessibility')} | bp ${score('best-practices')} | seo ${score('seo')}` +
      ` | FCP ${metric('first-contentful-paint')} LCP ${metric('largest-contentful-paint')} TBT ${metric('total-blocking-time')} CLS ${metric('cumulative-layout-shift')} SI ${metric('speed-index')}`
  );
  const failing = Object.values(a)
    .filter((x) => x.score !== null && x.score < 0.9 && x.scoreDisplayMode !== 'informative' && x.scoreDisplayMode !== 'notApplicable' && x.scoreDisplayMode !== 'manual')
    .map((x) => ({
      id: x.id,
      score: x.score,
      ms: x.metricSavings?.LCP ?? x.metricSavings?.FCP ?? x.metricSavings?.TBT ?? 0,
      display: x.displayValue ?? ''
    }))
    .sort((p, q) => q.ms - p.ms || p.score - q.score);
  for (const f of failing.slice(0, 12)) console.log(`    - ${f.id} (score ${f.score})${f.ms ? ` est. ${f.ms}ms` : ''} ${f.display}`);
}
