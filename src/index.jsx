// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
// import { fetchStats } from './fastlyapi';

import LineChart from './LineChart';

const title = 'My Minimal React Webpack Babel Setup';

const element: ?Element = document.getElementById('app');

function reducer(previousState = {}) { // action
  return previousState;
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

if (element) {
  ReactDOM.render(
    (
      <Provider store={createStore(reducer)}>
        <div>{title}</div>
        <LineChart />
      </Provider>
    ),
    element,
  );
} else {
  console.log('Fatal error trying to render a page');
}

module.hot.accept();
