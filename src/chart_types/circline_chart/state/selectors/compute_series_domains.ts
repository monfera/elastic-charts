import createCachedSelector from 're-reselect';
import { getSettingsSpecSelector } from '../../../../state/selectors/get_settings_specs';
import { getSeriesSpecsSelector } from './get_specs';
import { computeSeriesDomains } from '../utils';
import { SeriesDomainsAndData } from '../utils';
import { GlobalChartState } from '../../../../state/chart_state';

const getDeselectedSeriesSelector = (state: GlobalChartState) => state.interactions.deselectedDataSeries;

export const computeSeriesDomainsSelector = createCachedSelector(
  [getSeriesSpecsSelector, getDeselectedSeriesSelector, getSettingsSpecSelector],
  (seriesSpecs, deselectedDataSeries, settingsSpec): SeriesDomainsAndData => {
    // console.log('--- 1 computeSeriesDomainsSelector ---', seriesSpecs);
    const domains = computeSeriesDomains(seriesSpecs, deselectedDataSeries, settingsSpec.xDomain);
    return domains;
  },
)((state) => state.chartId);
