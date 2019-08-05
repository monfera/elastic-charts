import { IChartState } from '../chart_store';

export const getChartTypeComponentSelector = (chartStore: any, zIndex: number, type: 'dom' | 'svg' | 'canvas') => (
  state: IChartState,
): JSX.Element | null => {
  if (state.chartStore) {
    return state.chartStore.getCustomChartComponents(chartStore, zIndex, type);
  } else {
    return null;
  }
};
