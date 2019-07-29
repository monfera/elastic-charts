import { Point } from '../../chart_types/xy_chart/store/chart_state';

export const ON_BRUSH_START = 'ON_BRUSH_START';
export const ON_BRUSH_END = 'ON_BRUSH_END';

export interface BrushStartAction {
  type: typeof ON_BRUSH_START;
}
export interface BrushEndAction {
  type: typeof ON_BRUSH_END;
  start: Point;
  end: Point;
}

export function onBrushStart(): BrushStartAction {
  return { type: ON_BRUSH_START };
}

export function onBrushEnd(start: Point, end: Point): BrushEndAction {
  return { type: ON_BRUSH_END, start, end };
}
