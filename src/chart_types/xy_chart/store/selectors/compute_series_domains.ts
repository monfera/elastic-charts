import { createSelector } from 'reselect';
import { getSettingsSpecSelector } from 'store/selectors/get_settings_specs';
import { getDeselectedDataSeries } from 'store/selectors/get_deselected_data_series';
import { getSeriesSpecsSelector } from './get_specs';
import { mergeYCustomDomainsByGroupIdSelector } from './merge_y_custom_domains';
import { computeSeriesDomains } from '../utils';
import { SeriesDomainsAndData } from '../chart_state';

export const computeSeriesDomainsSelector = createSelector(
  [getSeriesSpecsSelector, mergeYCustomDomainsByGroupIdSelector, getSettingsSpecSelector, getDeselectedDataSeries],
  (seriesSpecs, customYDomainsByGroupId, settingsSpec, deselectedDataSeries): SeriesDomainsAndData => {
    console.log('--- 1 computeSeriesDomainsSelector ---');
    const domains = computeSeriesDomains(
      seriesSpecs,
      customYDomainsByGroupId,
      settingsSpec.xDomain,
      deselectedDataSeries,
    );
    console.log({ domains });
    return domains;
  },
);
