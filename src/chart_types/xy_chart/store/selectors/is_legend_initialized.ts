import { computeLegendSelector } from './compute_legend';
import { createSelector } from 'reselect';

export const isLegendInitializedSelector = createSelector(
  [computeLegendSelector],
  (legendItems): boolean => {
    return legendItems.size > 0;
  },
);
