import React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { onCursorPositionChange } from '../../store/actions/cursor';
import { ReactiveChart } from './reactive_chart';
import { isChartEmptySelector } from '../../chart_types/xy_chart/store/selectors/is_chart_empty';
interface ReactiveChartProps {
  chartInitialized: boolean;
  isChartEmpty: boolean;
  onCursorPositionChange: typeof onCursorPositionChange;
  chartCursor: string;
}

class ChartContainerComponent extends React.Component<ReactiveChartProps> {
  static displayName = 'ChartContainer';

  render() {
    const { chartInitialized } = this.props;
    if (!chartInitialized) {
      return null;
    }
    const { onCursorPositionChange, isChartEmpty, isBrushing, chartCursor, handleChartClick } = this.props;
    return (
      <div
        className="echChartCursorContainer"
        style={{
          cursor: chartCursor,
        }}
        onMouseMove={({ nativeEvent: { offsetX, offsetY } }) => {
          if (!isChartEmpty) {
            onCursorPositionChange(offsetX, offsetY);
          }
        }}
        onMouseLeave={() => {
          onCursorPositionChange(-1, -1);
        }}
        onMouseUp={() => {
          if (isBrushing) {
            return;
          }
          handleChartClick();
        }}
      >
        <ChartTypeComponents zIndex={-1} type={'dom'} />
        <ChartResizer />
        <ReactiveChart>
          <Provider store={this.chartStore}>
            <ChartTypeComponents zIndex={-1} type={'canvas'} />
          </Provider>
          <Provider store={this.chartStore}>
            <ChartTypeComponents zIndex={1} type={'canvas'} />
          </Provider>
        </ReactiveChart>
        <ChartTypeComponents zIndex={1} type={'dom'} />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      onCursorPositionChange,
      handleChartClick,
    },
    dispatch,
  );
const mapStateToProps = (state: IChartState) => {
  return {
    initialized: state.initialized,
    isChartEmpty: isChartEmptySelector(state),
    isBrushing: true, //todo
    chartCursor: 'pointer', //todo
  };
};

export const ChartContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChartContainerComponent);
