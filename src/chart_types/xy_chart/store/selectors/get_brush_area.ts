import { createSelector } from 'reselect';
import { IChartState } from '../../../../store/chart_store';
import { Dimensions } from '../../../../utils/dimensions';
import { getChartDimensionsSelector } from 'store/selectors/get_chart_dimensions';
import { computeChartTransformSelector } from './compute_chart_transform';
import { getChartRotationSelector } from 'store/selectors/get_chart_rotation';

const getMouseDownPosition = (state: IChartState) => state.interactions.mouseDownPosition;
const getRawCursorPosition = (state: IChartState) => {
  return state.interactions.rawCursorPosition;
};

export const getBrushAreaSelector = createSelector(
  [
    getMouseDownPosition,
    getRawCursorPosition,
    getChartRotationSelector,
    getChartDimensionsSelector,
    computeChartTransformSelector,
  ],
  (mouseDownPosition, cursorPosition, chartRotation, chartDimensions, chartTransform): Dimensions | null => {
    if (!mouseDownPosition) {
      return null;
    }
    const brushStart = {
      x: mouseDownPosition.x - chartDimensions.left,
      y: mouseDownPosition.y - chartDimensions.top,
    };
    if (chartRotation === 0 || chartRotation === 180) {
      const area = {
        left: brushStart.x,
        top: 0,
        width: cursorPosition.x - brushStart.x - chartDimensions.left,
        height: chartDimensions.height,
      };
      return area;
    } else {
      return {
        left: chartDimensions.left + chartTransform.x,
        top: brushStart.y - chartDimensions.top,
        width: chartDimensions.width,
        height: cursorPosition.y - brushStart.y - chartDimensions.top,
      };
    }
  },
);
