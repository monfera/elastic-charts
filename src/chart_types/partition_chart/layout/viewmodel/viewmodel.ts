import { Part, Relation, TextMeasure } from '../types/types';
import { linkTextLayout } from './link_text_layout';
import { Config, PartitionLayouts } from '../types/config_types';
import { tau, trueBearingToStandardPositionAngle } from '../utils/math';
import { Distance, /*Pixels,*/ Radius } from '../types/geometry_types';
import { meanAngle } from '../geometry';
import { treemap } from '../utils/treemap';
import { sunburst } from '../utils/sunburst';
import { AccessorFn, IndexedAccessorFn } from '../../../../utils/accessor';
// import { argsToRGB, stringToRGB } from '../utils/d3_utils';
import {
  OutsideLinksViewModel,
  ShapeTreeNode,
  // QuadViewModel,
  RowSet,
  ShapeViewModel,
  RawTextGetter,
  // QuadViewModel,
} from '../types/viewmodel_types';
import { Layer } from '../../specs/index';
import {
  fillTextLayout,
  getRectangleRowGeometry,
  getSectorRowGeometry,
  inSectorRotation,
  nodeId,
  rectangleConstruction,
  ringSectorConstruction,
} from './fill_text_layout';
import {
  aggregateAccessor,
  aggregateComparator,
  aggregators,
  ArrayEntry,
  childOrders,
  depthAccessor,
  entryKey,
  entryValue,
  groupByRollup,
  mapEntryValue,
  mapsToArrays,
  // PrimitiveValue,
} from '../utils/group_by_rollup';
import { Assign, Intersection, Primitive } from 'utility-types';

function paddingAccessor(n: ArrayEntry) {
  return entryValue(n).depth > 1 ? 1 : [0, 2][entryValue(n).depth];
}
function rectangleFillOrigins(n: ShapeTreeNode): [number, number] {
  return [(n.x0 + n.x1) / 2, (n.y0 + n.y1) / 2];
}
export const ringSectorInnerRadius = (n: ShapeTreeNode): Radius => n.y0px;

export const ringSectorOuterRadius = (n: ShapeTreeNode): Radius => n.y1px;

export const ringSectorMiddleRadius = (n: ShapeTreeNode): Radius => n.yMidPx;

function sectorFillOrigins(fillOutside: boolean) {
  return (node: ShapeTreeNode): [number, number] => {
    const midAngle = (node.x0 + node.x1) / 2;
    const divider = 10;
    const innerBias = fillOutside ? 9 : 1;
    const outerBias = divider - innerBias;
    // prettier-ignore
    const radius =
    (  innerBias * ringSectorInnerRadius(node)
      + outerBias * ringSectorOuterRadius(node)
    )
    / divider;
    const cx = Math.cos(trueBearingToStandardPositionAngle(midAngle)) * radius;
    const cy = Math.sin(trueBearingToStandardPositionAngle(midAngle)) * radius;
    return [cx, cy];
  };
}

export interface Row {
  [key: string]: Primitive | Row | Row[];
}

export type RowArray<T> = T[];

export function objectAssign<A extends object, B extends object, C extends RowAssign<A, B>>(a: A, b: B): C {
  return Object.assign({}, a as object, b as object) as C;
}

type NonUndefinedPartial<T, KP> = Partial<T> & { [K in keyof KP]-?: K extends keyof T ? T[K] : never };

export function partialOf<F extends object>(refValue: F) {
  // returns a validator (in runtime, an identity function) for object of type Partial<F> where
  return function<T extends object>(value: T & NonUndefinedPartial<F, T>) {
    return refValue && value;
  };
}

export type RowAssign<T extends object, U extends object> = Assign<T, U> & NonUndefinedPartial<T, U>;

export function nestedLoopRowOverride<TR extends TS, TS extends Partial<TR>>(
  m1: RowArray<TR>,
  m2: RowArray<TS>,
): RowArray<TR> {
  const result: RowArray<TR> = [];
  for (let i = 0; i < m1.length; i++) {
    for (let j = 0; j < m2.length; j++) {
      result.push(objectAssign(m1[i], m2[j]));
    }
  }
  return result;
}

export function nestedLoopRowJoin<TR extends object, TS extends object>(
  m1: RowArray<TR>,
  m2: RowArray<TS>,
): RowArray<RowAssign<TR, TS>> {
  const result: RowArray<RowAssign<TR, TS>> = [];
  for (let i = 0; i < m1.length; i++) {
    for (let j = 0; j < m2.length; j++) {
      result.push(objectAssign(m1[i], m2[j]));
    }
  }
  return result;
}

export type KeyedObject = { [k in string]: unknown };

export function nestedNaturalLoopRowJoin<TR extends KeyedObject, TS extends KeyedObject>(
  m1: RowArray<TR>,
  m2: RowArray<TS>,
): RowArray<RowAssign<TR, TS>> {
  const result: RowArray<RowAssign<TR, TS>> = [];
  for (let i = 0; i < m1.length; i++) {
    for (let j = 0; j < m2.length; j++) {
      const t1 = m1[i];
      const t2 = m2[j];
      const t1Keys: Array<keyof TR> = Object.keys(t1);
      const t2Keys: Array<keyof TS> = Object.keys(t2);
      const commonKeys = t1Keys.filter((d) => t2Keys.find((dd) => d === dd)) as Array<keyof Intersection<TR, TS>>;
      const equiJoinCondition = commonKeys.reduce((p, n) => p && t1[n] === t2[n], true);
      if (equiJoinCondition) {
        result.push(objectAssign(t1, t2));
      }
    }
  }
  return result;
}

export function highestImportance<TR extends Row>(r: RowArray<TR>): TR {
  return r[0];
}

export type QM = { strokeWidth: number; fillColor: string; importance: number };
export type JoinedQM = QM & ShapeTreeNode;
export type PartialQM = Partial<QM>;
export type PartialJoinedQM = Partial<JoinedQM>;

export const defaultQuadModelAttribute: QM = {
  importance: -1,
  strokeWidth: 1,
  fillColor: 'rgba(128,0,0,0.5)',
};

export function makeOutsideLinksViewModel(
  outsideFillNodes: ShapeTreeNode[],
  rowSets: RowSet[],
  linkLabelRadiusPadding: Distance,
): OutsideLinksViewModel[] {
  return outsideFillNodes
    .map<OutsideLinksViewModel>((node, i: number) => {
      const rowSet = rowSets[i];
      if (!rowSet.rows.reduce((p, row) => p + row.rowWords.length, 0)) return { points: [] };
      const radius = ringSectorOuterRadius(node);
      const midAngle = trueBearingToStandardPositionAngle(meanAngle(node.x0, node.x1));
      const cos = Math.cos(midAngle);
      const sin = Math.sin(midAngle);
      const x0 = cos * radius;
      const y0 = sin * radius;
      const x = cos * (radius + linkLabelRadiusPadding);
      const y = sin * (radius + linkLabelRadiusPadding);
      return { points: [[x0, y0], [x, y]] };
    })
    .filter(({ points }: OutsideLinksViewModel) => points.length > 1);
}

export function shapeViewModel /*<TR extends Row>*/(
  textMeasure: TextMeasure,
  config: Config,
  layers: Layer[],
  facts: Relation,
  rawTextGetter: RawTextGetter,
  valueAccessor: AccessorFn,
  valueFormatter: (value: number) => string,
  groupByRollupAccessors: IndexedAccessorFn[],
  chartAttributes: RowArray<PartialQM>,
): ShapeViewModel {
  const {
    width,
    height,
    margin,
    emptySizeRatio,
    outerSizeRatio,
    fillOutside,
    linkLabel,
    clockwiseSectors,
    specialFirstInnermostSector,
    minFontSize,
    hierarchicalLayout,
  } = config;

  const innerWidth = width * (1 - Math.min(1, margin.left + margin.right));
  const innerHeight = height * (1 - Math.min(1, margin.top + margin.bottom));

  const diskCenter = {
    x: width * margin.left + innerWidth / 2,
    y: height * margin.top + innerHeight / 2,
  };

  const aggregator = aggregators.sum;

  // don't render anything if there are no tuples, or some are negative, or the total is not positive
  if (
    facts.length === 0 ||
    facts.some((n) => valueAccessor(n) < 0) ||
    facts.reduce((p: number, n) => aggregator.reducer(p, valueAccessor(n)), aggregator.identity()) <= 0
  ) {
    return {
      config,
      diskCenter,
      quadViewModel: [],
      rowSets: [],
      linkLabelViewModels: [],
      outsideLinksViewModel: [],
    };
  }

  // We can precompute things invariant of how the rectangle is divvied up.
  // By introducing `scale`, we no longer need to deal with the dichotomy of
  // size as data value vs size as number of pixels in the rectangle

  const hierarchyMap = groupByRollup(groupByRollupAccessors, valueAccessor, aggregator, facts);
  const tree = mapsToArrays(hierarchyMap, aggregateComparator(mapEntryValue, childOrders.descending));

  const totalValue = tree.reduce((p: number, n: ArrayEntry): number => p + mapEntryValue(n), 0);

  const sunburstValueToAreaScale = tau / totalValue;
  const sunburstAreaAccessor = (e: ArrayEntry) => sunburstValueToAreaScale * mapEntryValue(e);
  const children = entryValue(tree[0]).children || [];
  const treemapLayout = hierarchicalLayout === PartitionLayouts.treemap;
  const treemapInnerArea = treemapLayout ? width * height : 1; // assuming 1 x 1 unit square
  const treemapValueToAreaScale = treemapInnerArea / totalValue;
  const treemapAreaAccessor = (e: ArrayEntry) => treemapValueToAreaScale * mapEntryValue(e);

  const rawChildNodes: Array<Part> = treemapLayout
    ? treemap(tree, treemapAreaAccessor, paddingAccessor, { x0: -width / 2, y0: -height / 2, width, height }).slice(1)
    : sunburst(children, sunburstAreaAccessor, { x0: 0, y0: 0 }, clockwiseSectors, specialFirstInnermostSector);

  // use the smaller of the two sizes, as a circle fits into a square
  const circleMaximumSize = Math.min(innerWidth, innerHeight);
  const outerRadius: Radius = (outerSizeRatio * circleMaximumSize) / 2;
  const innerRadius: Radius = outerRadius - (1 - emptySizeRatio) * outerRadius;
  const treeHeight = rawChildNodes.reduce((p: number, n: any) => Math.max(p, entryValue(n.node).depth), 0); // 1: pie, 2: two-ring donut etc.
  const ringThickness = (outerRadius - innerRadius) / treeHeight;

  const childNodes: RowArray<ShapeTreeNode> = rawChildNodes.map(
    (n: any, index: number): ShapeTreeNode => {
      return {
        data: { name: entryKey(n.node) },
        depth: depthAccessor(n.node),
        value: aggregateAccessor(n.node),
        x0: n.x0,
        x1: n.x1,
        y0: n.y0,
        y1: n.y1,
        y0px: treemapLayout ? n.y0 : innerRadius + n.y0 * ringThickness,
        y1px: treemapLayout ? n.y1 : innerRadius + n.y1 * ringThickness,
        yMidPx: treemapLayout ? (n.y0 + n.y1) / 2 : innerRadius + ((n.y0 + n.y1) / 2) * ringThickness,
        inRingIndex: index,
      };
    },
  );

  // ring sector paths
  const qm = nestedLoopRowOverride([defaultQuadModelAttribute], chartAttributes);
  const quadViewModel = nestedNaturalLoopRowJoin(childNodes, qm);

  // eslint-disable-next-line no-console
  console.log(quadViewModel[0]);

  // fill text
  const roomCondition = (n: ShapeTreeNode) => {
    const diff = n.x1 - n.x0;
    return treemapLayout
      ? n.x1 - n.x0 > minFontSize && n.y1px - n.y0px > minFontSize
      : (diff < 0 ? tau + diff : diff) * ringSectorMiddleRadius(n) > Math.max(minFontSize, linkLabel.maximumSection);
  };

  const nodesWithRoom = childNodes.filter(roomCondition);
  const outsideFillNodes = fillOutside && !treemapLayout ? nodesWithRoom : [];

  const textFillOrigins = nodesWithRoom.map(treemapLayout ? rectangleFillOrigins : sectorFillOrigins(fillOutside));

  const rowSets: RowSet[] = fillTextLayout(
    textMeasure,
    rawTextGetter,
    valueFormatter,
    nodesWithRoom.map((n: ShapeTreeNode) =>
      Object.assign({}, n, {
        y0: n.y0,
        fill: quadViewModel[n.inRingIndex].fillColor, // todo roll a proper join, as this current thing assumes 1:1 between sectors and sector VMs (in the future we may elide small, invisible sector VMs(
      }),
    ),
    config,
    layers,
    textFillOrigins,
    treemapLayout ? rectangleConstruction : ringSectorConstruction(config, innerRadius, ringThickness),
    treemapLayout ? getRectangleRowGeometry : getSectorRowGeometry,
    treemapLayout ? () => 0 : inSectorRotation(config.horizontalTextEnforcer, config.horizontalTextAngleThreshold),
  );

  const outsideLinksViewModel = makeOutsideLinksViewModel(outsideFillNodes, rowSets, linkLabel.radiusPadding);

  // linked text
  const currentY = [-height, -height, -height, -height];

  const nodesWithoutRoom =
    fillOutside || treemapLayout
      ? [] // outsideFillNodes and linkLabels are in inherent conflict due to very likely overlaps
      : childNodes.filter((n: ShapeTreeNode) => {
          const id = nodeId(n);
          const foundInFillText = rowSets.find((r: RowSet) => r.id === id);
          // successful text render if found, and has some row(s)
          return !(foundInFillText && foundInFillText.rows.length !== 0);
        });

  const linkLabelViewModels = linkTextLayout(
    textMeasure,
    config,
    nodesWithoutRoom,
    currentY,
    outerRadius,
    rawTextGetter,
  );

  // combined viewModel
  return {
    config,
    diskCenter,
    quadViewModel,
    rowSets,
    linkLabelViewModels,
    outsideLinksViewModel,
  };
}
