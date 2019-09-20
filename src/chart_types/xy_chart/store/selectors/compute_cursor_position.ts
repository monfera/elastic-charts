import { Dimensions } from 'utils/dimensions';
import createCachedSelector from 're-reselect';
import { computeChartDimensionsSelector } from './compute_chart_dimensions';
import { IChartState } from 'store/chart_store';
import { Point } from 'utils/point';

const getRawCursorPosition = (state: IChartState) => state.interactions.rawCursorPosition;

export const computeCursorPositionSelector = createCachedSelector(
  [getRawCursorPosition, computeChartDimensionsSelector],
  (rawCursorPosition, chartDimensions): Point => {
    return computeCursorPosition(rawCursorPosition, chartDimensions.chartDimensions);
  },
)((state) => state.chartId);

function computeCursorPosition(rawCursorPosition: Point, chartDimensions: Dimensions) {
  const { x, y } = rawCursorPosition;
  // get positions relative to chart
  let xPos = x - chartDimensions.left;
  let yPos = y - chartDimensions.top;

  // limit cursorPosition to chartDimensions
  if (xPos < 0 || xPos >= chartDimensions.width) {
    xPos = -1;
  }
  if (yPos < 0 || yPos >= chartDimensions.height) {
    yPos = -1;
  }
  return {
    x: xPos,
    y: yPos,
  };
}