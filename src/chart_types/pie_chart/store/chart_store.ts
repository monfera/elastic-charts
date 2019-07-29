import { SpecList, ChartTypes, StoreSettings } from '../../../store/chart_store';
import { IChartStore } from '../../../store/chart_store';
import { getSpecsFromStore } from '../../../store/utils';
import { arc, pie } from 'd3-shape';
import { PieSpec } from '../specs/pie';

function render(specList: SpecList, settings: StoreSettings) {
  console.log('render called after specs');
  const specs = getSpecsFromStore(specList, ChartTypes.Pie, 'pie');
  if (specs.length === 1) {
    const pieSpec = specs[0] as PieSpec;
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
    console.log({ arcs });
    return { arcs };
  } else {
    return {};
  }
}

export class PieChartStore implements IChartStore {
  render(specList: SpecList, settings: StoreSettings) {
    return render(specList, settings);
  }
}
