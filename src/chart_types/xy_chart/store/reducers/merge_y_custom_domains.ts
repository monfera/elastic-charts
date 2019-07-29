import { createSelector } from 'reselect';
import { IChartState } from '../../../../store/chart_store';
import { getAxisSpecs } from './get_specs';
import { isYDomain, isCompleteBound, isLowerBound, isUpperBound, isBounded } from '../../utils/axis_utils';
import { AxisSpec, DomainRange, Rotation } from '../../utils/specs';

const getChartRotation = (state: IChartState) => state.settings.chartRotation;

export const mergeYCustomDomainsByGroupId = createSelector(
  [getAxisSpecs, getChartRotation],
  (axisSpecs, chartRotation): Map<string, DomainRange> => {
    return mergeYCustomDomains(axisSpecs, chartRotation);
  },
);

export function mergeYCustomDomains(axesSpecs: AxisSpec[], chartRotation: Rotation): Map<string, DomainRange> {
  const domainsByGroupId = new Map<string, DomainRange>();

  axesSpecs.forEach((spec: AxisSpec) => {
    const { id, groupId, domain } = spec;

    if (!domain) {
      return;
    }

    const isAxisYDomain = isYDomain(spec.position, chartRotation);

    if (!isAxisYDomain) {
      const errorMessage = `[Axis ${id}]: custom domain for xDomain should be defined in Settings`;
      throw new Error(errorMessage);
    }

    if (isCompleteBound(domain) && domain.min > domain.max) {
      const errorMessage = `[Axis ${id}]: custom domain is invalid, min is greater than max`;
      throw new Error(errorMessage);
    }

    const prevGroupDomain = domainsByGroupId.get(groupId);

    if (prevGroupDomain) {
      const prevDomain = prevGroupDomain as DomainRange;

      const prevMin = isLowerBound(prevDomain) ? prevDomain.min : undefined;
      const prevMax = isUpperBound(prevDomain) ? prevDomain.max : undefined;

      let max = prevMax;
      let min = prevMin;

      if (isCompleteBound(domain)) {
        min = prevMin != null ? Math.min(domain.min, prevMin) : domain.min;
        max = prevMax != null ? Math.max(domain.max, prevMax) : domain.max;
      } else if (isLowerBound(domain)) {
        min = prevMin != null ? Math.min(domain.min, prevMin) : domain.min;
      } else if (isUpperBound(domain)) {
        max = prevMax != null ? Math.max(domain.max, prevMax) : domain.max;
      }

      const mergedDomain = {
        min,
        max,
      };

      if (isBounded(mergedDomain)) {
        domainsByGroupId.set(groupId, mergedDomain);
      }
    } else {
      domainsByGroupId.set(groupId, domain);
    }
  });

  return domainsByGroupId;
}
