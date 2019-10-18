import React, { Fragment } from 'react';
import { Chart, getSpecId, Circline } from '../src';

export class Playground extends React.Component {
  render() {
    const data = [{ x: 0, y: -4 }, { x: 1, y: -3 }, { x: 2, y: 2 }, { x: 3, y: 1 }];
    return (
      <Fragment>
        <div className="chart">
          <Chart>
            <Circline id={getSpecId('bars')} xAccessor="x" yAccessors={['y']} data={data} />
          </Chart>
        </div>
      </Fragment>
    );
  }
}
