import { createSelector } from 'reselect';
import { computeBrushExtent, BrushExtent } from '../utils';
import { computeChartDimensionsSelector } from './compute_chart_dimensions';
import { getSettingsSpecSelector } from 'store/selectors/get_settings_specs';
import { computeChartTransformSelector } from './compute_chart_transform';

export const computeBrushExtentSelector = createSelector(
  [computeChartDimensionsSelector, computeChartTransformSelector, getSettingsSpecSelector],
  (chartDimensions, chartTransform, settingsSpecs): BrushExtent => {
    console.log('--- 8 computeBrushExtentSelector ---');
    return computeBrushExtent(chartDimensions, settingsSpecs.rotation, chartTransform);
  },
);
