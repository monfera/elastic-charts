import { createSelector } from 'reselect';
import { IChartState, GeometriesList } from '../chart_store';

const getSettings = (state: IChartState) => state.settings;
const getSpecs = (state: IChartState) => state.specs;
const getChartStore = (state: IChartState) => state.chartStore;
const isInitialized = (state: IChartState) => state.initialized;

export const getRenderedGeometries = createSelector(
  [isInitialized, getSettings, getSpecs, getChartStore],
  (isInitialized, settings, specs, chartStore): GeometriesList => {
    if (!isInitialized || !chartStore) {
      return {};
    }
    return chartStore.render(specs, settings);
  },
);
