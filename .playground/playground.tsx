import React from 'react';
import { Chart, Partition } from '../src';
import { Datum } from '../src/chart_types/xy_chart/utils/specs';
import { defaultQuadModelAttribute, partialOf } from '../src/chart_types/partition_chart/layout/viewmodel/viewmodel';
import { mocks } from '../src/mocks/hierarchical/index';
import { config } from '../src/chart_types/partition_chart/layout/config/config';
import { PartitionLayouts } from '../src/chart_types/partition_chart/layout/types/config_types';
import { arrayToLookup, hueInterpolator } from '../src/chart_types/partition_chart/layout/utils/calcs';
import { countryDimension, regionDimension } from '../src/mocks/hierarchical/dimension_codes';

const regionLookup = arrayToLookup((d: Datum) => d.region, regionDimension);
const countryLookup = arrayToLookup((d: Datum) => d.country, countryDimension);
const interpolatorCET2s = hueInterpolator(config.palettes.CET2s);
const defaultFillColor = (colorMaker: any) => (d: any, i: number, a: any[]) => colorMaker(i / (a.length + 1));

const validator = partialOf({ ...defaultQuadModelAttribute, depth: 0, inRingIndex: 0 });

export class Playground extends React.Component<{}, { isSunburstShown: boolean }> {
  chartRef: React.RefObject<Chart> = React.createRef();
  state = {
    isSunburstShown: true,
  };

  render() {
    return (
      <>
        <div className="chart">
          <Chart ref={this.chartRef}>
            <Partition
              id={'piechart'}
              data={mocks.sunburst.slice(0, 3)}
              valueAccessor={(d: Datum) => {
                console.log(d.exportVal);
                return d.exportVal as number;
              }}
              /*
              valueFormatter={(d: number) => {
                debugger;
                return 'hshs';
                // return `$${config.fillLabel.formatter(Math.round(d / 1000000000))} Bn`;
              }}
*/
              attributes={[
                {
                  importance: 0,
                  fillColor: 'steelblue',
                  strokeWidth: 1,
                  depth: 1,
                  inRingIndex: 0,
                },
                {
                  importance: 0,
                  fillColor: 'red',
                  strokeWidth: 1,
                  depth: 1,
                  inRingIndex: 1,
                },
                {
                  importance: 0,
                  fillColor: 'green',
                  strokeWidth: 4,
                  depth: 1,
                  inRingIndex: 2,
                },

                /*
                { layer: 0, groupByRollup: (d: Datum) => d.g, nodeLabel: (d: Datum) => `Group ${d}` },
                { layer: 1, groupByRollup: (d: Datum) => d.id, nodeLabel: (d: Datum) => d },
                */
              ].map(validator)}
              /*
              layers={[
                {
                  groupByRollup: (d: Datum) => countryLookup[d.dest].continentCountry.substr(0, 2),
                  nodeLabel: (d: any) => regionLookup[d].regionName,
                  fillLabel: {
                    fontFamily: 'Impact',
                    formatter: (d: number) => `$${config.fillLabel.formatter(Math.round(d / 1000000000000))}\xa0Tn`,
                  },
                  shape: {
                    fillColor: defaultFillColor(interpolatorCET2s),
                  },
                },
                {
                  groupByRollup: (d: Datum) => d.dest,
                  nodeLabel: (d: any) => countryLookup[d].name,
                  shape: {
                    fillColor: defaultFillColor(interpolatorCET2s),
                  },
                },
              ]}
*/
              /*
              config={Object.assign({}, config, {
                hierarchicalLayout: PartitionLayouts.sunburst,
                colors: 'CET2s',
                linkLabel: Object.assign({}, config.linkLabel, {
                  maxCount: 0,
                  fontSize: 14,
                }),
                fontFamily: 'Arial',
                fillLabel: Object.assign({}, config.fillLabel, {
                  formatter: (d: number) => `$${config.fillLabel.formatter(Math.round(d / 1000000000))}\xa0Bn`,
                  fontStyle: 'italic',
                }),
                margin: Object.assign({}, config.margin, { top: 0, bottom: 0, left: 0, right: 0 }),
                minFontSize: 1,
                idealFontSizeJump: 1.1,
                outerSizeRatio: 1,
                emptySizeRatio: 0,
                circlePadding: 4,
                backgroundColor: 'rgba(229,229,229,1)',
              })}
*/
            />
          </Chart>
        </div>
      </>
    );
  }
}
