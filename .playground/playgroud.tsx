import React, { Fragment } from 'react';
import {
  Axis,
  Chart,
  getAxisId,
  getSpecId,
  Position,
  ScaleType,
  Settings,
  BarSeries,
  LineSeries,
  AreaSeries,
} from '../src';

export class Playground extends React.Component {
  render() {

    return (
      <Fragment>
        <div className="chart">
          <Chart>
            <Settings showLegend={true}/>
            <BarSeries
              id={getSpecId('bar')}
              yScaleType={ScaleType.Linear}
              xScaleType={ScaleType.Linear}
              xAccessor={0}
              yAccessors={[1]}
              data={[[0, 100], [1, 50], [3, 400], [4, 250], [5, 235]]}
            />
          </Chart>
        </div>
      </Fragment>
    );
  }
}
