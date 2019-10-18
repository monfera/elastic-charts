import createCachedSelector from 're-reselect';
import { GlobalChartState } from '../../../../state/chart_state';
import { getSpecsFromStore } from '../../../../state/utils';
import { BasicSeriesSpec } from '../../utils/specs';
import { getChartIdSelector } from '../../../../state/selectors/get_chart_id';

const getSpecs = (state: GlobalChartState) => state.specs;

export const getSeriesSpecsSelector = createCachedSelector([getChartIdSelector, getSpecs], (chartId, specs) => {
  const seriesSpec = getSpecsFromStore<BasicSeriesSpec>(specs, 'xy_axis', 'series');
  return seriesSpec;
})((state) => state.chartId);
