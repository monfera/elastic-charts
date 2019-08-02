import { createSelector } from 'reselect';
import { computeSeriesGeometries } from '../utils';
import { IndexedGeometry } from '../../../../utils/geometry';

export const getGeometriesIndexSelector = createSelector(
  [computeSeriesGeometries],
  (geometries): Map<any, IndexedGeometry[]> => {
    return geometries.geometriesIndex;
  },
);
