import React from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import { AreaGeometries } from './area_geometries';
import { ArcGeometries } from './arc_geometries';
import { BarGeometries } from './bar_geometries';
import { LineGeometries } from './line_geometries';
import { IChartState, GeometriesList, GlobalSettings } from '../../store/chart_store';
import { onBrushStart, onBrushEnd } from '../../store/actions/brush';
import { onCursorPositionChange, CursorPositionChangeAction } from '../../store/actions/cursor';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Point } from '../../chart_types/xy_chart/store/chart_state';
import { ContainerConfig } from 'konva';
import { getRenderedGeometriesSelector } from '../../store/selectors/get_rendered_geometries';
import { getChartDimensionsSelector } from 'store/selectors/get_chart_dimensions';
import { Dimensions } from 'utils/dimensions';
import { isChartAnimatableSelector } from 'chart_types/xy_chart/store/selectors/is_chart_animatable';
import { isInitialized } from 'store/selectors/is_initialized';
import { getChartRotationSelector } from 'store/selectors/get_chart_rotation';
import { getChartThemeSelector } from 'store/selectors/get_chart_theme';
import { Theme, LineAnnotationStyle, RectAnnotationStyle } from 'utils/themes/theme';
import { LIGHT_THEME } from 'utils/themes/light_theme';
import { computeChartTransformSelector } from 'chart_types/xy_chart/store/selectors/compute_chart_transform';
import { Transform } from 'chart_types/xy_chart/store/utils';
import { Rotation, isLineAnnotation, isRectAnnotation, AnnotationSpec } from 'chart_types/xy_chart/utils/specs';
import { AnnotationId } from 'utils/ids';
import {
  AnnotationDimensions,
  AnnotationLineProps,
  AnnotationRectProps,
} from 'chart_types/xy_chart/annotations/annotation_utils';
import { LineAnnotation } from 'chart_types/xy_chart/renderer/canvas/line_annotation';
import { RectAnnotation } from 'chart_types/xy_chart/renderer/canvas/rect_annotation';
import { computeAnnotationDimensionsSelector } from 'chart_types/xy_chart/store/selectors/compute_annotations';
import { getAnnotationSpecsSelector } from 'chart_types/xy_chart/store/selectors/get_specs';
import { isChartEmptySelector } from 'chart_types/xy_chart/store/selectors/is_chart_empty';

interface Props {
  initialized: boolean;
  geometries: GeometriesList;
  globalSettings: GlobalSettings;
  chartRotation: Rotation;
  chartDimensions: Dimensions;
  chartTransform: Transform;
  theme: Theme;
  isChartAnimatable: boolean;
  onCursorPositionChange(x: number, y: number): CursorPositionChangeAction;
  onBrushEnd(start: Point, end: Point): void;
  onBrushStart(): void;
  isChartEmpty: boolean;
  annotationDimensions: Map<AnnotationId, AnnotationDimensions>;
  annotationSpecs: AnnotationSpec[];
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

export interface ReactiveChartElementIndex {
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
    const { geometries, theme, isChartAnimatable } = this.props;
    if (!geometries) {
      return [];
    }
    // const highlightedLegendItem = this.getHighlightedLegendItem();

    const element = (
      <BarGeometries
        key={'bar-geometries'}
        animated={isChartAnimatable}
        bars={geometries.bars || []}
        sharedStyle={theme.sharedStyle}
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
    const { geometries, theme, isChartAnimatable } = this.props;
    if (!geometries) {
      return [];
    }

    // const highlightedLegendItem = this.getHighlightedLegendItem();

    const element = (
      <LineGeometries
        key={'line-geometries'}
        animated={isChartAnimatable}
        lines={geometries.lines || []}
        sharedStyle={theme.sharedStyle}
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
    const { geometries, theme, isChartAnimatable } = this.props;
    if (!geometries) {
      return [];
    }

    // const highlightedLegendItem = this.getHighlightedLegendItem();

    const element = (
      <AreaGeometries
        key={'area-geometries'}
        animated={isChartAnimatable}
        areas={geometries.areas || []}
        sharedStyle={theme.sharedStyle}
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
    const { geometries, theme, isChartAnimatable } = this.props;
    if (!geometries) {
      return [];
    }
    // const highlightedLegendItem = this.getHighlightedLegendItem();

    const element = (
      <ArcGeometries
        key={'arc-geometries'}
        animated={isChartAnimatable}
        arcs={geometries.arcs || []}
        sharedStyle={theme.sharedStyle}
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

  renderAnnotations = (): ReactiveChartElementIndex[] => {
    const {
      annotationDimensions,
      annotationSpecs,
      chartDimensions,
      globalSettings: { debug },
    } = this.props;
    console.log({ annotationDimensions, annotationSpecs });
    const annotationElements: ReactiveChartElementIndex[] = [];
    annotationDimensions.forEach((annotation: AnnotationDimensions, id: AnnotationId) => {
      const spec = annotationSpecs.find((spec) => spec.id === id);

      if (!spec) {
        return;
      }

      const zIndex = spec.zIndex || 0;
      let element;
      console.log({ spec });
      if (isLineAnnotation(spec)) {
        console.log({ lineAnnotatio: spec });
        const lineStyle = spec.style as LineAnnotationStyle;

        element = (
          <LineAnnotation
            key={`annotation-${id}`}
            chartDimensions={chartDimensions}
            debug={debug}
            lines={annotation as AnnotationLineProps[]}
            lineStyle={lineStyle}
          />
        );
      } else if (isRectAnnotation(spec)) {
        console.log('is rect annotation');
        const rectStyle = spec.style as RectAnnotationStyle;

        element = (
          <RectAnnotation
            key={`annotation-${id}`}
            chartDimensions={chartDimensions}
            debug={debug}
            rects={annotation as AnnotationRectProps[]}
            rectStyle={rectStyle}
          />
        );
      }

      if (element) {
        annotationElements.push({
          element,
          zIndex,
        });
      }
    });
    return annotationElements;
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
  //   if (!this.props.chartStore!.isBrushing.get()) {
  //     this.props.chartStore!.onBrushStart();
  //   }
  //   const { brushExtent } = this.props.chartStore!;
  //   const point = getPoint(event.evt, brushExtent);
  //   this.setState(() => ({
  //     brushEnd: point,
  //   }));
  // };

  sortAndRenderElements() {
    const { chartDimensions, chartRotation } = this.props;
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
    const annotations = this.renderAnnotations();

    return [...bars, ...areas, ...lines, ...arcs, ...annotations]
      .sort((elemIdxA, elemIdxB) => elemIdxA.zIndex - elemIdxB.zIndex)
      .map((elemIdx) => elemIdx.element);
  }

  render() {
    const { initialized, globalSettings, chartRotation, chartDimensions, isChartEmpty } = this.props;
    if (!initialized) {
      return null;
    }

    const { debug, parentDimensions } = globalSettings;
    const { chartTransform } = this.props;

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

    const childComponents = React.Children.toArray(this.props.children);
    console.log(childComponents);

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

        {childComponents && childComponents[0] ? childComponents[0] : null}

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

        {childComponents && childComponents[1] ? childComponents[1] : null}
        {/* {isBrushEnabled && (
            <Layer hitGraphEnabled={false} listening={false}>
              {this.renderBrushTool()}
            </Layer>
          )} */}

        {/* 
          <Layer hitGraphEnabled={false} listening={false} {...layerClippings}>
            {this.renderBarValues()}
          </Layer> */}
      </Stage>
    );
  }

  private renderDebugChartBorders = () => {
    const { chartDimensions } = this.props;
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
const mapStateToProps = (state: IChartState) => {
  if (!isInitialized(state)) {
    return {
      initialized: false,
      theme: LIGHT_THEME,
      geometries: {},
      globalSettings: state.settings,
      chartRotation: 0 as 0,
      chartDimensions: getChartDimensionsSelector(state),
      chartTransform: {
        x: 0,
        y: 0,
        rotate: 0,
      },
      isChartAnimatable: false,
      isChartEmpty: true,
      annotationDimensions: new Map(),
      annotationSpecs: [],
    };
  }
  return {
    initialized: state.initialized,
    theme: getChartThemeSelector(state),
    geometries: getRenderedGeometriesSelector(state),
    globalSettings: state.settings,
    chartRotation: getChartRotationSelector(state),
    chartDimensions: getChartDimensionsSelector(state),
    chartTransform: computeChartTransformSelector(state),
    isChartAnimatable: isChartAnimatableSelector(state),
    isChartEmpty: isChartEmptySelector(state),
    annotationDimensions: computeAnnotationDimensionsSelector(state),
    annotationSpecs: getAnnotationSpecsSelector(state),
  };
};

export const ReactiveChart = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chart);
