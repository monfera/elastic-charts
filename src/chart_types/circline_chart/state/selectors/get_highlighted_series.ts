import createCachedSelector from 're-reselect';
import { GlobalChartState } from '../../../../state/chart_state';
import { computeLegendSelector } from './compute_legend';
import { LegendItem } from '../../../../chart_types/xy_chart/legend/legend';

const getHighlightedLegendItemKey = (state: GlobalChartState) => state.interactions.highlightedLegendItemKey;

export const getHighlightedSeriesSelector = createCachedSelector(
  [getHighlightedLegendItemKey, computeLegendSelector],
  (highlightedLegendItemKey, legendItems): LegendItem | undefined => {
    if (!highlightedLegendItemKey) {
      return undefined;
    }
    return legendItems.get(highlightedLegendItemKey);
  },
)((state) => state.chartId);
