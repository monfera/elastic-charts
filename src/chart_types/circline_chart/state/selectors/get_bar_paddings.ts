import createCachedSelector from 're-reselect';
import { getChartThemeSelector } from '../../../../state/selectors/get_chart_theme';

export const getBarPaddingsSelector = createCachedSelector(
  [getChartThemeSelector],
  (chartTheme): number => {
    return chartTheme.scales.barsPadding;
  },
)((state) => state.chartId);
