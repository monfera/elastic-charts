import { createSelector } from 'reselect';
import { isTooltipProps } from '../../utils/interactions';
import { getSettingsSpecSelector } from 'store/selectors/get_settings_specs';
import { SettingsSpec } from 'specs/settings';
import { DEFAULT_TOOLTIP_SNAP } from '../../../../specs/settings';

export const getTooltipSnapSelector = createSelector(
  [getSettingsSpecSelector],
  getTooltipSnap,
);

function getTooltipSnap(settings: SettingsSpec): boolean {
  const { tooltip } = settings;
  if (tooltip && isTooltipProps(tooltip)) {
    return tooltip.snap || false;
  }
  return DEFAULT_TOOLTIP_SNAP;
}
