import { createSelector } from 'reselect';
import { Point } from 'utils/point';
import { getAxisCursorPositionSelector } from './get_axis_cursor_position';
import { ComputedScales } from '../utils';
import { getComputedScalesSelector } from './get_computed_scales';
import { getGeometriesIndexKeysSelector } from './get_geometries_index_keys';

import { getGeometriesIndexSelector } from './get_geometries_index';
import { IndexedGeometry } from 'utils/geometry';

export const getElementAtCursorPositionSelector = createSelector(
  [
    getAxisCursorPositionSelector,
    getComputedScalesSelector,
    getGeometriesIndexKeysSelector,
    getGeometriesIndexSelector,
  ],
  getElementAtCursorPosition,
);

function getElementAtCursorPosition(
  axisCursorPosition: Point,
  scales: ComputedScales,
  geometriesIndexKeys: any,
  geometriesIndex: Map<any, IndexedGeometry[]>,
): IndexedGeometry[] {
  const xValue = scales.xScale.invertWithStep(axisCursorPosition.x, geometriesIndexKeys);

  // get the elements on at this cursor position
  return geometriesIndex.get(xValue) || [];
}
