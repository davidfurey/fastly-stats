import React from 'react';
import { connect } from 'react-redux';
import { VictoryChart, VictoryTheme, VictoryLine } from 'victory';

function LineChart() {
  return (
    <div style={{ width: '600px', height: '600px' }}>
      <VictoryChart theme={VictoryTheme.material}>
        <VictoryLine
          style={{
            data: { stroke: '#c43a31' },
            parent: { border: '1px solid #ccc' },
          }}
          data={[
            { x: 1, y: 2 },
            { x: 2, y: 3 },
            { x: 3, y: 5 },
            { x: 4, y: 4 },
            { x: 5, y: 7 },
          ]}
        />
      </VictoryChart>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    data: state.data,
  };
}

export default connect(mapStateToProps)(LineChart);
