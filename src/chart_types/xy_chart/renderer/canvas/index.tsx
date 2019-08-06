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
