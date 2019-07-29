import React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { onCursorPositionChange } from '../../store/actions/cursor';
import { ReactiveChart } from './reactive_chart';
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
        <ReactiveChart />
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
const mapStateToProps = (state: ChartState) => {
  return {
    chartInitialized: true,
    isChartEmpty: true,
    isBrushing: true,
  };
};

export const ChartContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChartContainerComponent);
