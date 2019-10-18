import createCachedSelector from 're-reselect';
import { getChartThemeSelector } from '../../../../state/selectors/get_chart_theme';
import { computeChartDimensions } from '../../utils/dimensions';
import { GlobalChartState } from '../../../../state/chart_state';
import { Dimensions } from '../../../../utils/dimensions';

const getParentDimension = (state: GlobalChartState) => state.parentDimensions;

export const computeChartDimensionsSelector = createCachedSelector(
  [getParentDimension, getChartThemeSelector],
  (
    parentDimensions,
    chartTheme,
  ): {
    chartDimensions: Dimensions;
    leftMargin: number;
  } => {
    return computeChartDimensions(parentDimensions, chartTheme);
  },
)((state) => state.chartId);
