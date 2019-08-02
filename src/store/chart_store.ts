import { PointGeometry, BarGeometry, AreaGeometry, LineGeometry, ArcGeometry } from '../utils/geometry';
import { Spec } from '../specs';
import { IChartStore } from './chart_store';
import { SPEC_PARSED } from './actions/specs';
import { PieChartStore } from '../chart_types/pie_chart/store/chart_store';
import { specsReducer } from './reducers/specs';
import { chartSettingsReducer } from './reducers/chart_settings';
import { interactionsReducer } from './reducers/interactions';
import { Dimensions } from '../utils/dimensions';
import { Theme } from '../utils/themes/theme';
import { LIGHT_THEME } from '../utils/themes/light_theme';
import { Rotation } from '../chart_types/xy_chart/utils/specs';
import { Transform } from '../chart_types/xy_chart/store/utils';
import { XYAxisChartStore } from 'chart_types/xy_chart/store/chart_store';

export interface IChartStore {
  chartType: ChartType;
  render(state: IChartState): GeometriesList;
  getChartDimensions(state: IChartState): Dimensions;
}

export interface SpecList {
  [specId: string]: Spec;
}
export interface StoreSettings {
  debug: boolean;
  parentDimensions: Dimensions;
  theme: Theme;
  chartRotation: Rotation;
  chartTransform: Transform;
  legendCollapsed: boolean;
}

export interface InteractionsStore {
  rawCursorPosition: {
    x: number;
    y: number;
  };
  isBrushing: boolean;
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
  interactions: InteractionsStore;
}

export const ChartTypes = Object.freeze({
  Global: 'global' as 'global',
  Pie: 'pie' as 'pie',
  XYAxis: 'xy_axis' as 'xy_axis',
});

export type ChartType = typeof ChartTypes.Pie | typeof ChartTypes.XYAxis | typeof ChartTypes.Global;

const initialState: IChartState = {
  initialized: false,
  specs: {
    // [DEFAULT_SETTINGS.id]: DEFAULT_SETTINGS,
  },
  chartType: null,
  chartStore: null,
  interactions: {
    rawCursorPosition: {
      x: -1,
      y: -1,
    },
    isBrushing: false,
  },
  settings: {
    debug: false,
    parentDimensions: {
      height: 0,
      width: 0,
      left: 0,
      top: 0,
    },
    theme: LIGHT_THEME,
    chartRotation: 0,
    chartTransform: {
      rotate: 0,
      x: 0,
      y: 0,
    },
    legendCollapsed: false,
  },
};
console.log({ initialState });

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
        interactions: interactionsReducer(state.interactions, action),
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
  const chartTypes = Object.keys(types).filter((type) => type !== 'global');
  if (chartTypes.length > 1) {
    console.warn('Multiple chart type on the same configuration');
    return null;
  } else {
    return chartTypes[0] as ChartType;
  }
}

function intializeChartStore(chartType: ChartType | null): IChartStore | null {
  console.log(`initializing ${chartType}`);
  switch (chartType) {
    case 'pie':
      return new PieChartStore();
    case 'xy_axis':
      return new XYAxisChartStore();
    default:
      return null;
  }
}

function isChartTypeChanged(state: IChartState, newChartType: ChartType | null) {
  return state.chartType !== newChartType;
}
