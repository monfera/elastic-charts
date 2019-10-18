import createCachedSelector from 're-reselect';
import { ComputedScales } from '../utils';
import { getComputedScalesSelector } from './get_computed_scales';
import { getGeometriesIndexKeysSelector } from './get_geometries_index_keys';
import { getGeometriesIndexSelector } from './get_geometries_index';
import { IndexedGeometry } from '../../../../utils/geometry';

export const getElementAtCursorPositionSelector = createCachedSelector(
  [getComputedScalesSelector, getGeometriesIndexKeysSelector, getGeometriesIndexSelector],
  getElementAtCursorPosition,
)((state) => state.chartId);

function getElementAtCursorPosition(
  scales: ComputedScales,
  geometriesIndexKeys: any,
  geometriesIndex: Map<any, IndexedGeometry[]>,
): IndexedGeometry[] {
  const xValue = scales.xScale.invertWithStep(0, geometriesIndexKeys);

  // get the elements on at this cursor position
  return geometriesIndex.get(xValue.value) || [];
}
