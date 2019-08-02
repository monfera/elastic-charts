import { createSelector } from 'reselect';
import { computeSeriesDomainsSelector } from './compute_series_domains';
import { getSeriesSpecsSelector, getAxisSpecsSelector } from './get_specs';
import { getChartThemeSelector } from 'store/selectors/get_chart_theme';
import { getSeriesColorMapSelector } from './get_series_color_map';
import { getDeselectedDataSeries } from 'store/selectors/get_deselected_data_series';
import { computeLegend, LegendItem } from 'chart_types/xy_chart/legend/legend';

export const computeLegendSelector = createSelector(
  [
    getSeriesSpecsSelector,
    computeSeriesDomainsSelector,
    getChartThemeSelector,
    getSeriesColorMapSelector,
    getAxisSpecsSelector,
    getDeselectedDataSeries,
  ],
  (
    seriesSpecs,
    seriesDomainsAndData,
    chartTheme,
    seriesColorMap,
    axesSpecs,
    deselectedDataSeries,
  ): Map<string, LegendItem> => {
    console.log({ seriesDomainsAndData, chartTheme });
    console.log('--- 3 computeLegend ---');

    return computeLegend(
      seriesDomainsAndData.seriesColors,
      seriesColorMap,
      seriesSpecs,
      chartTheme.colors.defaultVizColor,
      axesSpecs,
      deselectedDataSeries,
    );
  },
);
