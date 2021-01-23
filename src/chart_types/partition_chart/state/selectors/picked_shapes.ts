/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import createCachedSelector from 're-reselect';

import { LayerValue } from '../../../../specs';
import { GlobalChartState } from '../../../../state/chart_state';
import { QuadViewModel } from '../../layout/types/viewmodel_types';
import {
  PARENT_KEY,
  DEPTH_KEY,
  AGGREGATE_KEY,
  CHILDREN_KEY,
  SORT_INDEX_KEY,
  PATH_KEY,
} from '../../layout/utils/group_by_rollup';
import { partitionGeometries } from './geometries';

function getCurrentPointerPosition(state: GlobalChartState) {
  return state.interactions.pointer.current.position;
}

/** @internal */
export const getPickedShapes = createCachedSelector(
  [partitionGeometries, getCurrentPointerPosition],
  (geoms, pointerPosition): QuadViewModel[] => {
    const picker = geoms.pickQuads;
    const { diskCenter } = geoms;
    const x = pointerPosition.x - diskCenter.x;
    const y = pointerPosition.y - diskCenter.y;
    return picker(x, y);
  },
)((state) => state.chartId);

/** @internal */
export const getPickedShapesLayerValues = createCachedSelector(
  [getPickedShapes],
  pickShapesLayerValues,
)((state) => state.chartId);

/** @internal */
export function pickShapesLayerValues(pickedShapes: QuadViewModel[]): Array<Array<LayerValue>> {
  const maxDepth = pickedShapes.reduce((acc, curr) => Math.max(acc, curr.depth), 0);
  const elements = pickedShapes
    .filter(({ depth }) => depth === maxDepth) // eg. lowest layer in a treemap, where layers overlap in screen space; doesn't apply to sunburst/flame
    .map<Array<LayerValue>>((model) => {
      const values: Array<LayerValue> = [];
      values.push({
        groupByRollup: model.dataName,
        value: model[AGGREGATE_KEY],
        depth: model[DEPTH_KEY],
        sortIndex: model[SORT_INDEX_KEY],
        path: model[PATH_KEY],
      });
      let node = model[PARENT_KEY];
      let index = node.sortIndex;
      while (node[DEPTH_KEY] > 0) {
        const value = node[AGGREGATE_KEY];
        const dataName = node[PARENT_KEY][CHILDREN_KEY][index][0];
        values.push({
          groupByRollup: dataName,
          value,
          depth: node[DEPTH_KEY],
          sortIndex: node[SORT_INDEX_KEY],
          path: node[PATH_KEY],
        });

        node = node[PARENT_KEY];
        index = node[SORT_INDEX_KEY];
      }
      return values.reverse();
    });
  return elements;
}
