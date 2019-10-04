import { getSettingsSpecSelector } from '../../../../state/selectors/get_settings_specs';
import createCachedSelector from 're-reselect';
import {
  getTooltipValuesAndGeometriesSelector,
  TooltipAndHighlightedGeoms,
} from './get_tooltip_values_highlighted_geoms';
import { SettingsSpec } from '../../../../specs';
import { GlobalChartState } from '../../../../state/chart_state';
import { IndexedGeometry } from '../../../../utils/geometry';
import { Selector } from 'react-redux';
import { ChartTypes } from '../../../index';

interface Props {
  settings: SettingsSpec | undefined;
  highlightedGeometries: IndexedGeometry[];
}

function isOverElement(prevProps: Props | null, nextProps: Props | null) {
  if (!nextProps) {
    return false;
  }
  if (!nextProps.settings || !nextProps.settings.onElementOver) {
    return false;
  }
  const { highlightedGeometries: nextGeomValues } = nextProps;
  const prevGeomValues = prevProps ? prevProps.highlightedGeometries : [];
  if (nextGeomValues.length > 0) {
    if (nextGeomValues.length !== prevGeomValues.length) {
      return true;
    }
    return !nextGeomValues.every(({ value: next }, index) => {
      const prev = prevGeomValues[index].value;
      return prev && prev.x === next.x && prev.y === next.y && prev.accessor === next.accessor;
    });
  }

  return false;
}

/**
 * Will call the onElementOver listener every time the following preconditions are met:
 * - the onElementOver listener is available
 * - we have a new set of highlighted geometries on our state
 */
export function createOnElementOverCaller(): (state: GlobalChartState) => void {
  let prevProps: Props | null = null;
  let selector: Selector<GlobalChartState, void> | null = null;
  return (state: GlobalChartState) => {
    if (selector === null && state.chartType === ChartTypes.XYAxis) {
      selector = createCachedSelector(
        [getTooltipValuesAndGeometriesSelector, getSettingsSpecSelector],
        ({ highlightedGeometries }: TooltipAndHighlightedGeoms, settings: SettingsSpec): void => {
          const nextProps = {
            settings,
            highlightedGeometries,
          };

          if (isOverElement(prevProps, nextProps) && settings.onElementOver) {
            settings.onElementOver(highlightedGeometries.map(({ value }) => value));
          }
          prevProps = nextProps;
        },
      )({
        keySelector: (state) => state.chartId,
      });
    }
    if (selector) {
      selector(state);
    }
  };
}
