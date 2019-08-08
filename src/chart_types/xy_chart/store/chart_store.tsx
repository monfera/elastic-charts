import React from 'react';
import { Layer } from 'react-konva';
import { IChartStore, ChartTypes, IChartState } from 'store/chart_store';
import { computeSeriesGeometriesSelector } from './selectors/compute_series_geometries';
import { computeChartDimensionsSelector } from './selectors/compute_chart_dimensions';
import { Tooltips } from '../renderer/dom/tooltips';
import { htmlIdGenerator } from 'utils/commons';
import { Highlighter } from '../renderer/dom/highlighter';
import { Crosshair } from '../renderer/dom/crosshair';
import { Axes } from '../renderer/canvas/axis';
import { BarValues } from '../renderer/canvas/bar_values';
import { Grid } from '../renderer/canvas/grid';
import { AnnotationTooltip } from '../renderer/dom/annotation_tooltips';
import { Legend } from 'components/legend/legend';
import { LegendButton } from 'components/legend/legend_button';

export class XYAxisChartStore implements IChartStore {
  chartType = ChartTypes.XYAxis;
  legendId: string = htmlIdGenerator()('legend');
  render(state: IChartState) {
    console.log('---- rendering xyaxis geometries ----');
    const geoms = computeSeriesGeometriesSelector(state);
    console.log('geoms', { geoms });
    return geoms.geometries;
  }
  getChartDimensions(state: IChartState) {
    return computeChartDimensionsSelector(state);
  }
  getCustomChartComponents(zIndex: number, type: 'dom' | 'svg' | 'canvas') {
    switch (type) {
      case 'dom':
        return getDomComponents(zIndex, this.legendId);
      case 'canvas':
        return getCanvasComponents(zIndex);
      default:
        return null;
    }
  }
}

function getDomComponents(zIndex: number, legendId: string) {
  if (zIndex === -1) {
    return <Crosshair />;
  }
  return (
    <React.Fragment>
      <Tooltips />
      <AnnotationTooltip />
      <Highlighter />
      <Legend legendId={legendId} />
      <LegendButton legendId={legendId} />
    </React.Fragment>
  );
}

function getCanvasComponents(zIndex: number): JSX.Element | null {
  if (zIndex === -1) {
    return getCanvasComponentsAtLevelMinus1();
  }
  return getCanvasComponentsAtLevel1();
}

function getCanvasComponentsAtLevelMinus1() {
  return (
    <Layer hitGraphEnabled={false} listening={false}>
      <Grid />
    </Layer>
  );
}

function getCanvasComponentsAtLevel1() {
  return (
    <Layer hitGraphEnabled={false} listening={false}>
      <Axes />
      <BarValues />
    </Layer>
  );
}
