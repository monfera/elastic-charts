import { IChartState } from '../../../../store/chart_store';
import { createSelector } from 'reselect';
import { getSeriesSpecs } from './get_specs';
import { mergeYCustomDomainsByGroupId } from './merge_y_custom_domains';
import { computeSeriesDomains } from '../utils';

const getCustomXDomain = (state: IChartState) => state.settings;
const getChartStore = (state: IChartState) => state.chartStore;

export const computeSeriesDomainsSelector = createSelector(
  [getSeriesSpecs, mergeYCustomDomainsByGroupId, getCustomXDomain, getChartStore],
  (seriesSpecs, customYDomainsByGroupId, customXDomain, chartStore) => {
    return computeSeriesDomains(seriesSpecs, customYDomainsByGroupId, customXDomain, deselectedDataSeries);
  },
);
