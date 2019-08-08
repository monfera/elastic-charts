import { createSelector } from 'reselect';
import { getSeriesTooltipValues } from '../../tooltip/tooltip';
import { getTooltipValuesSelector } from '../../store/selectors/get_tooltip_values_highlighted_geoms';

export const getLegendTooltipValuesSelector = createSelector(
  [getTooltipValuesSelector],
  (tooltipData): Map<string, string> => {
    return getSeriesTooltipValues(tooltipData);
  },
);
