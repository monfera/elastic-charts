import { createSelector } from 'reselect';
import { computeChartTransform, Transform } from '../utils';
import { computeChartDimensionsSelector } from './compute_chart_dimensions';
import { getSettingsSpecSelector } from 'store/selectors/get_settings_specs';

export const computeChartTransformSelector = createSelector(
  [computeChartDimensionsSelector, getSettingsSpecSelector],
  (chartDimensions, settingsSpecs): Transform => {
    console.log('--- 7 computeChartTransformSelector ---');
    return computeChartTransform(chartDimensions, settingsSpecs.rotation);
  },
);
