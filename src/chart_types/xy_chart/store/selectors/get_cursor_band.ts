import { Dimensions } from 'utils/dimensions';
import { createSelector } from 'reselect';
import { Point } from '../chart_state';
import { Scale } from '../../../../utils/scales/scales';
import { isLineAreaOnlyChart } from '../utils';
import { getCursorBandPosition } from '../../crosshair/crosshair_utils';
import { SettingsSpec } from '../../../../specs/settings';
import { getSettingsSpecSelector } from 'store/selectors/get_settings_specs';
import { getGeometriesIndexKeysSelector } from './get_geometries_index_keys';
import { computeChartDimensionsSelector } from './compute_chart_dimensions';
import { BasicSeriesSpec } from 'chart_types/xy_chart/utils/specs';
import { countBarsInClusterSelector } from './count_bars_in_cluster';
import { getSeriesSpecsSelector } from './get_specs';
import { computeSeriesGeometriesSelector } from './compute_series_geometries';
import { getAxisCursorPositionSelector } from './get_axis_cursor_position';
import { isTooltipSnapEnableSelector } from './is_tooltip_snap_enabled';

export const getCursorBandPositionSelector = createSelector(
  [
    getAxisCursorPositionSelector,
    computeChartDimensionsSelector,
    getSettingsSpecSelector,
    computeSeriesGeometriesSelector,
    getGeometriesIndexKeysSelector,
    getSeriesSpecsSelector,
    countBarsInClusterSelector,
    isTooltipSnapEnableSelector,
  ],
  (
    axisCursorPosition,
    chartDimensions,
    settingsSpec,
    seriesGeometries,
    geometriesIndexKeys,
    seriesSpec,
    totalBarsInCluster,
    isTooltipSnapEnabled,
  ) => {
    return getCursorBand(
      axisCursorPosition,
      chartDimensions,
      settingsSpec,
      seriesGeometries.scales.xScale,
      geometriesIndexKeys,
      seriesSpec,
      totalBarsInCluster,
      isTooltipSnapEnabled,
    );
  },
);

function getCursorBand(
  axisCursorPosition: Point,
  chartDimensions: Dimensions,
  settingsSpec: SettingsSpec,
  xScale: Scale | undefined,
  geometriesIndexKeys: any[],
  seriesSpecs: BasicSeriesSpec[],
  totalBarsInCluster: number,
  isTooltipSnapEnabled: boolean,
) {
  // update che cursorBandPosition based on chart configuration
  const isLineAreaOnly = isLineAreaOnlyChart(seriesSpecs);
  if (!xScale) {
    return;
  }
  return getCursorBandPosition(
    settingsSpec.rotation,
    chartDimensions,
    axisCursorPosition,
    isTooltipSnapEnabled,
    xScale,
    geometriesIndexKeys,
    isLineAreaOnly ? 1 : totalBarsInCluster,
  );
}
