import { SpecId } from './ids';
import { BarSeriesStyle, PointStyle, AreaStyle, LineStyle, ArcStyle } from './themes/theme';

export interface GeometryId {
  specId: SpecId;
  seriesKey: any[];
}

export interface GeometryValue {
  y: any;
  x: any;
  accessor: 'y1' | 'y0';
}

export type IndexedGeometry = PointGeometry | BarGeometry;

export interface PointGeometry {
  x: number;
  y: number;
  radius: number;
  color: string;
  transform: {
    x: number;
    y: number;
  };
  geometryId: GeometryId;
  value: GeometryValue;
}
export interface BarGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  displayValue?: {
    text: any;
    width: number;
    height: number;
    hideClippedValue?: boolean;
    isValueContainedInElement?: boolean;
  };
  geometryId: GeometryId;
  value: GeometryValue;
  seriesStyle: BarSeriesStyle;
}
export interface LineGeometry {
  line: string;
  points: PointGeometry[];
  color: string;
  transform: {
    x: number;
    y: number;
  };
  geometryId: GeometryId;
  seriesLineStyle: LineStyle;
  seriesPointStyle: PointStyle;
}
export interface AreaGeometry {
  area: string;
  lines: string[];
  points: PointGeometry[];
  color: string;
  transform: {
    x: number;
    y: number;
  };
  geometryId: GeometryId;
  seriesAreaStyle: AreaStyle;
  seriesAreaLineStyle: LineStyle;
  seriesPointStyle: PointStyle;
  isStacked: boolean;
}

export interface ArcGeometry {
  arc: string;
  color: string;
  geometryId: GeometryId;
  seriesArcStyle: ArcStyle;
  transform: {
    x: number;
    y: number;
  };
}
export function isPointGeometry(ig: IndexedGeometry): ig is PointGeometry {
  return ig.hasOwnProperty('radius');
}
export function isBarGeometry(ig: IndexedGeometry): ig is BarGeometry {
  return ig.hasOwnProperty('width') && ig.hasOwnProperty('height');
}
