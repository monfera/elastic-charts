import { createSelector } from 'reselect';
import { computeSeriesGeometries, ComputedScales } from '../utils';

export const getComputedScalesSelector = createSelector(
  [computeSeriesGeometries],
  (geometries): ComputedScales => {
    return geometries.scales;
  },
);
