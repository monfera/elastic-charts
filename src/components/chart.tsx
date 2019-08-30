import React, { CSSProperties } from 'react';
import classNames from 'classnames';
import { Provider } from 'react-redux';
import { SpecsParser } from '../specs/specs_parser';
import { ChartResizer } from './chart_resizer';
import { Legend } from './legend/legend';
import { ChartContainer } from './react_canvas/chart_container';
import { isHorizontal } from '../chart_types/xy_chart/utils/axis_utils';
import { Position } from '../chart_types/xy_chart/utils/specs';
import { CursorEvent } from '../specs/settings';
import { ChartSize, getChartSize } from '../utils/chart_size';
import { chartStoreReducer } from '../store/chart_store';
import { createStore } from 'redux';
interface ChartProps {
  /** The type of rendered
   * @default 'canvas'
   */
  renderer: 'svg' | 'canvas';
  size?: ChartSize;
  className?: string;
  id?: string;
}

interface ChartState {
  legendPosition: Position;
}

export class Chart extends React.Component<ChartProps, ChartState> {
  static defaultProps: ChartProps = {
    renderer: 'canvas',
  };
  private chartStore: any;
  constructor(props: any) {
    super(props);
    this.chartStore = createStore(chartStoreReducer);
    this.state = {
      legendPosition: this.chartSpecStore.legendPosition.get(),
    };
    // value is set to chart_store in settings so need to watch the value
    this.chartSpecStore.legendPosition.observe(({ newValue: legendPosition }) => {
      this.setState({
        legendPosition,
      });
    });
  }

  static getContainerStyle = (size: any): CSSProperties => {
    if (size) {
      return {
        position: 'relative',
        ...getChartSize(size),
      };
    }
    return {};
  };

  dispatchExternalCursorEvent(event?: CursorEvent) {
    this.chartSpecStore.setActiveChartId(event && event.chartId);
    const isActiveChart = this.chartSpecStore.isActiveChart.get();

    if (!event) {
      this.chartSpecStore.externalCursorShown.set(false);
      this.chartSpecStore.isCursorOnChart.set(false);
    } else {
      if (
        !isActiveChart &&
        this.chartSpecStore.xScale!.type === event.scale &&
        (event.unit === undefined || event.unit === this.chartSpecStore.xScale!.unit)
      ) {
        this.chartSpecStore.setCursorValue(event.value);
      }
    }
  }

  render() {
    const { size, className } = this.props;
    const containerStyle = Chart.getContainerStyle(size);
    const Horizontal = isHorizontal(this.state.legendPosition);
    const chartClassNames = classNames('echChart', className, {
      'echChart--column': Horizontal,
    });
    return (
      <Provider store={this.chartStore}>
        <div style={containerStyle} className={chartClassNames}>
          <Legend />
          <SpecsParser>{this.props.children}</SpecsParser>
          <div className="echContainer">
            <ChartResizer />
            <ChartContainer />
          </div>
        </div>
      </Provider>
    );
  }
}
