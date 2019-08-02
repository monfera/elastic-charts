import { createSelector } from 'reselect';
import { getSeriesSpecsSelector } from './get_specs';
import { isHistogramModeEnabled } from '../utils';

export const isHistogramModeEnabledSelector = createSelector(
  [getSeriesSpecsSelector],
  (seriesSpecs): boolean => {
    return isHistogramModeEnabled(seriesSpecs);
  },
);
