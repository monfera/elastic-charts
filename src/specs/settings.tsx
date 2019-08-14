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
import { ScaleTypes } from '../utils/scales/scales';
import { getConnect, specComponentFactory } from '../store/spec_factory';
import { Spec } from '.';
import { LIGHT_THEME } from 'utils/themes/light_theme';
import { ChartTypes } from 'chart_types';
import { GeometryValue } from 'utils/geometry';
import { DataSeriesColorsValues } from 'chart_types/xy_chart/utils/series';

export type ElementClickListener = (values: GeometryValue[]) => void;
export type ElementOverListener = (values: GeometryValue[]) => void;
export type BrushEndListener = (min: number, max: number) => void;
export type LegendItemListener = (dataSeriesIdentifiers: DataSeriesColorsValues | null) => void;

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

export const DEFAULT_TOOLTIP_TYPE = TooltipType.VerticalCursor;
export const DEFAULT_TOOLTIP_SNAP = true;

export const DEFAULT_SETTINGS_SPEC = {
  id: '__global__settings___',
  chartType: ChartTypes.Global,
  specType: 'settings',
  rendering: 'canvas' as 'canvas',
  rotation: 0 as 0,
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
export const Settings = getConnect()(specComponentFactory<SettingsSpec, DefaultSettingsProps>(DEFAULT_SETTINGS_SPEC));
