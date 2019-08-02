import { IChartStore, ChartTypes, IChartState } from 'store/chart_store';
import { computeSeriesGeometriesSelector } from './selectors/compute_series_geometries';
import { computeChartDimensionsSelector } from './selectors/compute_chart_dimensions';

export class XYAxisChartStore implements IChartStore {
  chartType = ChartTypes.XYAxis;
  render(state: IChartState) {
    console.log('---- rendering xyaxis geometries ----');
    const geoms = computeSeriesGeometriesSelector(state);
    console.log('geoms', { geoms });
    return geoms.geometries;
  }
  getChartDimensions(state: IChartState) {
    return computeChartDimensionsSelector(state);
  }
}
