import { createSelector } from 'reselect';
import { LegendItem } from 'chart_types/xy_chart/legend/legend';
import { IChartState } from 'store/chart_store';
import { computeLegendSelector } from './compute_legend';

const getHighlightedLegendItemKey = (state: IChartState) => state.interactions.highlightedLegendItemKey;

export const getHighlightedSeriesSelector = createSelector(
  [getHighlightedLegendItemKey, computeLegendSelector],
  (highlightedLegendItemKey, legendItems): LegendItem | undefined => {
    if (!highlightedLegendItemKey) {
      return undefined;
    }
    return legendItems.get(highlightedLegendItemKey);
  },
);
