import { createSelector } from 'reselect';
import { TooltipType, TooltipValue, isTooltipType, isTooltipProps } from '../../utils/interactions';
import { Point } from '../chart_state';
import { IChartState } from 'store/chart_store';
import { getSettingsSpecSelector } from 'store/selectors/get_settings_specs';
import { computeCursorPositionSelector } from './compute_cursor_position';
import { getTooltipValuesSelector } from './get_tooltip_values_highlighted_geoms';

const isBrushing = (state: IChartState) => state.interactions.isBrushing;

const getTooltipType = (state: IChartState): TooltipType | undefined => {
  const tooltip = getSettingsSpecSelector(state).tooltip;
  if (!tooltip) {
    return undefined;
  }
  if (isTooltipType(tooltip)) {
    return tooltip;
  }
  if (isTooltipProps(tooltip)) {
    return tooltip.type;
  }
};

export const isTooltipVisibleSelector = createSelector(
  [isBrushing, getTooltipType, computeCursorPositionSelector, getTooltipValuesSelector],
  isTooltipVisible,
);

function isTooltipVisible(
  isBrushing: boolean,
  tooltipType: TooltipType | undefined,
  cursorPosition: Point,
  tooltipValues: TooltipValue[],
) {
  return (
    !isBrushing &&
    tooltipType !== TooltipType.None &&
    cursorPosition.x > -1 &&
    cursorPosition.y > -1 &&
    tooltipValues.length > 0
  );
}
