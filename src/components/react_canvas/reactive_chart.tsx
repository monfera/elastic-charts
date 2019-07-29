import React from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import { AreaGeometries } from './area_geometries';
import { ArcGeometries } from './arc_geometries';
import { BarGeometries } from './bar_geometries';
import { LineGeometries } from './line_geometries';
import { IChartState, GeometriesList, StoreSettings } from '../../store/chart_store';
import { onBrushStart, onBrushEnd } from '../../store/actions/brush';
import { onCursorPositionChange, CursorPositionChangeAction } from '../../store/actions/cursor';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Point } from '../../chart_types/xy_chart/store/chart_state';
import { getRenderedGeometries } from '../../store/selectors/get_rendered_geometries';
import { ContainerConfig } from 'konva';

interface Props {
  initialized: boolean;
  geometries: GeometriesList;
  settings: StoreSettings;
  onCursorPositionChange(x: number, y: number): CursorPositionChangeAction;
  onBrushEnd(start: Point, end: Point): void;
  onBrushStart(): void;
  isChartEmpty: boolean;
}
interface ReactiveChartState {
  brushing: boolean;
  brushStart: Point;
  brushEnd: Point;
  bbox: {
    left: number;
    top: number;
  };
}

interface ReactiveChartElementIndex {
  element: JSX.Element;
  zIndex: number;
}

// function limitPoint(value: number, min: number, max: number) {
//   if (value > max) {
//     return max;
//   } else if (value < min) {
//     return min;
//   } else {
//     return value;
//   }
// }

// function getPoint(event: MouseEvent, extent: BrushExtent): Point {
//   const point = {
//     x: limitPoint(event.layerX, extent.minX, extent.maxX),
//     y: limitPoint(event.layerY, extent.minY, extent.maxY),
//   };
//   return point;
// }
class Chart extends React.Component<Props, ReactiveChartState> {
  static displayName = 'ReactiveChart';
  firstRender = true;
  state = {
    brushing: false,
    brushStart: {
      x: 0,
      y: 0,
    },
    brushEnd: {
      x: 0,
      y: 0,
    },
    bbox: {
      left: 0,
      top: 0,
    },
  };

  renderBarSeries = (clippings: ContainerConfig): ReactiveChartElementIndex[] => {
    const { geometries, settings } = this.props;
    if (!geometries) {
      return [];
    }
    // const highlightedLegendItem = this.getHighlightedLegendItem();

    const element = (
      <BarGeometries
        key={'bar-geometries'}
        animated={settings.canDataBeAnimated}
        bars={geometries.bars}
        sharedStyle={settings.theme.sharedStyle}
        // highlightedLegendItem={highlightedLegendItem}
        clippings={clippings}
      />
    );

    return [
      {
        element,
        zIndex: 0,
      },
    ];
  };
  renderLineSeries = (clippings: ContainerConfig): ReactiveChartElementIndex[] => {
    const { geometries, settings } = this.props;
    if (!geometries) {
      return [];
    }

    // const highlightedLegendItem = this.getHighlightedLegendItem();

    const element = (
      <LineGeometries
        key={'line-geometries'}
        animated={settings.canDataBeAnimated}
        lines={geometries.lines}
        sharedStyle={settings.theme.sharedStyle}
        // highlightedLegendItem={highlightedLegendItem}
        clippings={clippings}
      />
    );

    return [
      {
        element,
        zIndex: 0,
      },
    ];
  };

  renderAreaSeries = (clippings: ContainerConfig): ReactiveChartElementIndex[] => {
    const { geometries, settings } = this.props;
    if (!geometries) {
      return [];
    }

    // const highlightedLegendItem = this.getHighlightedLegendItem();

    const element = (
      <AreaGeometries
        key={'area-geometries'}
        animated={settings.canDataBeAnimated}
        areas={geometries.areas}
        sharedStyle={settings.theme.sharedStyle}
        // highlightedLegendItem={highlightedLegendItem}
        clippings={clippings}
      />
    );

    return [
      {
        element,
        zIndex: 0,
      },
    ];
  };

  renderArcSeries = (): ReactiveChartElementIndex[] => {
    const { geometries, settings } = this.props;
    if (!geometries) {
      return [];
    }
    // const highlightedLegendItem = this.getHighlightedLegendItem();

    const element = (
      <ArcGeometries
        key={'arc-geometries'}
        animated={settings.canDataBeAnimated}
        arcs={geometries.arcs}
        sharedStyle={settings.theme.sharedStyle}
        // highlightedLegendItem={highlightedLegendItem}
      />
    );

    return [
      {
        element,
        zIndex: 0,
      },
    ];
  };
  // renderBrushTool = () => {
  //   const { brushing, brushStart, brushEnd } = this.state;
  //   const { chartDimensions, chartRotation, chartTransform } = this.props.chartStore!;
  //   if (!brushing) {
  //     return null;
  //   }
  //   let x = 0;
  //   let y = 0;
  //   let width = 0;
  //   let height = 0;
  //   // x = {chartDimensions.left + chartTransform.x};
  //   // y = {chartDimensions.top + chartTransform.y};
  //   if (chartRotation === 0 || chartRotation === 180) {
  //     x = brushStart.x;
  //     y = chartDimensions.top + chartTransform.y;
  //     width = brushEnd.x - brushStart.x;
  //     height = chartDimensions.height;
  //   } else {
  //     x = chartDimensions.left + chartTransform.x;
  //     y = brushStart.y;
  //     width = chartDimensions.width;
  //     height = brushEnd.y - brushStart.y;
  //   }
  //   return <Rect x={x} y={y} width={width} height={height} fill="gray" opacity={0.6} />;
  // };
  // onStartBrusing = (event: { evt: MouseEvent }) => {
  //   window.addEventListener('mouseup', this.onEndBrushing);
  //   const { brushExtent } = this.props.chartStore!;
  //   const point = getPoint(event.evt, brushExtent);
  //   this.setState(() => ({
  //     brushing: true,
  //     brushStart: point,
  //     brushEnd: point,
  //   }));
  // };
  // onEndBrushing = () => {
  //   window.removeEventListener('mouseup', this.onEndBrushing);
  //   const { brushStart, brushEnd } = this.state;
  //   this.props.chartStore!.onBrushEnd(brushStart, brushEnd);
  //   this.setState(() => ({
  //     brushing: false,
  //     brushStart: { x: 0, y: 0 },
  //     brushEnd: { x: 0, y: 0 },
  //   }));
  // };
  // onBrushing = (event: { evt: MouseEvent }) => {
  //   if (!this.state.brushing) {
  //     return;
  //   }
  //   if (!this.props.chartStore!.isBrushing.get()) {
  //     this.props.chartStore!.onBrushStart();
  //   }
  //   const { brushExtent } = this.props.chartStore!;
  //   const point = getPoint(event.evt, brushExtent);
  //   this.setState(() => ({
  //     brushEnd: point,
  //   }));

  // onStartBrusing = (event: { evt: MouseEvent }) => {
  //   window.addEventListener('mouseup', this.onEndBrushing);
  //   this.props.onBrushStart();
  //   const { brushExtent } = this.props.settings;
  //   const point = getPoint(event.evt, brushExtent);
  //   this.setState(() => ({
  //     brushing: true,
  //     brushStart: point,
  //     brushEnd: point,
  //   }));
  // };
  // onEndBrushing = () => {
  //   window.removeEventListener('mouseup', this.onEndBrushing);
  //   const { brushStart, brushEnd } = this.state;
  //   this.props.onBrushEnd(brushStart, brushEnd);
  //   this.setState(() => ({
  //     brushing: false,
  //     brushStart: { x: 0, y: 0 },
  //     brushEnd: { x: 0, y: 0 },
  //   }));
  // };
  // onBrushing = (event: { evt: MouseEvent }) => {
  //   if (!this.state.brushing) {
  //     return;
  //   }
  //   const { brushExtent } = this.props.chartStore!;
  //   const point = getPoint(event.evt, brushExtent);
  //   this.setState(() => ({
  //     brushEnd: point,
  //   }));
  // };

  sortAndRenderElements() {
    const { chartRotation, chartDimensions } = this.props.settings;
    const clippings = {
      clipX: 0,
      clipY: 0,
      clipWidth: [90, -90].includes(chartRotation) ? chartDimensions.height : chartDimensions.width,
      clipHeight: [90, -90].includes(chartRotation) ? chartDimensions.width : chartDimensions.height,
    };

    const bars = this.renderBarSeries(clippings);
    const areas = this.renderAreaSeries(clippings);
    const lines = this.renderLineSeries(clippings);
    const arcs = this.renderArcSeries();
    // const annotations = this.renderAnnotations();

    return [
      ...bars,
      ...areas,
      ...lines,
      ...arcs,
      // ...annotations
    ]
      .sort((elemIdxA, elemIdxB) => elemIdxA.zIndex - elemIdxB.zIndex)
      .map((elemIdx) => elemIdx.element);
  }

  render() {
    const { initialized, settings, isChartEmpty } = this.props;
    if (!initialized) {
      return null;
    }

    const { debug, parentDimensions, chartDimensions, chartRotation, chartTransform } = settings;

    if (isChartEmpty) {
      return (
        <div className="echReactiveChart_unavailable">
          <p>No data to display</p>
        </div>
      );
    }

    let brushProps = {};
    // const isBrushEnabled = this.props.chartStore!.isBrushEnabled();
    // if (isBrushEnabled) {
    //   brushProps = {
    //     onMouseDown: this.onStartBrusing,
    //     onMouseMove: this.onBrushing,
    //   };
    // }

    return (
      <Stage
        width={parentDimensions.width}
        height={parentDimensions.height}
        style={{
          width: '100%',
          height: '100%',
        }}
        {...brushProps}
      >
        {/* <Layer hitGraphEnabled={false} listening={false}>
          {this.renderGrids()}
        </Layer>
        <Layer hitGraphEnabled={false} listening={false}>
          {this.renderAxes()}
        </Layer> */}

        <Layer
          x={chartDimensions.left + chartTransform.x}
          y={chartDimensions.top + chartTransform.y}
          rotation={chartRotation}
          hitGraphEnabled={false}
          listening={false}
        >
          {this.sortAndRenderElements()}
        </Layer>

        {debug && (
          <Layer hitGraphEnabled={false} listening={false}>
            {this.renderDebugChartBorders()}
          </Layer>
        )}

        {/* {isBrushEnabled && (
          <Layer hitGraphEnabled={false} listening={false}>
            {this.renderBrushTool()}
          </Layer>
        )}

        <Layer hitGraphEnabled={false} listening={false}>
          {this.renderBarValues()}
        </Layer> */}
      </Stage>
    );
  }

  private renderDebugChartBorders = () => {
    const { chartDimensions } = this.props.settings;
    return (
      <Rect
        x={chartDimensions.left}
        y={chartDimensions.top}
        width={chartDimensions.width}
        height={chartDimensions.height}
        stroke="red"
        strokeWidth={4}
        listening={false}
        dash={[4, 4]}
      />
    );
  };

  // private getHighlightedLegendItem = () => {
  //   return this.props.chartStore!.highlightedLegendItem.get();
  // };
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      onBrushStart,
      onBrushEnd,
      onCursorPositionChange,
    },
    dispatch,
  );
const mapStateToProps = (state: IChartState) => ({
  initialized: state.initialized,
  geometries: getRenderedGeometries(state),
  settings: state.settings,
  isChartEmpty: false,
});

export const ReactiveChart = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chart);
