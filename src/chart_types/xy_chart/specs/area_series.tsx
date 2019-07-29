import { AreaSeriesSpec, HistogramModeAlignments, DEFAULT_GLOBAL_ID } from '../utils/specs';
import { ScaleType } from '../../../utils/scales/scales';
import { specComponentFactory, getConnect } from '../../../store/spec_factory';
import { ChartTypes } from '../../../store/chart_store';

const defaultProps = {
  chartType: ChartTypes.XYAxis,
  specType: 'series' as 'series',
  seriesType: 'area' as 'area',
  groupId: DEFAULT_GLOBAL_ID,
  xScaleType: ScaleType.Ordinal,
  yScaleType: ScaleType.Linear,
  xAccessor: 'x',
  yAccessors: ['y'],
  yScaleToDataExtent: false,
  hideInLegend: false,
  histogramModeAlignment: HistogramModeAlignments.Center,
};

export const AreaSeries = getConnect()(
  specComponentFactory<
    AreaSeriesSpec,
    | 'groupId'
    | 'xScaleType'
    | 'yScaleType'
    | 'xAccessor'
    | 'yAccessors'
    | 'yScaleToDataExtent'
    | 'hideInLegend'
    | 'histogramModeAlignment'
  >(defaultProps),
);
