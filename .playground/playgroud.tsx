import React, { Fragment } from 'react';
import { Chart, getSpecId, Circline } from '../src';

export class Playground extends React.Component {
  render() {
    //const data = [{ x: 0, y: -4 }, { x: 1, y: -3 }, { x: 2, y: 2 }, { x: 3, y: 1 }];
    const data = [
      { x: 0, name: '7', value: 3110253391368 },
      { x: 1, name: '3', value: 1929578418424 },
      {
        x: 2,
        name: '5',
        value: 848173542536,
      },
      { x: 3, name: '8', value: 816837797016 },
      { x: 4, name: '6', value: 745168037744 },
      {
        x: 5,
        name: '9',
        value: 450507812880,
      },
      { x: 6, name: '2', value: 393895581328 },
      { x: 7, name: '0', value: 353335453296 },
      {
        x: 8,
        name: '1',
        value: 54461075800,
      },
      { x: 9, name: '4', value: 36006897720 },
    ];
    return (
      <Fragment>
        <div className="chart">
          <Chart>
            <Circline id={getSpecId('bars')} yAccessors={['value']} data={data} />
          </Chart>
        </div>
      </Fragment>
    );
  }
}
