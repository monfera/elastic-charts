import { createSelector } from 'reselect';
import { IndexedGeometry } from '../../../../utils/geometry';
import { computeSeriesGeometriesSelector } from './compute_series_geometries';

export const getGeometriesIndexSelector = createSelector(
  [computeSeriesGeometriesSelector],
  (geometries): Map<any, IndexedGeometry[]> => {
    return geometries.geometriesIndex;
  },
);
