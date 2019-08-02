import { createSelector } from 'reselect';
import { isHistogramModeEnabledSelector } from './is_histogram_mode_enabled';
import { getChartThemeSelector } from 'store/selectors/get_chart_theme';

export const getBarPaddingsSelector = createSelector(
  [isHistogramModeEnabledSelector, getChartThemeSelector],
  (isHistogramMode, chartTheme): number => {
    return isHistogramMode ? chartTheme.scales.histogramPadding : chartTheme.scales.barsPadding;
  },
);
