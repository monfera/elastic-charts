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
 * under the License. */

import { Ratio } from '../types/geometry_types';
import { RgbTuple, stringToRGB } from './d3_utils';
import { Color } from '../../../../utils/commons';

/** @internal */
export function hueInterpolator(colors: RgbTuple[]) {
  return (d: number) => {
    const index = Math.round(d * 255);
    const [r, g, b, a] = colors[index];
    return colors[index].length === 3 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${a})`;
  };
}

/** @internal */
export function addOpacity(hexColorString: string, opacity: Ratio) {
  // this is a super imperfect multiplicative alpha blender that assumes a "#rrggbb" or "#rrggbbaa" hexColorString
  // todo roll some proper utility that can handle "rgb(...)", "rgba(...)", "red", {r, g, b} etc.
  return opacity === 1
    ? hexColorString
    : hexColorString.slice(0, 7) +
        (hexColorString.slice(7).length === 0 || parseInt(hexColorString.slice(7, 2), 16) === 255
          ? `00${Math.round(opacity * 255).toString(16)}`.substr(-2) // color was of full opacity
          : `00${Math.round((parseInt(hexColorString.slice(7, 2), 16) / 255) * opacity * 255).toString(16)}`.substr(
              -2,
            ));
}

/** @internal */
export function arrayToLookup(keyFun: Function, array: Array<any>) {
  return Object.assign({}, ...array.map((d) => ({ [keyFun(d)]: d })));
}

/** @internal */
export function colorIsDark(color: Color) {
  // fixme this assumes a white or very light background
  const rgba = stringToRGB(color);
  const { r, g, b, opacity } = rgba;
  const a = rgba.hasOwnProperty('opacity') ? opacity : 1;
  return r * 0.299 + g * 0.587 + b * 0.114 < a * 150;
}

/** @internal */
export function getFillTextColor(shapeFillColor: Color, textColor: Color, textInvertible: boolean) {
  const { r: tr, g: tg, b: tb, opacity: to } = stringToRGB(textColor);
  const backgroundIsDark = colorIsDark(shapeFillColor);
  const specifiedTextColorIsDark = colorIsDark(textColor);
  const inverseForContrast = textInvertible && specifiedTextColorIsDark === backgroundIsDark;
  return inverseForContrast
    ? to === undefined
      ? `rgb(${255 - tr}, ${255 - tg}, ${255 - tb})`
      : `rgba(${255 - tr}, ${255 - tg}, ${255 - tb}, ${to})`
    : textColor;
}

/** @internal */
export function floor(n: number) {
  return Math.floor(n);
}

/** @internal */
export function round(n: number) {
  return Math.round(n);
}

/** @internal */
export function monotonicHillClimb0(
  getResponse: (n: number) => number,
  maxVar: number,
  responseUpperConstraint: number,
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  _proportionalResponse: boolean = false,
  minVar: number = 0,
) {
  // Lowers iteration count by weakly assuming that there's eg. a `pixelWidth(text) ~ charLength(text)` relation, ie. instead of pivoting
  // at the 50% midpoint like a basic binary search would do, it takes proportions into account. Still works if assumption is false.
  // It's usable for all problems where there's a monotonic relationship between the constrained output and the variable
  // (eg. can maximize font size etc.)
  let loVar = minVar;

  const hiVar = maxVar;
  const hiResponse = getResponse(hiVar);

  if (hiResponse <= responseUpperConstraint) return maxVar; // early bail if maxVar is compliant

  let pivotVar: number = loVar;
  while (loVar <= hiVar) {
    console.log(pivotVar);
    const newPivotVar = loVar + 1;
    pivotVar = newPivotVar;
    const pivotResponse = getResponse(pivotVar);
    const pivotIsCompliant = pivotResponse <= responseUpperConstraint;
    if (pivotIsCompliant) {
      loVar = pivotVar;
    } else {
      return loVar;
    }
  }
  return pivotVar;
}

/** @internal */
export function monotonicHillClimb(
  getResponse: (n: number) => number,
  maxVar: number,
  responseUpperConstraint: number,
  proportionalResponse: boolean = false,
  minVar: number = 0,
  responseForMinVar: number = 0,
) {
  // Lowers iteration count by weakly assuming that there's eg. a `pixelWidth(text) ~ charLength(text)` relation, ie. instead of pivoting
  // at the 50% midpoint like a basic binary search would do, it takes proportions into account. Still works if assumption is false.
  // It's usable for all problems where there's a monotonic relationship between the constrained output and the variable
  // (eg. can maximize font size etc.)
  let loVar = minVar;
  let loResponse = responseForMinVar;

  let hiVar = maxVar;
  let hiResponse = getResponse(hiVar);

  if (hiResponse <= responseUpperConstraint) return maxVar; // early bail if maxVar is compliant

  let pivotVar: number = NaN;
  let pivotResponse: number = NaN;
  while (loVar < hiVar) {
    console.log(pivotVar);
    const bisectRatio = proportionalResponse ? (responseUpperConstraint - loResponse) / (hiResponse - loResponse) : 0.5;
    const newPivotVar = loVar + (hiVar - loVar) * bisectRatio;
    const newPivotResponse = getResponse(newPivotVar);
    if (Math.abs(pivotResponse - newPivotResponse) < 1 / 1000 && pivotResponse !== newPivotResponse) debugger;
    if (pivotResponse === newPivotResponse) {
      return loVar; // bail if we're good and not making further progress
    }
    pivotVar = newPivotVar;
    pivotResponse = newPivotResponse;
    const pivotIsCompliant = pivotResponse <= responseUpperConstraint;
    if (pivotIsCompliant) {
      loVar = pivotVar;
      loResponse = pivotResponse;
    } else {
      hiVar = pivotVar;
      hiResponse = pivotResponse;
    }
  }
  return pivotVar;
}
