// import { createSelector } from 'reselect';
// import { DataSeriesColorsValues } from '../../chart_types/xy_chart/utils/series';
// import { IChartState } from 'store/chart_store';
// import { computeLegendSelector } from 'chart_types/xy_chart/store/selectors/compute_legend';
// import { LegendItem } from 'chart_types/xy_chart/legend/legend';

// const getDeselectedSeriesKeys = (state: IChartState) => state.interactions.deselectedDataSeriesKeys;

// export const getDeselectedDataSeriesSelector = createSelector(
//   [computeLegendSelector, getDeselectedSeriesKeys],
//   (legendItems, deselectedSeriesKeys): DataSeriesColorsValues[] => {
//     return [...legendItems.values()]
//       .filter((item: LegendItem) => deselectedSeriesKeys.includes(item.key))
//       .map((item: LegendItem) => item.value);
//   },
// );
