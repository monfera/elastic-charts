import { getSettingsSpecSelector } from 'store/selectors/get_settings_specs';
import { createSelector } from 'reselect';
import { IChartState } from '../../../../store/chart_store';

const isLegendCollapsedSelector = (state: IChartState) => state.settings.legendCollapsed;

export const isLegendVisibleSelector = createSelector(
  [getSettingsSpecSelector, isLegendCollapsedSelector],
  (settingsSpecs, isLegendCollapsed): boolean => {
    return settingsSpecs.showLegend && !isLegendCollapsed;
  },
);
