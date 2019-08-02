import { createSelector } from 'reselect';
import { IChartState } from 'store/chart_store';
import { getSpecsFromStore } from 'store/utils';
import { AxisSpec, BasicSeriesSpec, AnnotationSpec } from '../../utils/specs';

const getSpecs = (state: IChartState) => state.specs;

export const getAxisSpecsSelector = createSelector(
  [getSpecs],
  (specs): AxisSpec[] => {
    return getSpecsFromStore<AxisSpec>(specs, 'xy_axis', 'axis');
  },
);

export const getSeriesSpecsSelector = createSelector(
  [getSpecs],
  (specs) => {
    const seriesSpec = getSpecsFromStore<BasicSeriesSpec>(specs, 'xy_axis', 'series');
    console.log({ seriesSpec });
    return seriesSpec;
  },
);

export const getAnnotationSpecsSelector = createSelector(
  [getSpecs],
  (specs) => {
    return getSpecsFromStore<AnnotationSpec>(specs, 'xy_axis', 'annotations');
  },
);
