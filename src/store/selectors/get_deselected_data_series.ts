import { createSelector } from 'reselect';
import { DataSeriesColorsValues } from '../../chart_types/xy_chart/utils/series';

export const getDeselectedDataSeries = createSelector(
  [],
  (): DataSeriesColorsValues[] => {
    return [];
  },
);
