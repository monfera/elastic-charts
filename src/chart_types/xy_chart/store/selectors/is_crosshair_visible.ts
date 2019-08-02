import { createSelector } from 'reselect';
import { TooltipType, isCrosshairTooltipType } from '../../utils/interactions';
import { Point } from '../chart_state';
import { IChartState } from 'store/chart_store';
import { computeCursorPositionSelector } from './compute_cursor_position';
import { getTooltipTypeSelector } from './get_tooltip_type';

const isBrushing = (state: IChartState) => state.interactions.isBrushing;

export const isCrosshairVisibleSelector = createSelector(
  [isBrushing, getTooltipTypeSelector, computeCursorPositionSelector],
  isCrosshairVisible,
);

function isCrosshairVisible(isBrushing: boolean, tooltipType: TooltipType | undefined, cursorPosition: Point) {
  return (
    !isBrushing &&
    tooltipType !== undefined &&
    isCrosshairTooltipType(tooltipType) &&
    cursorPosition.x > -1 &&
    cursorPosition.y > -1
  );
}
