import React from 'react';
import { Group, Line } from 'react-konva';
import { AxisLinePosition } from '../../utils/axis_utils';
import { DEFAULT_GRID_LINE_CONFIG, GridLineConfig, mergeWithDefaultGridLineConfig } from 'utils/themes/theme';
import { Dimensions } from 'utils/dimensions';
import { AxisId } from 'utils/ids';
import { AxisSpec } from 'chart_types/xy_chart/utils/specs';
import { IChartState } from 'store/chart_store';
import { computeChartDimensionsSelector } from 'chart_types/xy_chart/store/selectors/compute_chart_dimensions';
import { getAxisSpecsSelector } from 'chart_types/xy_chart/store/selectors/get_specs';
import { computeAxisVisibleTicksSelector } from 'chart_types/xy_chart/store/selectors/compute_axis_visible_ticks';
import { connect } from 'react-redux';

interface GridProps {
  axesGridLinesPositions: Map<AxisId, AxisLinePosition[]>;
  axesSpecs: AxisSpec[];
  chartDimensions: Dimensions;
}

export class GridComponent extends React.PureComponent<GridProps> {
  render() {
    const { axesGridLinesPositions, axesSpecs, chartDimensions } = this.props;
    const gridComponents: JSX.Element[] = [];
    axesGridLinesPositions.forEach((axisGridLinesPositions, axisId) => {
      const axisSpec = axesSpecs.find((spec) => spec.id === axisId);
      if (axisSpec && axisGridLinesPositions.length > 0) {
        gridComponents.push(
          <Group key={`axis-grid-${axisId}`} x={chartDimensions.left} y={chartDimensions.top}>
            <Group key="grid-lines">
              {axisGridLinesPositions.map((linePosition, index) => {
                return this.renderGridLine(linePosition, index, axisSpec.gridLineStyle);
              })}
            </Group>
          </Group>,
        );
      }
    });

    return gridComponents;
  }
  private renderGridLine = (linePosition: AxisLinePosition, i: number, gridLineStyle?: GridLineConfig) => {
    const config = gridLineStyle ? mergeWithDefaultGridLineConfig(gridLineStyle) : DEFAULT_GRID_LINE_CONFIG;

    return <Line {...config} key={`tick-${i}`} points={linePosition} />;
  };
}

const mapDispatchToProps = () => ({});
const mapStateToProps = (state: IChartState): GridProps => {
  return {
    chartDimensions: computeChartDimensionsSelector(state).chartDimensions,
    axesSpecs: getAxisSpecsSelector(state),
    axesGridLinesPositions: computeAxisVisibleTicksSelector(state).axisGridLinesPositions,
  };
};

export const Grid = connect(
  mapStateToProps,
  mapDispatchToProps,
)(GridComponent);
