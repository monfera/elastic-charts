import { PointGeometry, BarGeometry, AreaGeometry, LineGeometry, ArcGeometry } from '../utils/geometry';
import { Spec } from '../specs';
import { IChartStore } from './chart_store';
import { SPEC_PARSED } from './actions/specs';
import { PieChartStore } from '../chart_types/pie_chart/store/chart_store';
import { specsReducer } from './reducers/specs';
import { chartSettingsReducer } from './reducers/chart_settings';
import { Dimensions } from '../utils/dimensions';
import { Theme } from '../utils/themes/theme';
import { LIGHT_THEME } from '../utils/themes/light_theme';
import { Rotation } from '../chart_types/xy_chart/utils/specs';
import { Transform } from '../chart_types/xy_chart/store/utils';

export interface IChartStore {
  render(specList: SpecList, settings: StoreSettings): GeometriesList;
}

export interface SpecList {
  [specId: string]: Spec;
}
export interface StoreSettings {
  debug: boolean;
  parentDimensions: Dimensions;
  theme: Theme;
  canDataBeAnimated: boolean;
  chartDimensions: Dimensions;
  chartRotation: Rotation;
  chartTransform: Transform;
}
export interface GeometriesList {
  points?: PointGeometry[];
  bars?: BarGeometry[];
  areas?: AreaGeometry[];
  lines?: LineGeometry[];
  arcs?: ArcGeometry[];
}

export interface IChartState {
  initialized: boolean;
  specs: SpecList;
  chartType: ChartType | null;
  chartStore: IChartStore | null;
  settings: StoreSettings;
}

const initialState: IChartState = {
  initialized: false,
  specs: {},
  chartType: null,
  chartStore: null,
  settings: {
    debug: false,
    parentDimensions: {
      height: 0,
      width: 0,
      left: 0,
      top: 0,
    },
    theme: LIGHT_THEME,
    canDataBeAnimated: false,
    chartDimensions: {
      height: 0,
      width: 0,
      left: 0,
      top: 0,
    },
    chartRotation: 0,
    chartTransform: {
      rotate: 0,
      x: 0,
      y: 0,
    },
  },
};

export const ChartTypes = Object.freeze({
  Pie: 'pie' as 'pie',
  XYAxis: 'xy_axis' as 'xy_axis',
});

export type ChartType = typeof ChartTypes.Pie | typeof ChartTypes.XYAxis;

export function chartStoreReducer(state = initialState, action: any) {
  console.log(`dispatch: ${action.type}`);
  switch (action.type) {
    case SPEC_PARSED:
      const chartType = findMainChartType(state.specs);
      console.log('spec parsed', chartType);
      if (isChartTypeChanged(state, chartType)) {
        const chartStore = intializeChartStore(chartType);
        return {
          ...state,
          initialized: true,
          chartType,
          chartStore,
        };
      } else {
        return {
          ...state,
          initialized: true,
          chartType,
        };
      }
    default:
      return {
        ...state,
        specs: specsReducer(state.specs, action),
        settings: chartSettingsReducer(state.settings, action),
      };
  }
}

function findMainChartType(specs: SpecList) {
  const types = Object.keys(specs).reduce<{
    [chartType: string]: number;
  }>((acc, specId) => {
    const { chartType } = specs[specId];
    if (!acc[chartType]) {
      acc[chartType] = 0;
    }
    acc[chartType] = acc[chartType] + 1;
    return acc;
  }, {});
  const chartTypes = Object.keys(types);
  if (chartTypes.length > 1) {
    console.warn('Multiple chart type on the same configuration');
    return null;
  } else {
    return chartTypes[0] as ChartType;
  }
}

function intializeChartStore(chartType: ChartType | null): IChartStore {
  console.log(`initializing ${chartType}`);
  return new PieChartStore();
}

function isChartTypeChanged(state: IChartState, newChartType: ChartType | null) {
  return state.chartType !== newChartType;
}
