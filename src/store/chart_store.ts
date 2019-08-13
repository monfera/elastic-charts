import { PointGeometry, BarGeometry, AreaGeometry, LineGeometry, ArcGeometry } from '../utils/geometry';
import { Spec } from '../specs';
import { IChartStore } from './chart_store';
import { SPEC_PARSED } from './actions/specs';
import { PieChartStore } from '../chart_types/pie_chart/store/chart_store';
import { specsReducer } from './reducers/specs';
import { chartSettingsReducer } from './reducers/chart_settings';
import { interactionsReducer } from './reducers/interactions';
import { Dimensions } from '../utils/dimensions';
import { XYAxisChartStore } from 'chart_types/xy_chart/store/chart_store';
import { DataSeriesColorsValues } from 'chart_types/xy_chart/utils/series';

export interface IChartStore {
  chartType: ChartType;
  render(state: IChartState): GeometriesList;
  getChartDimensions(state: IChartState): Dimensions;
  getCustomChartComponents(zIndex: number, componentType: 'dom' | 'svg' | 'canvas'): JSX.Element | null;
  isBrushAvailable(state: IChartState): boolean;
}

export interface SpecList {
  [specId: string]: Spec;
}
export interface GlobalSettings {
  debug: boolean;
  parentDimensions: Dimensions;
}

export interface InteractionsStore {
  rawCursorPosition: {
    x: number;
    y: number;
  };
  mouseDownPosition: {
    x: number;
    y: number;
  } | null;
  highlightedLegendItemKey: string | null;
  legendCollapsed: boolean;
  invertDeselect: boolean;
  deselectedDataSeries: DataSeriesColorsValues[];
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
  settings: GlobalSettings;
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
    mouseDownPosition: null,
    legendCollapsed: false,
    highlightedLegendItemKey: null,
    deselectedDataSeries: [],
    invertDeselect: false,
  },
  settings: {
    debug: false,
    parentDimensions: {
      height: 0,
      width: 0,
      left: 0,
      top: 0,
    },
  },
};

export function chartStoreReducer(state = initialState, action: any) {
  switch (action.type) {
    case SPEC_PARSED:
      const chartType = findMainChartType(state.specs);
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
