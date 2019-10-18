import createCachedSelector from 're-reselect';
import { getSettingsSpecSelector } from '../../../../state/selectors/get_settings_specs';
import { getAxisSpecsSelector } from './get_specs';
import { getAxisTicksPositions, AxisTick, AxisLinePosition } from '../../utils/axis_utils';
import { computeChartDimensionsSelector } from './compute_chart_dimensions';
import { getChartThemeSelector } from '../../../../state/selectors/get_chart_theme';
import { isLegendVisibleSelector } from './is_legend_visible';
import { computeAxisTicksDimensionsSelector } from './compute_axis_ticks_dimensions';
import { computeSeriesDomainsSelector } from './compute_series_domains';
import { countBarsInClusterSelector } from './count_bars_in_cluster';
import { getBarPaddingsSelector } from './get_bar_paddings';
import { AxisId } from '../../../../utils/ids';
import { Dimensions } from '../../../../utils/dimensions';

interface AxisVisibleTicks {
  axisPositions: Map<AxisId, Dimensions>;
  axisTicks: Map<AxisId, AxisTick[]>;
  axisVisibleTicks: Map<AxisId, AxisTick[]>;
  axisGridLinesPositions: Map<AxisId, AxisLinePosition[]>;
}
export const computeAxisVisibleTicksSelector = createCachedSelector(
  [
    computeChartDimensionsSelector,
    getChartThemeSelector,
    getSettingsSpecSelector,
    isLegendVisibleSelector,
    getAxisSpecsSelector,
    computeAxisTicksDimensionsSelector,
    computeSeriesDomainsSelector,
    countBarsInClusterSelector,
    getBarPaddingsSelector,
  ],
  (
    chartDimensions,
    chartTheme,
    settingsSpec,
    isLegendVisible,
    axesSpecs,
    axesTicksDimensions,
    seriesDomainsAndData,
    totalBarsInCluster,
    barsPadding,
  ): AxisVisibleTicks => {
    // console.log('--- 10 computeAxisVisibleTicksSelector ---');
    const { xDomain, yDomain } = seriesDomainsAndData;
    return getAxisTicksPositions(
      chartDimensions,
      chartTheme,
      settingsSpec.rotation,
      axesSpecs,
      axesTicksDimensions,
      xDomain,
      yDomain,
      totalBarsInCluster,
      barsPadding,
    );
  },
)((state) => state.chartId);
