// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { statsByField, services } from './fastly-api';
import { GroupedChart } from './LineChart';
import { groupings } from './fastly-groupings';
import {
  setStats,
  setServices,
  setGroupings,
  setArea,
  reducer,
} from './reducer';

declare var module : {
  hot: {
    accept(): void;
  };
};


const store = createStore(reducer);

services().then((serviceList) => {
  store.dispatch(setServices(new Map(serviceList.map(item => [item.id, item.name]))));
});

statsByField('bandwidth', '2 months ago', 'day').then(json => store.dispatch(setStats(json.data)));

store.dispatch(setGroupings(groupings));

const element: ?Element = document.getElementById('app');

if (element) {
  ReactDOM.render(
    (
      <Provider store={store}>
        <div>
          <GroupedChart />
          <p>
            <label htmlFor="stack-switch">
              <input
                id="stack-switch"
                type="checkbox"
                onClick={event => store.dispatch(setArea(event.target.checked))}
              />
              Stacked
            </label>
          </p>
        </div>
      </Provider>
    ),
    element,
  );
} else {
  console.log('Fatal error trying to render a page');
}

module.hot.accept();
