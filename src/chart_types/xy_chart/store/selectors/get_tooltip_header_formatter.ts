import { createSelector } from 'reselect';
import { isTooltipProps, TooltipValueFormatter } from '../../utils/interactions';
import { getSettingsSpecSelector } from 'store/selectors/get_settings_specs';
import { SettingsSpec } from 'specs/settings';

export const getTooltipHeaderFormatterSelector = createSelector(
  [getSettingsSpecSelector],
  getTooltipHeaderFormatter,
);

function getTooltipHeaderFormatter(settings: SettingsSpec): TooltipValueFormatter | undefined {
  const { tooltip } = settings;
  if (tooltip && isTooltipProps(tooltip)) {
    return tooltip.headerFormatter;
  }
  return undefined;
}
