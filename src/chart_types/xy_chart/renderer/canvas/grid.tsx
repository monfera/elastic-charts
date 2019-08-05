import React from 'react';
import { Group, Line } from 'react-konva';
import { AxisLinePosition } from '../../utils/axis_utils';
import { DEFAULT_GRID_LINE_CONFIG, GridLineConfig, mergeWithDefaultGridLineConfig } from 'utils/themes/theme';
import { Dimensions } from 'utils/dimensions';
import { AxisId } from 'utils/ids';
import { AxisSpec } from 'chart_types/xy_chart/utils/specs';

interface GridProps {
  chartDimensions: Dimensions;
  debug: boolean;
  gridLineStyle: GridLineConfig | undefined;
  linesPositions: AxisLinePosition[];
}

export class Grid extends React.PureComponent<GridProps> {
  render() {
    return this.renderGrid();
  }
  private renderGridLine = (linePosition: AxisLinePosition, i: number) => {
    const { gridLineStyle } = this.props;

    const config = gridLineStyle ? mergeWithDefaultGridLineConfig(gridLineStyle) : DEFAULT_GRID_LINE_CONFIG;

    return <Line {...config} key={`tick-${i}`} points={linePosition} />;
  };

  private renderGrid = () => {
    const { chartDimensions, linesPositions } = this.props;

    return (
      <Group x={chartDimensions.left} y={chartDimensions.top}>
        <Group key="grid-lines">{linesPositions.map(this.renderGridLine)}</Group>
      </Group>
    );
  };
}

export function renderGrids(
  axesGridLinesPositions: Map<AxisId, AxisLinePosition[]>,
  axesSpecs: AxisSpec[],
  chartDimensions: Dimensions,
  debug: boolean,
) {
  const gridComponents: JSX.Element[] = [];
  axesGridLinesPositions.forEach((axisGridLinesPositions, axisId) => {
    const axisSpec = axesSpecs.find((spec) => spec.id === axisId);
    if (axisSpec && axisGridLinesPositions.length > 0) {
      gridComponents.push(
        <Grid
          key={`axis-grid-${axisId}`}
          chartDimensions={chartDimensions}
          debug={debug}
          gridLineStyle={axisSpec.gridLineStyle}
          linesPositions={axisGridLinesPositions}
        />,
      );
    }
  });
  return gridComponents;
}
