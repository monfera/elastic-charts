import { createSelector } from 'reselect';
import { IChartState, ChartTypes } from '../chart_store';
import { getSpecsFromStore } from '../utils';
import { SettingsSpec } from '../../specs/settings';

const getSpecs = (state: IChartState) => state.specs;

export const getSettingsSpecSelector = createSelector(
  [getSpecs],
  (specs): SettingsSpec => {
    console.log('---- get settings specs ----');
    const settingsSpecs = getSpecsFromStore<SettingsSpec>(specs, ChartTypes.Global, 'settings');
    if (settingsSpecs.length > 1) {
      throw new Error('Multiple settings specs are configured on the same chart');
    }
    console.log({ settingsSpecs: settingsSpecs[0] });
    return settingsSpecs[0];
  },
);
