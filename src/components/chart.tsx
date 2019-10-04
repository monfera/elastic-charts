import React, { CSSProperties } from 'react';
import classNames from 'classnames';
import { Provider } from 'react-redux';
import { SpecsParser } from '../specs/specs_parser';
import { ChartResizer } from './chart_resizer';
import { Legend } from './legend/legend';
import { ChartContainer } from './chart_container';
import { isHorizontalAxis } from '../chart_types/xy_chart/utils/axis_utils';
import { Position } from '../chart_types/xy_chart/utils/specs';
// import { CursorEvent } from '../specs/settings';
import { ChartSize, getChartSize } from '../utils/chart_size';
import { chartStoreReducer, GlobalChartState } from '../store/chart_store';
import { createStore, Store } from 'redux';
import uuid from 'uuid';
import { devToolsEnhancer } from 'redux-devtools-extension';
// import { getHighlightedGeomValuesSelector } from 'chart_types/xy_chart/store/selectors/get_tooltip_values_highlighted_geoms';
import { isInitialized } from '../store/selectors/is_initialized';
import { createOnElementOutCaller } from '../chart_types/xy_chart/state/selectors/on_element_out_caller';
import { createOnElementOverCaller } from '../chart_types/xy_chart/state/selectors/on_element_over_caller';
import { createOnElementClickCaller } from 'chart_types/xy_chart/state/selectors/on_element_click_caller';
import { ChartTypes } from 'chart_types';

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
  renderComplete: boolean;
  renderCount: number;
}

export class Chart extends React.Component<ChartProps, ChartState> {
  static defaultProps: ChartProps = {
    renderer: 'canvas',
  };
  private chartStore: Store<GlobalChartState>;
  constructor(props: any) {
    super(props);
    // TODO remove devTools in production
    const storeReducer = chartStoreReducer(uuid.v4());
    this.chartStore = createStore(storeReducer, devToolsEnhancer({ trace: true }));
    this.state = {
      legendPosition: Position.Right,
      renderComplete: false,
      renderCount: 0,
    };
    //TODO
    // this.chartSpecStore.chartInitialized.observe(({ newValue, oldValue }) => {
    //   if (newValue !== oldValue) {
    //     this.setState({
    //       renderComplete: newValue,
    //       renderCount: newValue ? this.state.renderCount + 1 : this.state.renderCount,
    //     });
    //   }
    // });
    // value is set to chart_store in settings so need to watch the value
    //TODO
    // this.chartSpecStore.legendPosition.observe(({ newValue: legendPosition }) => {
    //   this.setState({
    //     legendPosition,
    //   });
    // });
    const onElementClickCaller = createOnElementClickCaller();
    const onElementOverCaller = createOnElementOverCaller();
    const onElementOutCaller = createOnElementOutCaller();
    this.chartStore.subscribe(() => {
      const state = this.chartStore.getState();
      if (!isInitialized(state) && state.chartType !== ChartTypes.XYAxis) {
        return;
      }
      onElementOverCaller(state);
      onElementOutCaller(state);
      onElementClickCaller(state);
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

  dispatchExternalCursorEvent() {
    // dispatchExternalCursorEvent(event?: CursorEvent) {
    // this.chartSpecStore.setActiveChartId(event && event.chartId);
    // const isActiveChart = this.chartSpecStore.isActiveChart.get();
    // if (!event) {
    //   this.chartSpecStore.externalCursorShown.set(false);
    //   this.chartSpecStore.isCursorOnChart.set(false);
    // } else {
    //   if (
    //     !isActiveChart &&
    //     this.chartSpecStore.xScale!.type === event.scale &&
    //     (event.unit === undefined || event.unit === this.chartSpecStore.xScale!.unit)
    //   ) {
    //     this.chartSpecStore.setCursorValue(event.value);
    //   }
    // }
  }

  render() {
    const { size, className } = this.props;
    const { renderComplete, renderCount } = this.state;
    const containerStyle = Chart.getContainerStyle(size);
    const horizontal = isHorizontalAxis(this.state.legendPosition);
    const chartClassNames = classNames('echChart', className, {
      'echChart--column': horizontal,
    });
    return (
      <Provider store={this.chartStore}>
        <div
          style={containerStyle}
          className={chartClassNames}
          data-ech-render-complete={renderComplete}
          data-ech-render-count={renderCount}
        >
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
