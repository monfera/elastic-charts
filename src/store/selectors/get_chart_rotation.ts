import { createSelector } from 'reselect';
import { getSettingsSpecSelector } from './get_settings_specs';
import { Rotation } from '../../chart_types/xy_chart/utils/specs';

export const getChartRotationSelector = createSelector(
  [getSettingsSpecSelector],
  (settingsSpec): Rotation => {
    return settingsSpec.rotation;
  },
);
