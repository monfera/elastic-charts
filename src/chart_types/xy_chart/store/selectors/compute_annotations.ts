import { createSelector } from 'reselect';
import { getSettingsSpecSelector } from 'store/selectors/get_settings_specs';
import { getAxisSpecsSelector, getAnnotationSpecsSelector } from './get_specs';
import { computeChartDimensionsSelector } from './compute_chart_dimensions';
import { countBarsInClusterSelector } from './count_bars_in_cluster';
import { isHistogramModeEnabledSelector } from './is_histogram_mode_enabled';
import { computeAnnotationDimensions } from '../../annotations/annotation_utils';
import { computeSeriesGeometries } from '../utils';

export const computeAnnotationDimensionsSelector = createSelector(
  [
    getAnnotationSpecsSelector,
    computeChartDimensionsSelector,
    getSettingsSpecSelector,
    computeSeriesGeometries,
    getAxisSpecsSelector,
    countBarsInClusterSelector,
    isHistogramModeEnabledSelector,
    getAxisSpecsSelector,
  ],
  (
    annotationSpecs,
    chartDimensions,
    settingsSpec,
    seriesGeometries,
    axesSpecs,
    totalBarsInCluster,
    isHistogramMode,
  ) => {
    console.log('--- 11 computeAnnotationDimensionsSelector ---');
    const { yScales, xScale } = seriesGeometries.scales;
    return computeAnnotationDimensions(
      annotationSpecs,
      chartDimensions,
      settingsSpec.rotation,
      yScales,
      xScale,
      axesSpecs,
      totalBarsInCluster,
      isHistogramMode,
    );
  },
);
