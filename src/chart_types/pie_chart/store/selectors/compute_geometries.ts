import { arc, pie } from 'd3-shape';
import { createSelector } from 'reselect';
import { IChartState, GeometriesList, StoreSettings } from 'store/chart_store';
import { PieSpec } from 'specs';
import { getPieSpecSelector } from './get_pie_spec';

const getGlobalSettingsSelector = (state: IChartState) => state.settings;

function render(pieSpec: PieSpec, settings: StoreSettings) {
  const paths = pie().value((d: any) => {
    return d[pieSpec.accessor];
  })(pieSpec.data);
  const { width, height } = settings.chartDimensions;
  const outerRadius = width < height ? width / 2 : height / 2;
  const innerRadius = pieSpec.donut ? outerRadius / 2 : 0;
  const arcGenerator = arc();
  const arcs = paths.map((path) => {
    const arc = arcGenerator({
      ...path,
      innerRadius: innerRadius,
      outerRadius: outerRadius,
    });
    return {
      arc: arc === null ? '' : arc,
      color: 'red',
      transform: {
        x: width / 2,
        y: height / 2,
      },
      geometryId: {
        specId: pieSpec.id,
        seriesKey: [],
      },
      seriesArcStyle: settings.theme.arcSeriesStyle.arc,
    };
  });
  console.log(arcs);
  return { arcs };
}

export const computeGeometriesSelector = createSelector(
  [getPieSpecSelector, getGlobalSettingsSelector],
  (pieSpec, settings): GeometriesList => {
    if (!pieSpec) {
      return {};
    }
    return render(pieSpec, settings);
  },
);
