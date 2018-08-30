// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import type { ServiceStats } from './fastly-api';
import { groupBy, flatten, sum } from './array-utils';

function formatMillis(n: number) {
  return moment(n * 1000).format('YYYY-MM-DD');
}

function aggregateStat(arr: ServiceStats[], fn: ServiceStats => number): Map<string, number> {
  return Array.from(groupBy(arr, _ => _.start_time.toString())).reduce(
    (acc, [k, v]) => acc.set(k, sum(v, fn)),
    (new Map(): Map<string, number>),
  );
}

const colourList = [
  [230, 25, 75],
  [60, 180, 75],
  [255, 225, 25],
  [0, 130, 200],
  [245, 130, 49],
  [145, 30, 180],
  [70, 240, 240],
  [240, 50, 230],
  [210, 245, 60],
  [250, 190, 190],
  [0, 128, 128],
  [230, 190, 255],
  [170, 110, 40],
  [255, 250, 200],
  [128, 0, 0],
  [170, 255, 195],
  [128, 128, 0],
  [255, 216, 177],
  [0, 0, 128],
  [128, 128, 128],
  [255, 0, 255],
  [0, 0, 0],
];

function getColour(index, alpha) {
  const c = colourList[index];
  return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha})`;
}

function createDataSet(key, data: number[], area: boolean, index: number): Object {
  const colourIndex = index % colourList.length;
  return {
    label: key,
    fill: area,
    lineTension: 0.1,
    backgroundColor: getColour(colourIndex, 0.4),
    borderColor: getColour(colourIndex, 1),
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBorderColor: getColour(colourIndex, 1),
    pointBackgroundColor: '#fff',
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: getColour(colourIndex, 1),
    pointHoverBorderColor: 'rgba(220,220,220,1)',
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
    data,
  };
}

function getLabels(data: {| [string]: ServiceStats[] |}): string[] {
  const values = ((Array.from(Object.values(data)): any): ServiceStats[][]);
  return Array.from(groupBy(flatten(values), _ => _.start_time.toString()).keys()).sort();
}

type PropTypes = {
  groupings: { [string]: string },
  stats: {| [string]: ServiceStats[] |},
  services: Map<string, string>,
  area: boolean,
}

function BaseGroupedChart({
  groupings = {}, stats = {}, services = new Map(), area,
}: PropTypes) {

  const labels = getLabels(stats);

  const flattenedStats: ServiceStats[] = flatten(((Object.values(stats): any): ServiceStats[][]));

  const groupedStats: Map<string, ServiceStats[]> = groupBy(
    flattenedStats,
    _ => groupings[_.service_id] || services.get[_.service_id] || 'unknown service',
  );

  const datasets: Object[] = Array.from(groupedStats).map(
    ([key, value], i) => {
      const aggregated = aggregateStat(value, _ => _.bandwidth);
      return createDataSet(key, labels.map(l => (aggregated.get(l) || 0) / 1000000000000), area, i);
    },
  );

  const chartData = {
    labels: labels.map(item => formatMillis(parseInt(item, 10))),
    datasets,
  };

  const options = {
    responsive: true,
    title: {
      display: true,
      text: 'Fastly bandwidth - last 28 days',
    },
    tooltips: {
      mode: 'index',
    },
    hover: {
      mode: 'index',
    },
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Day',
        },
      }],
      yAxes: [{
        stacked: area,
        scaleLabel: {
          display: true,
          labelString: 'Bandwidth (TB)',
        },
      }],
    },
  };

  return (<Line data={chartData} options={options} />);
}

function mapStateToProps(state) {
  return {
    stats: state.stats,
    services: state.services,
    groupings: state.groupings,
    area: !!state.area,
  };
}

const GroupedChart = connect(mapStateToProps)(BaseGroupedChart);

export { GroupedChart };
