// @ts-ignore
import { scaleOrdinal as d3ScaleOrdinal } from 'd3-scale';
// @ts-ignore
import { quantize as d3Quantize } from 'd3-interpolate';
// @ts-ignore
import { color as d3Color, rgb as d3Rgb } from 'd3-color';

type RGB = number;
type A = number;
export type RgbTuple = [RGB, RGB, RGB];
export type RgbObject = { r: RGB; g: RGB; b: RGB; opacity: A };

export type ColorScale = (value: any) => RgbObject;
export const toRGB: ColorScale = d3Color;
export const fromRGB = d3Rgb;

export const makeColorScale = (colorMaker: Function, count: number): ColorScale =>
  d3ScaleOrdinal(d3Quantize(colorMaker, count));

export const keyValuesToNameChildren = (d: any) =>
  d.key && d.values ? { name: d.key, children: d.values.map(keyValuesToNameChildren) } : d;
