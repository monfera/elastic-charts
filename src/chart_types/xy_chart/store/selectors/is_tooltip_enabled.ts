import { createSelector } from 'reselect';
import { computeSeriesGeometriesSelector } from './compute_series_geometries';
import { getTooltipSnapSelector } from './get_tooltip_snap';

export const isTooltipEnabledSelector = createSelector(
  [computeSeriesGeometriesSelector, getTooltipSnapSelector],
  (seriesGeometries, tooltipSnap): boolean => {
    const { xScale } = seriesGeometries.scales;
    return (xScale && xScale.bandwidth > 0) || tooltipSnap;
  },
);
