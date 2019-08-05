import { DomainRange, Position, Rendering, Rotation } from '../chart_types/xy_chart/utils/specs';
import { PartialTheme, Theme } from '../utils/themes/theme';
import { Domain } from '../utils/domain';
import { TooltipType, TooltipValueFormatter } from '../chart_types/xy_chart/utils/interactions';
import {
  BrushEndListener,
  ElementClickListener,
  ElementOverListener,
  LegendItemListener,
  CursorUpdateListener,
} from '../chart_types/xy_chart/store/chart_state';
import { ChartTypes } from '../store/chart_store';
import { getConnect, specComponentFactory } from '../store/spec_factory';
import { Spec } from '.';
import { LIGHT_THEME } from '../utils/themes/light_theme';
import { ScaleTypes } from '../utils/scales/scales';

export const DEFAULT_TOOLTIP_TYPE = TooltipType.VerticalCursor;
export const DEFAULT_TOOLTIP_SNAP = true;

/**
 * Event used to syncronize cursors between Charts.
 *
 * fired as callback argument for `CursorUpdateListener`
 */
export interface CursorEvent {
  chartId: string;
  scale: ScaleTypes;
  /**
   * @todo
   * unit for event (i.e. `time`, `feet`, `count`, etc.)
   */
  unit?: string;
  value: number | string;
}

interface TooltipProps {
  type?: TooltipType;
  snap?: boolean;
  headerFormatter?: TooltipValueFormatter;
  unit?: string;
  value: number | string;
}

export interface SettingsSpec extends Spec {
  /**
   * Partial theme to be merged with base
   *
   * or
   *
   * Array of partial themes to be merged with base
   * index `0` being the hightest priority
   *
   * i.e. `[primary, secondary, tertiary]`
   */
  theme?: PartialTheme | PartialTheme[];
  /**
   * Full default theme to use as base
   *
   * @default `LIGHT_THEME`
   */
  baseTheme?: Theme;
  rendering: Rendering;
  rotation: Rotation;
  animateData: boolean;
  showLegend: boolean;
  /** Either a TooltipType or an object with configuration of type, snap, and/or headerFormatter */
  tooltip: TooltipType | TooltipProps;
  debug: boolean;
  legendPosition?: Position;
  showLegendDisplayValue: boolean;
  onElementClick?: ElementClickListener;
  onElementOver?: ElementOverListener;
  onElementOut?: () => undefined | void;
  onBrushEnd?: BrushEndListener;
  onLegendItemOver?: LegendItemListener;
  onLegendItemOut?: () => undefined | void;
  onLegendItemClick?: LegendItemListener;
  onLegendItemPlusClick?: LegendItemListener;
  onLegendItemMinusClick?: LegendItemListener;
  onCursorUpdate?: CursorUpdateListener;
  xDomain?: Domain | DomainRange;
  resizeDebounce?: number;
}

export type DefaultSettingsProps =
  | 'id'
  | 'chartType'
  | 'specType'
  | 'rendering'
  | 'rotation'
  | 'resizeDebounce'
  | 'animateData'
  | 'showLegend'
  | 'debug'
  | 'tooltip'
  | 'showLegendDisplayValue'
  | 'theme';

export const DEFAULT_SETTINGS: Pick<SettingsSpec, DefaultSettingsProps> = {
  id: '__global__settings___',
  chartType: ChartTypes.Global,
  specType: 'settings',
  rendering: 'canvas',
  rotation: 0,
  animateData: true,
  showLegend: false,
  resizeDebounce: 10,
  debug: false,
  tooltip: {
    type: DEFAULT_TOOLTIP_TYPE,
    snap: DEFAULT_TOOLTIP_SNAP,
    value: '',
  },
  showLegendDisplayValue: true,
  theme: LIGHT_THEME,
};
export const Settings = getConnect()(specComponentFactory<SettingsSpec, DefaultSettingsProps>(DEFAULT_SETTINGS));
