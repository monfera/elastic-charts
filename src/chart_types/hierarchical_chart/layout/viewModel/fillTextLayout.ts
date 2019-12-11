import { wrapToTau } from '../geometry';
import { Coordinate, Distance, Pixels, Radian, Radius, RingSector } from '../types/GeometryTypes';
import { Config } from '../types/ConfigTypes';
import { logarithm, tau, trueBearingToStandardPositionAngle } from '../utils/math';
import { RowBox, RowSet, SectorTreeNode } from '../types/ViewModelTypes';
// @ts-ignore
import parse from 'parse-color';
import { FontWeight, TextMeasure } from '../types/Types';
import { aggregateKey } from '../utils/groupByRollup';
import { conjunctiveConstraint } from '../circlineGeometry';

const ringSectorStartAngle = (d: SectorTreeNode): Radian => trueBearingToStandardPositionAngle(d.x0);

const ringSectorEndAngle = (d: SectorTreeNode): Radian => trueBearingToStandardPositionAngle(d.x1);

const ringSectorInnerRadius = (innerRadius: Radian, ringThickness: Distance) => (d: SectorTreeNode): Radius =>
  innerRadius + (d.y0 as number) * ringThickness;

const ringSectorOuterRadius = (innerRadius: Radian, ringThickness: Distance) => (d: SectorTreeNode): Radius =>
  innerRadius + ((d.y0 as number) + 1) * ringThickness;

const infinityRadius = 1e4; // far enough for a sub-2px precision on a 4k screen, good enough for text bounds; 64 bit floats still work well with it

const angleToCircline = (
  midRadius: Radius,
  alpha: Radian,
  direction: 1 | -1 /* 1 for clockwise and -1 for anticlockwise circline */,
) => {
  const sectorRadiusLineX = Math.cos(alpha) * midRadius;
  const sectorRadiusLineY = Math.sin(alpha) * midRadius;
  const normalAngle = alpha + (direction * Math.PI) / 2;
  const x = sectorRadiusLineX + infinityRadius * Math.cos(normalAngle);
  const y = sectorRadiusLineY + infinityRadius * Math.sin(normalAngle);
  const sectorRadiusCircline = { x, y, r: infinityRadius, inside: false, from: 0, to: tau };
  return sectorRadiusCircline;
};

// todo pick a better unique key for the slices (D3 doesn't keep track of an index)
export const nodeId = (node: SectorTreeNode): string => node.x0 + '|' + node.y0;

const ringSectorConstruction = (
  config: Config,
  innerRadius: Radius,
  ringThickness: Distance,
  ringSector: SectorTreeNode,
): RingSector => {
  const { circlePadding, radialPadding, fillOutside, radiusOutside, fillRectangleWidth, fillRectangleHeight } = config;
  const r =
    (fillOutside ? ringSectorOuterRadius : ringSectorInnerRadius)(innerRadius, ringThickness)(ringSector) +
    circlePadding * 2;
  const R = Math.max(
    r,
    ringSectorOuterRadius(innerRadius, ringThickness)(ringSector) - circlePadding + (fillOutside ? radiusOutside : 0),
  );
  const alpha = ringSectorStartAngle(ringSector);
  const beta = ringSectorEndAngle(ringSector);
  const innerCircline = { x: 0, y: 0, r: r, inside: true, from: 0, to: tau };
  const outerCircline = { x: 0, y: 0, r: R, inside: false, from: 0, to: tau };
  const midRadius = (r + R) / 2;
  const sectorStartCircle = angleToCircline(midRadius, alpha - radialPadding, -1);
  const sectorEndCircle = angleToCircline(midRadius, beta + radialPadding, 1);
  const RRx = fillRectangleWidth / 2;
  const RRy = fillRectangleHeight / 2;
  const rectangleCirclines =
    RRx === Infinity && RRy === Infinity
      ? []
      : [
          { x: infinityRadius - RRx, y: 0, r: infinityRadius, inside: true },
          { x: -infinityRadius + RRx, y: 0, r: infinityRadius, inside: true },
          { x: 0, y: infinityRadius - RRy, r: infinityRadius, inside: true },
          { x: 0, y: -infinityRadius + RRy, r: infinityRadius, inside: true },
        ];
  return [innerCircline, outerCircline, sectorStartCircle, sectorEndCircle, ...rectangleCirclines];
};

const makeRowCircline = (
  cx: Coordinate,
  cy: Coordinate,
  radialOffset: Distance,
  rotation: Radian,
  fontSize: number,
  offsetSign: -1 | 0 | 1,
) => {
  const rowCentroidY = cy;
  const r = infinityRadius;
  const offset = (offsetSign * fontSize) / 2;
  const anotherOffset = rowCentroidY - cy + offset;
  const anotherR = r - anotherOffset;
  const x = cx + anotherR * Math.cos(-rotation + tau / 4);
  const y = cy + anotherR * Math.cos(-rotation + tau / 2);
  const circline = { r: r + radialOffset, x, y };
  return circline;
};

const getSectorRowGeometry = (
  ringSector: RingSector,
  cx: Coordinate,
  cy: Coordinate,
  totalRowCount: number,
  linePitch: Pixels,
  rowIndex: number,
  fontSize: Pixels,
  rotation: Radian,
) => {
  // prettier-ignore
  const offset =
      (totalRowCount / 2) * fontSize
    + fontSize / 2
    - linePitch * rowIndex

  const topCircline = makeRowCircline(cx, cy, offset, rotation, fontSize, 1);
  const bottomCircline = makeRowCircline(cx, cy, offset, rotation, fontSize, -1);
  const midCircline = makeRowCircline(cx, cy, offset, rotation, 0, 0);

  const valid1 = conjunctiveConstraint(ringSector, Object.assign({}, topCircline, { from: 0, to: tau }))[0];
  if (!valid1) return { rowCentroidX: cx, rowCentroidY: cy, maximumRowLength: 0 };
  const valid2 = conjunctiveConstraint(ringSector, Object.assign({}, bottomCircline, { from: 0, to: tau }))[0];
  if (!valid2) return { rowCentroidX: cx, rowCentroidY: cy, maximumRowLength: 0 };
  const from = Math.max(valid1.from, valid2.from);
  const to = Math.min(valid1.to, valid2.to);
  const midAngle = (from + to) / 2;
  const cheapTangent = Math.max(0, to - from); /* Math.tan(Math.max(0, to - from)) */ // https://en.wikipedia.org/wiki/Small-angle_approximation
  const rowCentroidX = midCircline.r * Math.cos(midAngle) + midCircline.x;
  const rowCentroidY = midCircline.r * Math.sin(midAngle) + midCircline.y;
  const maximumRowLength = cheapTangent * infinityRadius;
  return { rowCentroidX, rowCentroidY, maximumRowLength };
};

const getRectangleRowGeometry = (
  { x0, y0, x1, y1 }: { x0: number; y0: number; x1: number; y1: number },
  cx: Coordinate,
  cy: Coordinate,
  totalRowCount: number,
  linePitch: Pixels,
  rowIndex: number,
  fontSize: Pixels,
) => {
  // prettier-ignore
  const offset =
      (totalRowCount / 2) * fontSize
    + fontSize / 2
    - linePitch * rowIndex

  const rowCentroidX = cx;
  const rowCentroidY = cy - offset;
  return {
    rowCentroidX,
    rowCentroidY: -rowCentroidY,
    maximumRowLength: rowCentroidY - linePitch / 2 < y0 || rowCentroidY + linePitch / 2 > y1 ? 0 : x1 - x0,
  };
};

const rowSetComplete = (rowSet: RowSet, measuredBoxes: RowBox[]) =>
  !rowSet.rows.some((r) => isNaN(r.length)) && !measuredBoxes.length;

const identityRowSet = (): RowSet => ({
  id: '',
  rows: [],
  fontFamily: '',
  fontStyle: '',
  fontVariant: '',
  fontSize: NaN,
  fillTextColor: '',
  fillTextWeight: 400,
  rotation: NaN,
});

const getAllBoxes = (getRawText: Function, valueFormatter: Function, node: SectorTreeNode) =>
  getRawText(node)
    .split(' ')
    .concat(valueFormatter(node[aggregateKey]).split(' '));

const getWordSpacing = (fontSize: number) => fontSize / 4;

const fillSector = (
  config: Config,
  fontSizes: string | any[],
  textFillOrigins: any[],
  measure: { (font: string, texts: string[]): TextMetrics[]; (arg0: string, arg1: any): any },
  getRawText: Function,
  valueFormatter: Function,
  innerRadius: number,
  ringThickness: number,
  tr: number,
  tg: number,
  tb: number,
) => (node: SectorTreeNode, i: number) => {
  const {
    fontFamily,
    maxRowCount,
    fillLabel: { textColor, textInvertible, textWeight, fontStyle, fontVariant },
    horizontalTextEnforcer,
    horizontalTextAngleThreshold,
  } = config;
  // generic block
  let fontSizeIndex = fontSizes.length - 1;
  const textFillOrigin = textFillOrigins[i];
  const cx = textFillOrigin[0];
  const cy = textFillOrigin[1];

  // generic block
  const allBoxes = getAllBoxes(getRawText, valueFormatter, node);
  let rowSet = identityRowSet();
  let completed = false;

  // circline-specific block
  let rotation = trueBearingToStandardPositionAngle((node.x0 + node.x1) / 2);
  if (Math.abs(node.x1 - node.x0) > horizontalTextAngleThreshold && horizontalTextEnforcer > 0)
    rotation = rotation * (1 - horizontalTextEnforcer);
  if (tau / 4 < rotation && rotation < (3 * tau) / 4) rotation = wrapToTau(rotation - tau / 2);
  const container = ringSectorConstruction(config, innerRadius, ringThickness, node);

  while (!completed && fontSizeIndex >= 0) {
    // generic block
    const fontSize = fontSizes[fontSizeIndex];
    const wordSpacing = getWordSpacing(fontSize);

    // model text pieces, obtaining their width at the current font size
    // generic block
    const measurements = measure(fontSize + 'px ' + fontFamily, allBoxes);
    const allMeasuredBoxes: RowBox[] = measurements.map(
      ({ width, emHeightDescent, emHeightAscent }: TextMetrics, i: number) => ({
        width,
        verticalOffset: -(emHeightDescent + emHeightAscent) / 2, // meaning, `middle`,
        text: allBoxes[i],
        wordBeginning: NaN,
      }),
    );
    const linePitch = fontSize;

    // rowSet building starts
    // generic block
    let targetRowCount = 0;
    let measuredBoxes = allMeasuredBoxes.slice();
    let innerCompleted = false;

    while (++targetRowCount <= maxRowCount && !innerCompleted) {
      // generic block
      measuredBoxes = allMeasuredBoxes.slice();
      const [r, g, b] = parse(node.fill).rgb;
      const inverseForContrast = textInvertible && r * 0.299 + g * 0.587 + b * 0.114 < 150;
      rowSet = {
        id: nodeId(node),
        fontSize,
        fontFamily,
        fontStyle,
        fontVariant,
        // fontWeight must be a multiple of 100 for non-variable width fonts, otherwise weird things happen due to
        // https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#Fallback_weights - Fallback weights
        // todo factor out the discretization into a => FontWeight function
        fillTextWeight: (Math.round(textWeight / 100) * 100) as FontWeight,
        fillTextColor: inverseForContrast ? `rgb(${255 - tr}, ${255 - tg}, ${255 - tb})` : textColor,
        rotation,
        rows: [...Array(targetRowCount)].map(() => ({
          rowWords: [],
          rowCentroidX: NaN,
          rowCentroidY: NaN,
          maximumLength: NaN,
          length: NaN,
        })),
      };

      // generic block
      let currentRowIndex = 0;
      while (currentRowIndex < targetRowCount) {
        const currentRow = rowSet.rows[currentRowIndex];
        const currentRowWords = currentRow.rowWords;

        // current row geometries
        // circline-specific block
        const { maximumRowLength, rowCentroidX, rowCentroidY } = getSectorRowGeometry(
          container,
          cx,
          cy,
          targetRowCount,
          linePitch,
          currentRowIndex,
          fontSize,
          rotation,
        );

        // generic block
        currentRow.rowCentroidX = rowCentroidX;
        currentRow.rowCentroidY = rowCentroidY;
        currentRow.maximumLength = maximumRowLength;

        // row building starts
        // generic block
        let currentRowLength = 0;
        let rowHasRoom = true;

        // keep adding words while there's room
        // generic block
        while (measuredBoxes.length && rowHasRoom) {
          // adding box to row
          const currentBox = measuredBoxes[0];

          const wordBeginning = currentRowLength;
          currentRowLength += currentBox.width + wordSpacing;

          if (currentRowLength <= currentRow.maximumLength) {
            currentRowWords.push(Object.assign({}, currentBox, { wordBeginning }));
            currentRow.length = currentRowLength;
            measuredBoxes.shift();
          } else {
            rowHasRoom = false;
          }
        }

        currentRowIndex++;
      }

      innerCompleted = rowSetComplete(rowSet, measuredBoxes);
    }
    {
      // row building conditions
      completed = !measuredBoxes.length;
      if (!completed) {
        fontSizeIndex -= 1;
      }
    }
  }
  rowSet.rows = rowSet.rows.filter((r) => !isNaN(r.length));
  return rowSet;
};

const fillRectangle = (
  config: Config,
  fontSizes: string | any[],
  measure: { (font: string, texts: string[]): TextMetrics[]; (arg0: string, arg1: any): any },
  getRawText: Function,
  valueFormatter: Function,
  tr: number,
  tg: number,
  tb: number,
) => (node: SectorTreeNode) => {
  const {
    fontFamily,
    maxRowCount,
    fillLabel: { textColor, textInvertible, textWeight, fontStyle, fontVariant },
  } = config;
  // generic block
  let fontSizeIndex = fontSizes.length - 1;

  // generic block
  const allBoxes = getAllBoxes(getRawText, valueFormatter, node);
  let rowSet = identityRowSet();
  let completed = false;

  // rectangle-specific block
  const container = { x0: node.x0, y0: node.y0px, x1: node.x1, y1: node.y1px };

  while (!completed && fontSizeIndex >= 0) {
    // generic block
    const fontSize = fontSizes[fontSizeIndex];
    const wordSpacing = getWordSpacing(fontSize);

    // model text pieces, obtaining their width at the current font size
    // generic block
    const measurements = measure(fontSize + 'px ' + fontFamily, allBoxes);
    const allMeasuredBoxes: RowBox[] = measurements.map(
      ({ width, emHeightDescent, emHeightAscent }: TextMetrics, i: number) => ({
        width,
        verticalOffset: -(emHeightDescent + emHeightAscent) / 2, // meaning, `middle`,
        text: allBoxes[i],
        wordBeginning: NaN,
      }),
    );
    const linePitch = fontSize;

    // rowSet building starts
    // generic block
    let targetRowCount = 0;
    let measuredBoxes = allMeasuredBoxes.slice();
    let innerCompleted = false;

    while (++targetRowCount <= maxRowCount && !innerCompleted) {
      // generic block
      measuredBoxes = allMeasuredBoxes.slice();
      const [r, g, b] = parse(node.fill).rgb;
      const inverseForContrast = textInvertible && r * 0.299 + g * 0.587 + b * 0.114 < 150;
      rowSet = {
        id: nodeId(node),
        fontSize,
        fontFamily,
        fontStyle,
        fontVariant,
        // fontWeight must be a multiple of 100 for non-variable width fonts, otherwise weird things happen due to
        // https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#Fallback_weights - Fallback weights
        // todo factor out the discretization into a => FontWeight function
        fillTextWeight: (Math.round(textWeight / 100) * 100) as FontWeight,
        fillTextColor: inverseForContrast ? `rgb(${255 - tr}, ${255 - tg}, ${255 - tb})` : textColor,
        rotation: 0,
        rows: [...Array(targetRowCount)].map(() => ({
          rowWords: [],
          rowCentroidX: NaN,
          rowCentroidY: NaN,
          maximumLength: NaN,
          length: NaN,
        })),
      };

      // generic block
      let currentRowIndex = 0;
      while (currentRowIndex < targetRowCount) {
        const currentRow = rowSet.rows[currentRowIndex];
        const currentRowWords = currentRow.rowWords;

        // current row geometries
        // circline-specific block
        const { maximumRowLength, rowCentroidX, rowCentroidY } = getRectangleRowGeometry(
          {
            x0: container.x0 + wordSpacing,
            y0: container.y0 + linePitch / 2,
            x1: container.x1 - wordSpacing,
            y1: container.y1 - linePitch / 2,
          },
          (container.x0 + container.x1) / 2,
          (container.y0 + container.y1) / 2,
          targetRowCount,
          linePitch,
          currentRowIndex,
          fontSize,
        );

        // generic block
        currentRow.rowCentroidX = rowCentroidX;
        currentRow.rowCentroidY = rowCentroidY;
        currentRow.maximumLength = maximumRowLength;

        // row building starts
        // generic block
        let currentRowLength = 0;
        let rowHasRoom = true;

        // keep adding words while there's room
        // generic block
        while (measuredBoxes.length && rowHasRoom) {
          // adding box to row
          const currentBox = measuredBoxes[0];

          const wordBeginning = currentRowLength;
          currentRowLength += currentBox.width + wordSpacing;

          if (currentRowLength <= currentRow.maximumLength) {
            currentRowWords.push(Object.assign({}, currentBox, { wordBeginning }));
            currentRow.length = currentRowLength;
            measuredBoxes.shift();
          } else {
            rowHasRoom = false;
          }
        }

        currentRowIndex++;
      }

      innerCompleted = rowSetComplete(rowSet, measuredBoxes);
    }
    {
      // row building conditions
      completed = !measuredBoxes.length;
      if (!completed) {
        fontSizeIndex -= 1;
      }
    }
  }
  rowSet.rows = rowSet.rows.filter((r) => !isNaN(r.length));
  return rowSet;
};

export const fillTextLayoutSector = (
  measure: TextMeasure, // todo improve typing
  getRawText: Function, // todo improve typing
  valueFormatter: Function,
  childNodes: SectorTreeNode[],
  config: Config,
  textFillOrigins: [number, number][],
  innerRadius: Radius,
  ringThickness: Distance,
) => {
  const {
    minFontSize,
    maxFontSize,
    idealFontSizeJump,
    fillLabel: { textColor },
  } = config;

  const [tr, tg, tb] = parse(textColor).rgb;
  const fontSizeMagnification = maxFontSize / minFontSize;
  const fontSizeJumpCount = Math.round(logarithm(idealFontSizeJump, fontSizeMagnification));
  const realFontSizeJump = Math.pow(fontSizeMagnification, 1 / fontSizeJumpCount);
  const fontSizes: Pixels[] = [];
  for (let i = 0; i <= fontSizeJumpCount; i++) {
    const fontSize = Math.round(minFontSize * Math.pow(realFontSizeJump, i));
    if (fontSizes.indexOf(fontSize) === -1) {
      fontSizes.push(fontSize);
    }
  }

  return childNodes.map(
    fillSector(
      config,
      fontSizes,
      textFillOrigins,
      measure,
      getRawText,
      valueFormatter,
      innerRadius,
      ringThickness,
      tr,
      tg,
      tb,
    ),
  );
};

export const fillTextLayoutRectangle = (
  measure: TextMeasure, // todo improve typing
  getRawText: Function, // todo improve typing
  valueFormatter: Function,
  childNodes: SectorTreeNode[],
  config: Config,
) => {
  const {
    minFontSize,
    maxFontSize,
    idealFontSizeJump,
    fillLabel: { textColor },
  } = config;

  const [tr, tg, tb] = parse(textColor).rgb;
  const fontSizeMagnification = maxFontSize / minFontSize;
  const fontSizeJumpCount = Math.round(logarithm(idealFontSizeJump, fontSizeMagnification));
  const realFontSizeJump = Math.pow(fontSizeMagnification, 1 / fontSizeJumpCount);
  const fontSizes: Pixels[] = [];
  for (let i = 0; i <= fontSizeJumpCount; i++) {
    const fontSize = Math.round(minFontSize * Math.pow(realFontSizeJump, i));
    if (fontSizes.indexOf(fontSize) === -1) {
      fontSizes.push(fontSize);
    }
  }

  return childNodes.map(fillRectangle(config, fontSizes, measure, getRawText, valueFormatter, tr, tg, tb));
};
