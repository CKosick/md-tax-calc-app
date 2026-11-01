import datedFigures from '@/config/datedFigures.json';

/**
 * Figures in stateRules.json that are only correct until a known date (quarterly local rate
 * charts, fees set for a fiscal year). Each entry names the state, the figure, the first day it
 * is stale, and text that must still appear in the state's rules so the entry stays tied to it.
 */
export interface DatedFigure {
  state: string;
  figure: string;
  /** First day the figure is out of date (YYYY-MM-DD). */
  staleOn: string;
  /** Text from the state's rules that shows the figure is still in place. */
  contains: string;
  /** Other places to update with it. */
  alsoCheck?: string;
}

export const DATED_FIGURES: DatedFigure[] = datedFigures;

/** Figures that are stale on the given day. */
export function staleFigures(today: Date = new Date(), figures: DatedFigure[] = DATED_FIGURES): DatedFigure[] {
  const day = today.toISOString().slice(0, 10);
  return figures.filter((f) => day >= f.staleOn);
}
