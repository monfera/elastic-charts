import { createSelector } from 'reselect';
import { getSettingsSpecSelector } from 'store/selectors/get_settings_specs';
import { computeSeriesGeometriesSelector } from './compute_series_geometries';
// import { isChartAnimatable } from '../utils';

export const isChartAnimatableSelector = createSelector(
  [computeSeriesGeometriesSelector, getSettingsSpecSelector],
  (seriesGeometries, settingsSpec) => {
    console.log('--- 13 isChartAnimatableSelector ---');
    // const { geometriesCounts } = seriesGeometries;
    // temporary disabled until
    // https://github.com/elastic/elastic-charts/issues/89 and https://github.com/elastic/elastic-charts/issues/41
    // return isChartAnimatable(geometriesCounts, settingsSpec.animateData);
    return false;
  },
);
