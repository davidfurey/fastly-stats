import React from 'react';
import { connect } from 'react-redux';
import { VictoryChart, VictoryTheme, VictoryLine, VictoryAxis } from 'victory';
import { fetchStats } from './fastlyapi';

function LineChart(props) {

  return (
    <div style={{ width: props.width, height: props.height }}>
      <VictoryChart theme={VictoryTheme.material} scale={{ x: 'time' }} width={props.width} height={props.height}>
        <VictoryLine
          style={{
            data: { stroke: '#c43a31' },
            parent: { border: '1px solid #ccc' },
          }}
          data={props.data}
        />
      </VictoryChart>
    </div>
  );
}

// export default LineCharts;

// function mapStateToProps(state) {
//   return {
//     data: state.data,
//   };
// }
//
// export default connect(mapStateToProps)(LineChart);


// fetchStats().then((json) => {
//   console.log(json);
//   store.dispatch(setData(json.data['1C2vPr3E26cRb4NXa0wMf3'].map((datum) => {
//     return {
//       x: new Date(datum.start_time),
//       y: datum.requests,
//     };
//   })));
// });

function LineCharts(props) {

  let propsData = props.data ? props.data : {};
  let services = props.services ? props.services : new Map();

  console.log('Services');
  console.log(services);
  return (
    <div>
      {
        Object.entries(propsData).map((service) => {
          console.log(service[0]);
          const data = service[1].map((datum) => {
            return {
              x: new Date(datum.start_time),
              y: datum.requests,
            };
          });

          console.log(service[0]);
          console.log(services[service[0]]);
          return (
            <div>
              <h1>{services.get(service[0])}</h1>
              <LineChart width={1200} height={400} data={data} />
            </div>
          );
        })
      }
    </div>
  );
}

// export default LineChart;

function mapStateToProps(state) {
  return {
    data: state.data,
    services: state.services,
  };
}

const ConnectedCharts = connect(mapStateToProps)(LineCharts);

export { ConnectedCharts };
