import { createSelector } from 'reselect';
import { isAllSeriesDeselected } from '../utils';
import { computeLegendSelector } from './compute_legend';
export const isChartEmptySelector = createSelector(
  [computeLegendSelector],
  (legendItems): boolean => {
    return isAllSeriesDeselected(legendItems);
  },
);
