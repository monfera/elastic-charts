import { Dimensions } from 'utils/dimensions';
import { createSelector } from 'reselect';
import { computeCursorPositionSelector } from './compute_cursor_position';
import { Point } from 'utils/point';
import { getValidXPosition, getValidYPosition } from '../../utils/interactions';
import { SettingsSpec } from '../../../../specs/settings';
import { getSettingsSpecSelector } from 'store/selectors/get_settings_specs';
import { computeChartDimensionsSelector } from './compute_chart_dimensions';

export const getAxisCursorPositionSelector = createSelector(
  [computeCursorPositionSelector, computeChartDimensionsSelector, getSettingsSpecSelector],
  getAxisCursorPosition,
);

function getAxisCursorPosition(cursorPosition: Point, chartDimensions: Dimensions, settingsSpec: SettingsSpec): Point {
  const xPos = cursorPosition.x;
  const yPos = cursorPosition.y;
  // get the cursor position depending on the chart rotation
  const x = getValidXPosition(xPos, yPos, settingsSpec.rotation, chartDimensions);
  const y = getValidYPosition(xPos, yPos, settingsSpec.rotation, chartDimensions);
  return {
    x,
    y,
  };
}
