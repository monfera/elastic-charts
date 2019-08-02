import { createSelector } from 'reselect';
import { computeSeriesGeometriesSelector } from './compute_series_geometries';
import { Scale } from '../../../../utils/scales/scales';
import { getTooltipSnapSelector } from './get_tooltip_snap';

export const isTooltipSnapEnableSelector = createSelector(
  [computeSeriesGeometriesSelector, getTooltipSnapSelector],
  (seriesGeometries, snap) => {
    return isTooltipSnapEnabled(seriesGeometries.scales.xScale, snap);
  },
);

function isTooltipSnapEnabled(xScale: Scale, snap: boolean) {
  return (xScale && xScale.bandwidth > 0) || snap;
}
