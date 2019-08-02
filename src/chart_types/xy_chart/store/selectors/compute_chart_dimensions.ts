import { createSelector } from 'reselect';
import { getChartThemeSelector } from 'store/selectors/get_chart_theme';
import { getAxisSpecsSelector } from './get_specs';
import { computeChartDimensions } from 'chart_types/xy_chart/utils/dimensions';
import { IChartState } from 'store/chart_store';
import { computeAxisTicksDimensionsSelector } from './compute_axis_ticks_dimensions';
import { Dimensions } from 'utils/dimensions';
import { getSettingsSpecSelector } from 'store/selectors/get_settings_specs';
import { isLegendVisibleSelector } from './is_legend_visible';

const getParentDimension = (state: IChartState) => state.settings.parentDimensions;

export const computeChartDimensionsSelector = createSelector(
  [
    getParentDimension,
    getChartThemeSelector,
    computeAxisTicksDimensionsSelector,
    getAxisSpecsSelector,
    getSettingsSpecSelector,
    isLegendVisibleSelector,
  ],
  (parentDimensions, chartTheme, axesTicksDimensions, axesSpecs, settingsSpecs, isLegendVisible): Dimensions => {
    console.log('--- 6 computeChartDimensions ---');
    return computeChartDimensions(
      parentDimensions,
      chartTheme,
      axesTicksDimensions,
      axesSpecs,
      isLegendVisible,
      settingsSpecs.legendPosition,
    );
  },
);
