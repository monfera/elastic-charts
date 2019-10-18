import createCachedSelector from 're-reselect';
import { DomainRange } from '../../utils/specs';
import { getSettingsSpecSelector } from '../../../../state/selectors/get_settings_specs';

export const mergeYCustomDomainsByGroupIdSelector = createCachedSelector(
  [getSettingsSpecSelector],
  (): Map<string, DomainRange> => {
    return mergeYCustomDomainsByGroupId();
  },
)((state) => state.chartId);

export function mergeYCustomDomainsByGroupId(): Map<string, DomainRange> {
  const domainsByGroupId = new Map<string, DomainRange>();
  return domainsByGroupId;
}
