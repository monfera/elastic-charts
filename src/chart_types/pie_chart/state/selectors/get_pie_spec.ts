import createCachedSelector from 're-reselect';
import { GlobalChartState } from '../../../../state/chart_state';
import { getSpecsFromStore } from '../../../../state/utils';
import { PieSpec } from '../../specs/pie';

const getSpecs = (state: GlobalChartState) => state.specs;

export const getPieSpecSelector = createCachedSelector(
  [getSpecs],
  (specs): PieSpec | null => {
    console.log({ specs });
    const pieSpecs = getSpecsFromStore<PieSpec>(specs, 'pie', 'pie');
    if (pieSpecs.length !== 1) {
      throw new Error('multiple pie spec are not allowed');
    }
    return pieSpecs[0];
  },
)((state) => state.chartId);
