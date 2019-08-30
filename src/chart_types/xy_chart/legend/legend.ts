import { getAxesSpecForSpecId } from '../store/utils';
import { identity } from '../../../utils/commons';
import {
  DataSeriesColorsValues,
  getSortedDataSeriesColorsValuesMap,
  findDataSeriesByColorValues,
} from '../utils/series';
import { AxisSpec, BasicSeriesSpec } from '../utils/specs';

export interface LegendItem {
  key: string;
  color: string;
  label: string;
  value: DataSeriesColorsValues;
  isSeriesVisible?: boolean;
  isLegendItemVisible?: boolean;
  displayValue: {
    raw: any;
    formatted: any;
  };
}

export function computeLegend(
  seriesColor: Map<string, DataSeriesColorsValues>,
  seriesColorMap: Map<string, string>,
  specs: BasicSeriesSpec[],
  defaultColor: string,
  axesSpecs: AxisSpec[],
  deselectedDataSeries: DataSeriesColorsValues[],
): Map<string, LegendItem> {
  const legendItems: Map<string, LegendItem> = new Map();
  const sortedSeriesColors = getSortedDataSeriesColorsValuesMap(seriesColor);

  sortedSeriesColors.forEach((series, key) => {
    const spec = specs.find((spec) => spec.id === series.specId);
    const color = seriesColorMap.get(key) || defaultColor;
    const hasSingleSeries = seriesColor.size === 1;
    const label = getSeriesColorLabel(series.colorValues, hasSingleSeries, spec);
    const index = findDataSeriesByColorValues(deselectedDataSeries, series);
    const isSeriesVisible = index === -1;

    if (!label || !spec) {
      return;
    }

    // Use this to get axis spec w/ tick formatter
    const { yAxis } = getAxesSpecForSpecId(axesSpecs, spec.groupId);
    const formatter = yAxis ? yAxis.tickFormat : identity;

    const { hideInLegend } = spec;

    legendItems.set(key, {
      key,
      color,
      label,
      value: series,
      isSeriesVisible,
      isLegendItemVisible: !hideInLegend,
      displayValue: {
        raw: series.lastValue,
        formatted: isSeriesVisible ? formatter(series.lastValue) : undefined,
      },
    });
  });
  return legendItems;
}

export function getSeriesColorLabel(
  colorValues: any[],
  hasSingleSeries: boolean,
  spec?: BasicSeriesSpec,
): string | undefined {
  let label = '';
  if (hasSingleSeries || colorValues.length === 0 || colorValues[0] == null) {
    if (!spec) {
      return;
    }
    label = spec.name || `${spec.id}`;
  } else {
    label = colorValues.join(' - ');
  }

  return label;
}
