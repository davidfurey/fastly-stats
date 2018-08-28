import React from 'react';
import { connect } from 'react-redux';
import { VictoryChart, VictoryTheme, VictoryLine, VictoryLegend } from 'victory';

function LineChart(props) {

  return (
    <VictoryLine
      style={{
        data: { stroke: '#c43a31' },
        parent: { border: '1px solid #ccc' },
      }}
      data={props.data}
    />
  );
}

function colours(i: number) {
  const colourList = [
    '#e6194b',
    '#3cb44b',
    '#ffe119',
    '#0082c8',
    '#f58231',
    '#911eb4',
    '#46f0f0',
    '#f032e6',
    '#d2f53c',
    '#fabebe',
    '#008080',
    '#e6beff',
    '#aa6e28',
    '#fffac8',
    '#800000',
    '#aaffc3',
    '#808000',
    '#ffd8b1',
    '#000080',
    '#808080',
    '#FFFFFF',
    '#000000',
  ];

  return colourList[i % colourList.length];
}

function LineCharts(props) {

  let propsData = props.data ? props.data : {};
  let services = props.services ? props.services : new Map();

  const legendData = Object.entries(propsData).map((service, i) => {
    return { name: services.get(service[0]), symbol: { fill: colours(i) } }
  });

  return (
    <div>
      <div style={{ width: 1600, height: 800, border: '1px solid red' }}>
        <VictoryChart theme={VictoryTheme.material} y={0} scale={{ x: 'time' }} width={800} height={600}>
          <VictoryLegend
            x={800}
            y={0}
            title="Legend"
            centerTitle
            orientation="vertical"
            gutter={0}
            style={{
              border: { stroke: 'black' },
              labels: { fontSize: 5 },
              title: { fontSize: 5 },
            }}
            data={legendData}
          />
        {
          Object.entries(propsData).map((service, i) => {
            const data = service[1].map((datum) => {
              return {
                x: new Date(datum.start_time),
                y: datum.requests,
              };
            });
            return (
              <VictoryLine
                key={service[0]}
                style={{
                  data: { stroke: colours(i) },
                  parent: { border: '1px solid #ccc' },
                }}
                data={data}
              />
            );
          })
        }
        </VictoryChart>
      </div>
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
