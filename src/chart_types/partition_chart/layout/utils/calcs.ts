import { Ratio } from '../types/geometry_types';
import { RgbTuple, stringToRGB } from './d3_utils';

export function hueInterpolator(colors: RgbTuple[]) {
  return (d: number) => {
    const index = Math.round(d * 255);
    const [r, g, b, a] = colors[index];
    return colors[index].length === 3 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${a})`;
  };
}

export function addOpacity(hexColorString: string, opacity: Ratio) {
  // this is a super imperfect multiplicative alpha blender that assumes a "#rrggbb" or "#rrggbbaa" hexColorString
  // todo roll some proper utility that can handle "rgb(...)", "rgba(...)", "red", {r, g, b} etc.
  return opacity === 1
    ? hexColorString
    : hexColorString.slice(0, 7) +
        (hexColorString.slice(7).length === 0 || parseInt(hexColorString.slice(7, 2), 16) === 255
          ? ('00' + Math.round(opacity * 255).toString(16)).substr(-2) // color was of full opacity
          : ('00' + Math.round((parseInt(hexColorString.slice(7, 2), 16) / 255) * opacity * 255).toString(16)).substr(
              -2,
            ));
}

export function objectAssign(target: object, ...sources: object[]) {
  sources.forEach((source) => {
    Object.keys(source).forEach((key) => {
      // @ts-ignore
      const s = source[key];
      // @ts-ignore
      const t = target[key];
      // @ts-ignore
      target[key] = t && s && typeof t === 'object' && typeof s === 'object' ? objectAssign(t, s) : s;
    });
  });
  return target;
}

export function deepTween(target: object, source: object, ratio: Ratio) {
  Object.keys(source).forEach((key) => {
    // @ts-ignore
    const sVal = source[key];
    // @ts-ignore
    const tVal = target[key];
    // @ts-ignore
    target[key] =
      tVal && sVal && typeof tVal === 'object' && typeof sVal === 'object'
        ? deepTween(tVal, sVal, ratio)
        : typeof sVal === 'number' && typeof tVal === 'number'
        ? tVal + (sVal - tVal) * ratio
        : sVal;
  });
  return target;
}

export function arrayToLookup(keyFun: Function, array: Array<any>) {
  return Object.assign({}, ...array.map((d) => ({ [keyFun(d)]: d })));
}

export function colorIsDark(color: string) {
  // fixme this assumes a white or very light background
  const rgba = stringToRGB(color);
  const { r, g, b, opacity } = rgba;
  const a = rgba.hasOwnProperty('opacity') ? opacity : 1;
  return r * 0.299 + g * 0.587 + b * 0.114 < a * 150;
}