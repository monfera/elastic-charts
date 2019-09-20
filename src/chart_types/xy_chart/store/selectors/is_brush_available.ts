import createCachedSelector from 're-reselect';
import { getSettingsSpecSelector } from '../../../../store/selectors/get_settings_specs';
import { getComputedScalesSelector } from '../../../../chart_types/xy_chart/store/selectors/get_computed_scales';
import { ScaleType } from '../../../../utils/scales/scales';

/**
 * The brush is available only for Ordinal xScales charts and
 * if we have configured an onBrushEnd listener
 */
export const isBrushAvailableSelector = createCachedSelector(
  [getSettingsSpecSelector, getComputedScalesSelector],
  (settingsSpec, scales): boolean => {
    if (!scales.xScale) {
      return false;
    }
    return scales.xScale.type !== ScaleType.Ordinal && Boolean(settingsSpec.onBrushEnd);
  },
)((state) => state.chartId);
