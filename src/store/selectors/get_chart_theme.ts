import { createSelector } from 'reselect';
import { getSettingsSpecSelector } from './get_settings_specs';
import { PartialTheme, Theme, mergeWithDefaultTheme } from '../../utils/themes/theme';
import { LIGHT_THEME } from '../../utils/themes/light_theme';

export const getChartThemeSelector = createSelector(
  [getSettingsSpecSelector],
  (settingsSpec): Theme => {
    return getTheme(settingsSpec.baseTheme, settingsSpec.theme);
  },
);

function getTheme(baseTheme?: Theme, theme?: PartialTheme | PartialTheme[]): Theme {
  const base = baseTheme ? baseTheme : LIGHT_THEME;

  if (Array.isArray(theme)) {
    const [firstTheme, ...axillaryThemes] = theme;
    return mergeWithDefaultTheme(firstTheme, base, axillaryThemes);
  }

  return theme ? mergeWithDefaultTheme(theme, base) : base;
}
