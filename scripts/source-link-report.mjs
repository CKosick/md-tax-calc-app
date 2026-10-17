// Regenerates docs/source-link-report-<checkedOn>.md from src/config/sourceLinkStatus.json and
// src/config/stateRules.json. Run after each source-link repair batch:
//   node scripts/source-link-report.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const rules = JSON.parse(readFileSync(new URL('../src/config/stateRules.json', import.meta.url), 'utf8'));
const status = JSON.parse(readFileSync(new URL('../src/config/sourceLinkStatus.json', import.meta.url), 'utf8'));

const label = (state) => rules[state].label;
const byLabel = (a, b) => label(a).localeCompare(label(b));
const hidden = new Set(status.hidden.map((h) => h.url));
const totalLinks = Object.values(rules).reduce((n, r) => n + r.sources.length, 0);
const noneLeft = Object.keys(rules).filter((k) => rules[k].sources.every((u) => hidden.has(u))).sort(byLabel);
const partial = Object.keys(rules).filter((k) => !noneLeft.includes(k) && rules[k].sources.some((u) => hidden.has(u)));
const reverified = Object.keys(rules).filter((k) => rules[k].lastVerified !== 'September 2026').sort(byLabel);
const repaired = status.repaired ?? [];

let md = `# CarTaxHub source link report (${status.checkedOn})\n\n`;
md += 'Every state source URL in `src/config/stateRules.json` was checked. This report is generated from `src/config/sourceLinkStatus.json` (by `scripts/source-link-report.mjs`), which is also what the site uses to hide dead links.\n\n';
md += `**Method:** ${status.method}\n\n`;
md += '## Summary\n\n';
md += `- Source links configured now: ${totalLinks} across 51 jurisdictions\n`;
md += `- Hidden on the site (dead or unreachable): ${status.hidden.length}\n`;
md += `- Working but only an agency homepage, not a specific page: ${status.homepageOnly.length}\n`;
md += `- States showing no source link ("Official source links ... are being updated"): ${noneLeft.length}\n`;
md += `- States with some links hidden: ${partial.length}\n`;
md += `- States re-verified since the check: ${reverified.map((k) => `${label(k)} (${rules[k].lastVerified})`).join(', ') || 'none'}\n\n`;
md += 'All other states keep their September 2026 verified date until their rates are re-checked in a repair batch.\n\n';

if (repaired.length) {
  md += '## Repaired\n\n| State | Repaired on | What changed |\n|---|---|---|\n';
  for (const r of repaired) md += `| ${label(r.state)} | ${r.on} | ${r.note} |\n`;
  md += '\n';
}

md += `## Priority: states with no working source link\n\n${noneLeft.map((k) => `- ${label(k)}`).join('\n')}\n\n`;

md += '## Hidden links by state\n\n| State | URL | What the browser showed |\n|---|---|---|\n';
for (const h of [...status.hidden].sort((a, b) => byLabel(a.state, b.state))) md += `| ${label(h.state)} | ${h.url} | ${h.finding} |\n`;

md += '\n## Working, but homepage only (replace with a specific page when convenient)\n\n| State | URL | Note |\n|---|---|---|\n';
for (const h of [...status.homepageOnly].sort((a, b) => byLabel(a.state, b.state))) md += `| ${label(h.state)} | ${h.url} | ${h.finding} |\n`;

md += '\n## Repairing a state\n\n';
md += '1. Find the current official page(s) for the state\'s tax rate and title/registration fees, and confirm they load in a real browser.\n';
md += '2. Re-check every configured number for the state in `stateRules.json` (rates, minimums, fees, registration tiers, surcharges, FAQ and disclaimer text) and fix anything that changed.\n';
md += '3. Replace the dead or homepage-only URLs in that state\'s `sources`, remove its entries from `sourceLinkStatus.json` (`hidden` / `homepageOnly`), add a `repaired` entry, and set its `lastVerified` to the month of the re-check only if the re-check completed.\n';
md += '4. Run `node scripts/source-link-report.mjs`.\n';

const out = new URL(`../docs/source-link-report-${status.checkedOn}.md`, import.meta.url);
writeFileSync(out, md);
console.log(`wrote ${out.pathname}`);
