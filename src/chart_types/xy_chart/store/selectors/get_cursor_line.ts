import { createSelector } from 'reselect';
import { getCursorLinePosition } from '../../crosshair/crosshair_utils';
import { getSettingsSpecSelector } from 'store/selectors/get_settings_specs';
import { computeChartDimensionsSelector } from './compute_chart_dimensions';
import { computeCursorPositionSelector } from './compute_cursor_position';

export const getCursorLinePositionSelector = createSelector(
  [computeChartDimensionsSelector, getSettingsSpecSelector, computeCursorPositionSelector],
  (chartDimensions, settingsSpec, cursorPosition) => {
    return getCursorLinePosition(settingsSpec.rotation, chartDimensions.chartDimensions, cursorPosition);
  },
);
