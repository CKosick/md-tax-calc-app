import stateRulesData from '@/config/stateRules.json';
import { StateRulesConfig } from './types';

export interface StateOption {
  key: string;
  label: string;
  slug: string;
}

/**
 * Every state's key, label, and slug, sorted by label. Call it on the server and pass the list to
 * client components, so the browser does not download the full stateRules.json.
 */
export function getStateOptions(): StateOption[] {
  return Object.entries(stateRulesData as StateRulesConfig)
    .map(([key, rule]) => ({ key, label: rule.label, slug: rule.slug }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
