import { AreaSeriesStyle, LineSeriesStyle, BarSeriesStyle, PointStyle } from '../../../utils/themes/theme';
import { Accessor, AccessorFormat } from '../../../utils/accessor';
import { RecursivePartial } from '../../../utils/commons';
import { ScaleContinuousType, ScaleType } from '../../../utils/scales/scales';
import { CurveType } from '../../../utils/curves';
import { RawDataSeriesDatum } from './series';
import { DataSeriesColorsValues } from './series';
import { Spec } from '../../../specs';
import { GeometryId } from '../../../utils/geometry';

export type Datum = any;
export type Rotation = 0 | 90 | -90 | 180;
export type Rendering = 'canvas' | 'svg';
export type Color = string;
export type BarStyleOverride = RecursivePartial<BarSeriesStyle> | Color | null;
export type PointStyleOverride = RecursivePartial<PointStyle> | Color | null;
/**
 * Override for bar styles per datum
 *
 * Return types:
 * - `Color`: Color value as a `string` will set the bar `fill` to that color
 * - `RecursivePartial<BarSeriesStyle>`: Style values to be merged with base bar styles
 * - `null`: Keep existing bar style
 */
export type BarStyleAccessor = (datum: RawDataSeriesDatum, geometryId: GeometryId) => BarStyleOverride;
/**
 * Override for bar styles per datum
 *
 * Return types:
 * - `Color`: Color value as a `string` will set the point `stroke` to that color
 * - `RecursivePartial<PointStyle>`: Style values to be merged with base point styles
 * - `null`: Keep existing point style
 */
export type PointStyleAccessor = (datum: RawDataSeriesDatum, geometryId: GeometryId) => PointStyleOverride;
export const DEFAULT_GLOBAL_ID = '__global__';

interface DomainMinInterval {
  /** Custom minInterval for the domain which will affect data bucket size.
   * The minInterval cannot be greater than the computed minimum interval between any two adjacent data points.
   * Further, if you specify a custom numeric minInterval for a timeseries, please note that due to the restriction
   * above, the specified numeric minInterval will be interpreted as a fixed interval.
   * This means that, for example, if you have yearly timeseries data that ranges from 2016 to 2019 and you manually
   * compute the interval between 2016 and 2017, you'll have 366 days due to 2016 being a leap year.  This will not
   * be a valid interval because it is greater than the computed minInterval of 365 days betwen the other years.
   */
  minInterval?: number;
}

interface LowerBound {
  /** Lower bound of domain rangme */
  min: number;
}

interface UpperBound {
  /** Upper bound of domain range */
  max: number;
}

export type LowerBoundedDomain = DomainMinInterval & LowerBound;
export type UpperBoundedDomain = DomainMinInterval & UpperBound;
export type CompleteBoundedDomain = DomainMinInterval & LowerBound & UpperBound;
export type UnboundedDomainWithInterval = DomainMinInterval;

export type DomainRange = LowerBoundedDomain | UpperBoundedDomain | CompleteBoundedDomain | UnboundedDomainWithInterval;

export interface DisplayValueSpec {
  /** Show value label in chart element */
  showValueLabel?: boolean;
  /** If value labels are shown, skips every other label */
  isAlternatingValueLabel?: boolean;
  /** Function for formatting values; will use axis tickFormatter if none specified */
  valueFormatter?: TickFormatter;
  /** If true will contain value label within element, else dimensions are computed based on value */
  isValueContainedInElement?: boolean;
  /** If true will hide values that are clipped at chart edges */
  hideClippedValue?: boolean;
}

export interface SeriesSpec extends Spec {
  /** The name or label of the spec */
  name?: string;
  /** The ID of the spec group, generated via getGroupId method
   * @default __global__
   */
  groupId: string;
  /** when using a different groupId this option will allow compute in the same domain of the global domain */
  useDefaultGroupDomain?: boolean;
  /** An array of data */
  data: Datum[] | number[][];
  /** the type of series */
  seriesType: 'bar' | 'line' | 'area';
  /** Custom colors for series */
  customSeriesColors?: CustomSeriesColorsMap;
  /** If the series should appear in the legend
   * @default false
   */
  hideInLegend?: boolean;
  /** Index per series to sort by */
  sortIndex?: number;
  displayValueSettings?: DisplayValueSpec;
  /**
   * Postfix string or accessor function for y1 accessor when using `y0Accessors`
   *
   * @default ' - upper'
   */
  y0AccessorFormat?: AccessorFormat;
  /**
   * Postfix string or accessor function for y1 accessor when using `y0Accessors`
   *
   * @default ' - lower'
   */
  y1AccessorFormat?: AccessorFormat;

  specType: 'series';
  chartType: 'xy_axis';
}

export interface Postfixes {
  /**
   * Postfix for y1 accessor when using `y0Accessors`
   *
   * @default 'upper'
   */
  y0AccessorFormat?: string;
  /**
   * Postfix for y1 accessor when using `y0Accessors`
   *
   * @default 'lower'
   */
  y1AccessorFormat?: string;
}

export type CustomSeriesColorsMap = Map<DataSeriesColorsValues, string>;

export interface SeriesAccessors {
  /** The field name of the x value on Datum object */
  xAccessor: Accessor;
  /** An array of field names one per y metric value */
  yAccessors: Accessor[];
  /** An optional accessor of the y0 value: base point for area/bar charts  */
  y0Accessors?: Accessor[];
  /** An array of fields thats indicates the datum series membership */
  splitSeriesAccessors?: Accessor[];
  /** An array of fields thats indicates the stack membership */
  stackAccessors?: Accessor[];
}

export interface SeriesScales {
  /**
   * The x axis scale type
   * @default ScaleType.Ordinal
   */
  xScaleType: typeof ScaleType.Ordinal | typeof ScaleType.Linear | typeof ScaleType.Time;
  /**
   * If using a ScaleType.Time this timezone identifier is required to
   * compute a nice set of xScale ticks. Can be any IANA zone supported by
   * the host environment, or a fixed-offset name of the form 'utc+3',
   * or the strings 'local' or 'utc'.
   */
  timeZone?: string;
  /**
   * The y axis scale type
   * @default ScaleType.Linear
   */
  yScaleType: ScaleContinuousType;
  /**
   * if true, the min y value is set to the minimum domain value, 0 otherwise
   * @default false
   */
  yScaleToDataExtent: boolean;
}

export type BasicSeriesSpec = SeriesSpec & SeriesAccessors & SeriesScales;

/**
 * This spec describe the dataset configuration used to display a bar series.
 */
export type BarSeriesSpec = BasicSeriesSpec &
  Postfixes & {
    /** @default bar */
    seriesType: 'bar';
    /** If true, will stack all BarSeries and align bars to ticks (instead of centered on ticks) */
    barSeriesStyle?: RecursivePartial<BarSeriesStyle>;
    /**
     * Stack each series in percentage for each point.
     */
    stackAsPercentage?: boolean;
    /**
     * An optional functional accessor to return custom color or style for bar datum
     */
    styleAccessor?: BarStyleAccessor;
  };

/**
 * This spec describe the dataset configuration used to display a line series.
 */
export type LineSeriesSpec = BasicSeriesSpec & {
  /** @default line */
  seriesType: 'line';
  curve?: CurveType;
  lineSeriesStyle?: RecursivePartial<LineSeriesStyle>;
  /**
   * An optional functional accessor to return custom color or style for point datum
   */
  pointStyleAccessor?: PointStyleAccessor;
  /**
   * Stack each series in percentage for each point.
   */
  stackAsPercentage?: boolean;
};

/**
 * This spec describe the dataset configuration used to display an area series.
 */
export type AreaSeriesSpec = BasicSeriesSpec &
  Postfixes & {
    /** @default area */
    seriesType: 'area';
    /** The type of interpolator to be used to interpolate values between points */
    curve?: CurveType;
    areaSeriesStyle?: RecursivePartial<AreaSeriesStyle>;
    /**
     * Stack each series in percentage for each point.
     */
    stackAsPercentage?: boolean;
    /**
     * An optional functional accessor to return custom color or style for point datum
     */
    pointStyleAccessor?: PointStyleAccessor;
  };

export type TickFormatter = (value: any) => string;

/**
 * The position of the axis relative to the chart.
 * A left or right positioned axis is a vertical axis.
 * A top or bottom positioned axis is an horizontal axis.
 */
export const Position = Object.freeze({
  Top: 'top' as 'top',
  Bottom: 'bottom' as 'bottom',
  Left: 'left' as 'left',
  Right: 'right' as 'right',
});

export type Position = typeof Position.Top | typeof Position.Bottom | typeof Position.Left | typeof Position.Right;

export function isBarSeriesSpec(spec: BasicSeriesSpec): spec is BarSeriesSpec {
  return spec.seriesType === 'bar';
}

export function isLineSeriesSpec(spec: BasicSeriesSpec): spec is LineSeriesSpec {
  return spec.seriesType === 'line';
}

export function isAreaSeriesSpec(spec: BasicSeriesSpec): spec is AreaSeriesSpec {
  return spec.seriesType === 'area';
}

export function isBandedSpec(y0Accessors: SeriesAccessors['y0Accessors']): boolean {
  return Boolean(y0Accessors && y0Accessors.length > 0);
}
