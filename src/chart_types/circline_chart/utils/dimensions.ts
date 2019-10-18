import { Theme } from '../../../utils/themes/theme';
import { Dimensions } from '../../../utils/dimensions';

/**
 * Compute the chart dimensions. It's computed removing from the parent dimensions,
 * the legend and any other specified style margin and padding.
 * @param parentDimensions the parent dimension
 * @param chartTheme the theme style of the chart
 * @param showLegend is the legend shown
 * @param legendPosition the optional legend position
 */
export function computeChartDimensions(
  parentDimensions: Dimensions,
  chartTheme: Theme,
): {
  chartDimensions: Dimensions;
  leftMargin: number;
} {
  if (parentDimensions.width <= 0 || parentDimensions.height <= 0) {
    return {
      chartDimensions: {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      },
      leftMargin: 0,
    };
  }
  const { chartMargins, chartPaddings } = chartTheme;

  const chartWidth = parentDimensions.width;
  const chartHeight = parentDimensions.height;

  const top = chartMargins.top + chartPaddings.top;
  const left = chartMargins.left + chartPaddings.left;

  return {
    leftMargin: chartMargins.left,
    chartDimensions: {
      top,
      left,
      width: chartWidth - chartPaddings.left - chartPaddings.right,
      height: chartHeight - chartPaddings.top - chartPaddings.bottom,
    },
  };
}
