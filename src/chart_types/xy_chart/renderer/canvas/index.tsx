// renderAxes = () => {
//   const {
//     axesVisibleTicks,
//     axesSpecs,
//     axesTicksDimensions,
//     axesPositions,
//     chartTheme,
//     debug,
//     chartDimensions,
//   } = this.props.chartStore!;

//   const axesComponents: JSX.Element[] = [];
//   axesVisibleTicks.forEach((axisTicks, axisId) => {
//     const axisSpec = axesSpecs.get(axisId);
//     const axisTicksDimensions = axesTicksDimensions.get(axisId);
//     const axisPosition = axesPositions.get(axisId);
//     const ticks = axesVisibleTicks.get(axisId);
//     if (!ticks || !axisSpec || !axisTicksDimensions || !axisPosition) {
//       return;
//     }
//     axesComponents.push(
//       <Axis
//         key={`axis-${axisId}`}
//         axisSpec={axisSpec}
//         axisTicksDimensions={axisTicksDimensions}
//         axisPosition={axisPosition}
//         ticks={ticks}
//         chartTheme={chartTheme}
//         debug={debug}
//         chartDimensions={chartDimensions}
//       />,
//     );
//   });
//   return axesComponents;
// };

// renderGrids = () => {
//   const { axesGridLinesPositions, axesSpecs, chartDimensions, debug } = this.props.chartStore!;

//   const gridComponents: JSX.Element[] = [];
//   axesGridLinesPositions.forEach((axisGridLinesPositions, axisId) => {
//     const axisSpec = axesSpecs.get(axisId);
//     if (axisSpec && axisGridLinesPositions.length > 0) {
//       gridComponents.push(
//         <Grid
//           key={`axis-grid-${axisId}`}
//           chartDimensions={chartDimensions}
//           debug={debug}
//           gridLineStyle={axisSpec.gridLineStyle}
//           linesPositions={axisGridLinesPositions}
//         />,
//       );
//     }
//   });
//   return gridComponents;
// };

// renderAnnotations = (): ReactiveChartElementIndex[] => {
//   const { annotationDimensions, annotationSpecs, chartDimensions, debug } = this.props.chartStore!;

//   const annotationElements: ReactiveChartElementIndex[] = [];
//   annotationDimensions.forEach((annotation: AnnotationDimensions, id: AnnotationId) => {
//     const spec = annotationSpecs.get(id);

//     if (!spec) {
//       return;
//     }

//     const zIndex = spec.zIndex || 0;
//     let element;
//     if (isLineAnnotation(spec)) {
//       const lineStyle = spec.style as LineAnnotationStyle;

//       element = (
//         <LineAnnotation
//           key={`annotation-${id}`}
//           chartDimensions={chartDimensions}
//           debug={debug}
//           lines={annotation as AnnotationLineProps[]}
//           lineStyle={lineStyle}
//         />
//       );
//     } else if (isRectAnnotation(spec)) {
//       const rectStyle = spec.style as RectAnnotationStyle;

//       element = (
//         <RectAnnotation
//           key={`annotation-${id}`}
//           chartDimensions={chartDimensions}
//           debug={debug}
//           rects={annotation as AnnotationRectProps[]}
//           rectStyle={rectStyle}
//         />
//       );
//     }

//     if (element) {
//       annotationElements.push({
//         element,
//         zIndex,
//       });
//     }
//   });
//   return annotationElements;
// };

// renderBarValues = () => {
//   const { debug, chartDimensions, geometries, chartTheme, chartRotation } = this.props.chartStore!;
//   if (!geometries) {
//     return;
//   }
//   const props = {
//     debug,
//     chartDimensions,
//     chartRotation,
//     bars: geometries.bars,
//     // displayValue is guaranteed on style as part of the merged theme
//     displayValueStyle: chartTheme.barSeriesStyle.displayValue!,
//   };
//   return <BarValues {...props} />;
// };

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
