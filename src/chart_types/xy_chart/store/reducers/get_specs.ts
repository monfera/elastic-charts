import { createSelector } from 'reselect';
import { IChartState } from '../../../../store/chart_store';
import { getSpecsFromStore } from '../../../../store/utils';
import { AxisSpec, BasicSeriesSpec } from '../../utils/specs';

const getSpecs = (state: IChartState) => state.specs;
const getChartType = (state: IChartState) => state.chartType;

export const getAxisSpecs = createSelector(
  [getSpecs, getChartType],
  (specs, chartType): AxisSpec[] => {
    return getSpecsFromStore<AxisSpec>(specs, chartType, 'axis');
  },
);

export const getSeriesSpecs = createSelector(
  [getSpecs, getChartType],
  (specs, chartType) => {
    return getSpecsFromStore<BasicSeriesSpec>(specs, chartType, 'series');
  },
);
