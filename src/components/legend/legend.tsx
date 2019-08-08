import classNames from 'classnames';
import React, { createRef } from 'react';
import { connect } from 'react-redux';
import { isVertical, isHorizontal } from '../../chart_types/xy_chart/utils/axis_utils';
import { LegendItem as SeriesLegendItem } from '../../chart_types/xy_chart/legend/legend';
import { Position } from '../../chart_types/xy_chart/utils/specs';
import { IChartState } from 'store/chart_store';
import { isInitialized } from 'store/selectors/is_initialized';
import { computeLegendSelector } from 'chart_types/xy_chart/store/selectors/compute_legend';
import { getSettingsSpecSelector } from 'store/selectors/get_settings_specs';
import { getChartThemeSelector } from 'store/selectors/get_chart_theme';
import { getLegendTooltipValuesSelector } from '../../chart_types/xy_chart/store/selectors/get_legend_tooltip_values';
import { onToggleLegend, onLegendItemOver, onLegendItemOut } from 'store/actions/legend';
import { Dispatch, bindActionCreators } from 'redux';
import { LIGHT_THEME } from 'utils/themes/light_theme';
import { LegendItem } from './legend_item';
import { Theme } from '../../utils/themes/theme';

interface LegendProps {
  legendId: string;
  initialized: boolean;
  chartInitialized: boolean; //TODO
  legendInitialized: boolean; //TODO
  isCursorOnChart: boolean; //TODO
  legendItems: Map<string, SeriesLegendItem>;
  legendPosition?: Position;
  legendItemTooltipValues: Map<string, string>;
  showLegend: boolean;
  legendCollapsed: boolean;
  debug: boolean;
  chartTheme: Theme;
  toggleLegend: () => void;
  onLegendItemOut: () => void;
  onLegendItemOver: (legendItem: string) => void;
}

interface LegendState {
  width?: number;
}

interface LegendStyle {
  maxHeight?: string;
  maxWidth?: string;
  width?: string;
}

interface LegendListStyle {
  paddingTop?: number | string;
  paddingBottom?: number | string;
  paddingLeft?: number | string;
  paddingRight?: number | string;
  gridTemplateColumns?: string;
}

class LegendComponent extends React.Component<LegendProps, LegendState> {
  static displayName = 'Legend';
  state = {
    width: undefined,
  };

  private echLegend = createRef<HTMLDivElement>();

  componentDidUpdate() {
    const { chartInitialized, chartTheme, legendPosition } = this.props;
    if (this.echLegend.current && isVertical(legendPosition) && this.state.width === undefined && !chartInitialized) {
      const buffer = chartTheme.legend.spacingBuffer;

      this.setState({
        width: this.echLegend.current.offsetWidth + buffer,
      });
    }
  }

  render() {
    const {
      legendInitialized,
      chartInitialized,
      legendItems,
      legendPosition,
      showLegend,
      debug,
      chartTheme,
    } = this.props;

    if (!showLegend || !legendInitialized.get() || legendItems.size === 0) {
      return null;
    }

    const legendContainerStyle = this.getLegendStyle(legendPosition, chartTheme);
    const legendListStyle = this.getLegendListStyle(legendPosition, chartTheme);
    const legendClasses = classNames('echLegend', `echLegend--${legendPosition}`, {
      'echLegend--debug': debug,
      invisible: !chartInitialized,
    });

    return (
      <div ref={this.echLegend} className={legendClasses}>
        <div style={legendContainerStyle} className="echLegendListContainer">
          <div style={legendListStyle} className="echLegendList">
            {[...legendItems.values()].map(this.renderLegendElement)}
          </div>
        </div>
      </div>
    );
  }

  getLegendListStyle = (position: Position, { chartMargins, legend }: Theme): LegendListStyle => {
    const { top: paddingTop, bottom: paddingBottom, left: paddingLeft, right: paddingRight } = chartMargins;

    if (isHorizontal(position)) {
      return {
        paddingLeft,
        paddingRight,
        gridTemplateColumns: `repeat(auto-fill, minmax(${legend.verticalWidth}px, 1fr))`,
      };
    }

    return {
      paddingTop,
      paddingBottom,
    };
  };

  getLegendStyle = (position: Position, { legend }: Theme): LegendStyle => {
    if (isVertical(position)) {
      if (this.state.width !== undefined) {
        const threshold = Math.min(this.state.width!, legend.verticalWidth);
        const width = `${threshold}px`;

        return {
          width,
          maxWidth: width,
        };
      }

      return {
        maxWidth: `${legend.verticalWidth}px`,
      };
    }

    return {
      maxHeight: `${legend.horizontalHeight}px`,
    };
  };

  onLegendItemMouseover = (legendItemKey: string) => () => {
    this.props.onLegendItemOver(legendItemKey);
  };

  onLegendItemMouseout = () => {
    this.props.onLegendItemOut();
  };

  private renderLegendElement = (item: SeriesLegendItem) => {
    const { key, displayValue } = item;
    const { legendPosition, isCursorOnChart } = this.props;
    const tooltipValues = this.props.legendItemTooltipValues;
    let tooltipValue;

    if (tooltipValues && tooltipValues.get(key)) {
      tooltipValue = tooltipValues.get(key);
    }

    const newDisplayValue = tooltipValue != null ? tooltipValue : '';

    return (
      <LegendItem
        {...item}
        key={key}
        legendItemKey={key}
        legendPosition={legendPosition}
        displayValue={isCursorOnChart ? newDisplayValue : displayValue.formatted}
        onMouseEnter={this.onLegendItemMouseover(key)}
        onMouseLeave={this.onLegendItemMouseout}
      />
    );
  };
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      toggleLegend: onToggleLegend,
      onLegendItemOut,
      onLegendItemOver,
    },
    dispatch,
  );

const mapStateToProps = (state: IChartState) => {
  if (!isInitialized(state)) {
    return {
      chartInitialized: false, //TODO
      legendInitialized: false, //TODO
      isCursorOnChart: false, //TODO
      initialized: false,
      legendItems: new Map(),
      showLegend: false,
      legendCollapsed: false,
      legendItemTooltipValues: new Map(),
      debug: false,
      chartTheme: LIGHT_THEME,
    };
  }
  const settingsSpec = getSettingsSpecSelector(state);
  return {
    chartInitialized: false, //TODO
    legendInitialized: false, //TODO
    isCursorOnChart: false, //TODO
    initialized: isInitialized(state),
    legendItems: computeLegendSelector(state),
    legendPosition: settingsSpec.legendPosition,
    showLegend: settingsSpec.showLegend,
    legendCollapsed: state.interactions.legendCollapsed,
    legendItemTooltipValues: getLegendTooltipValuesSelector(state),
    debug: settingsSpec.debug,
    chartTheme: getChartThemeSelector(state),
  };
};

export const Legend = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LegendComponent);
