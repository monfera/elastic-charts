import { createSelector } from 'reselect';
import { computeSeriesGeometriesSelector } from './compute_series_geometries';

export const isTooltipEnabledSelector = createSelector(
  [computeSeriesGeometriesSelector],
  (seriesGeometries, tooltipSnap): boolean => {
    const { xScale } = seriesGeometries;
    return (xScale && xScale.bandwidth > 0) || tooltipSnap;
  },
);
function getAxisCursorPosition(xScale: Scale, tooltipSnap: boolean) {}
