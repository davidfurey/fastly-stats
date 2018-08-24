// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { fetchStats, services } from './fastlyapi';
import moment from 'moment';
import { ConnectedCharts } from './LineChart';

const title = 'My Minimal React Webpack Babel Setup';

const element: ?Element = document.getElementById('app');

function reducer(state = { data: {} }, action) {
  switch (action.type) {

    case 'SET_DATA':
      console.log('setting state:');
      console.log(action.data);
      return Object.assign({}, state, { data: action.data });

    case 'SET_SERVICES':
      console.log('setting state:');
      console.log(action.data);
      return Object.assign({}, state, { services: action.data });

    default:
      return state;

  }
}

declare var module : {
  hot: {
    accept(): void;
  };
};

// <Provider store={createStoreWithMiddleware(reducers)}>
// fetchStats().then((response) => {
//   if (response.ok) {
//     response.json().then((json) => {
//       console.log(json);
//     });
//   } else {
//     console.log('error');
//   }
// });

// fetchStats()

const store = createStore(reducer);

function setData(data) {
  return { type: 'SET_DATA', data };
}

function setServices(data) {
  return { type: 'SET_SERVICES', data };
}

function formatMillis(number) {
  return moment(number).format('hh:mm:ss');
}

services().then((serviceList) => {
  store.dispatch(setServices(new Map(serviceList.map(item => [item.id, item.name]))));
});

fetchStats().then((json) => {
  console.log(json);
  // store.dispatch(setData(json.data['1C2vPr3E26cRb4NXa0wMf3'].map((datum) => {
  //   return {
  //     x: new Date(datum.start_time),
  //     y: datum.requests,
  //   };
  // })));
  store.dispatch(setData(json.data));
});

const refCallback = element => {
  if (element) {
    console.log(element.getBoundingClientRect());
  }
};

if (element) {
  ReactDOM.render(
    (
      <Provider store={store}>
        <div ref={refCallback}>
          {title}
          <ConnectedCharts />
        </div>
      </Provider>
    ),
    element,
  );
} else {
  console.log('Fatal error trying to render a page');
}

module.hot.accept();
