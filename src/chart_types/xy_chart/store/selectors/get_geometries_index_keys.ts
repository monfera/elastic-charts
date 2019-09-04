import { createSelector } from 'reselect';
import { compareByValueAsc } from '../../../../utils/commons';
import { computeSeriesGeometriesSelector } from './compute_series_geometries';

export const getGeometriesIndexKeysSelector = createSelector(
  [computeSeriesGeometriesSelector],
  (seriesGeometries): any[] => {
    return [...seriesGeometries.geometriesIndex.keys()].sort(compareByValueAsc);
  },
);
