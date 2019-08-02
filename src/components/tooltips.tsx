import classNames from 'classnames';
import React from 'react';
import { TooltipValue, TooltipValueFormatter } from '../chart_types/xy_chart/utils/interactions';
import { connect } from 'react-redux';
import { IChartState } from '../store/chart_store';
import { getTooltipHeaderFormatterSelector } from '../chart_types/xy_chart/store/selectors/get_tooltip_header_formatter';
import { getTooltipPositionSelector } from '../chart_types/xy_chart/store/selectors/get_tooltip_position';
import { isInitialized } from '../store/selectors/is_initialized';
import { getTooltipValuesSelector } from '../chart_types/xy_chart/store/selectors/get_tooltip_values_highlighted_geoms';
import { isTooltipVisibleSelector } from '../chart_types/xy_chart/store/selectors/is_tooltip_visible';

interface TooltipProps {
  isTooltipVisible: boolean;
  tooltipValues: TooltipValue[];
  tooltipPosition: { transform: string };
  tooltipHeaderFormatter?: TooltipValueFormatter;
}

class TooltipsComponent extends React.Component<TooltipProps> {
  static displayName = 'Tooltips';

  renderHeader(headerData?: TooltipValue, formatter?: TooltipValueFormatter) {
    if (!headerData) {
      return null;
    }

    return formatter ? formatter(headerData) : headerData.value;
  }

  render() {
    const { isTooltipVisible, tooltipValues, tooltipPosition, tooltipHeaderFormatter } = this.props;

    if (!isTooltipVisible) {
      return <div className="echTooltip echTooltip--hidden" />;
    }

    return (
      <div className="echTooltip" style={{ transform: tooltipPosition.transform }}>
        <div className="echTooltip__header">{this.renderHeader(tooltipValues[0], tooltipHeaderFormatter)}</div>
        <div className="echTooltip__list">
          {tooltipValues.slice(1).map(({ name, value, color, isHighlighted, seriesKey, yAccessor }) => {
            const classes = classNames('echTooltip__item', {
              /* eslint @typescript-eslint/camelcase:0 */
              echTooltip__rowHighlighted: isHighlighted,
            });
            return (
              <div
                key={`${seriesKey}--${yAccessor}`}
                className={classes}
                style={{
                  borderLeftColor: color,
                }}
              >
                <span className="echTooltip__label">{name}</span>
                <span className="echTooltip__value">{value}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = () => ({});
const mapStateToProps = (state: IChartState) => {
  if (!isInitialized(state)) {
    return {
      initialized: false,
      isTooltipVisible: false,
      tooltipValues: [],
      tooltipPosition: { transform: '' },
      tooltipHeaderFormatter: undefined,
    };
  }
  return {
    initialized: isInitialized(state),
    isTooltipVisible: isTooltipVisibleSelector(state),
    tooltipValues: getTooltipValuesSelector(state),
    tooltipPosition: getTooltipPositionSelector(state),
    tooltipHeaderFormatter: getTooltipHeaderFormatterSelector(state),
  };
};

export const Tooltips = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TooltipsComponent);
