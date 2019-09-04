import { createSelector } from 'reselect';
import { IChartState, GeometriesList } from '../chart_store';

const getState = (state: IChartState) => state;
const getChartStore = (state: IChartState) => state.chartStore;
const isInitialized = (state: IChartState) => state.initialized;

export const getRenderedGeometriesSelector = createSelector(
  [isInitialized, getChartStore, getState],
  (isInitialized, chartStore, state): GeometriesList => {
    if (!isInitialized || !chartStore) {
      return {};
    }
    return chartStore.render(state);
  },
);
