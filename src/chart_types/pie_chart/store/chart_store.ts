import { IChartStore, IChartState, ChartTypes } from 'store/chart_store';
import { computeGeometriesSelector } from './selectors/compute_geometries';

export class PieChartStore implements IChartStore {
  chartType = ChartTypes.Pie;
  render(state: IChartState) {
    return computeGeometriesSelector(state);
  }
  getChartDimensions(state: IChartState) {
    return state.settings.parentDimensions;
  }
}
