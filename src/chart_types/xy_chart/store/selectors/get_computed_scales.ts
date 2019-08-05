import { createSelector } from 'reselect';
import { ComputedScales } from '../utils';
import { computeSeriesGeometriesSelector } from './compute_series_geometries';

export const getComputedScalesSelector = createSelector(
  [computeSeriesGeometriesSelector],
  (geometries): ComputedScales => {
    return geometries.scales;
  },
);
