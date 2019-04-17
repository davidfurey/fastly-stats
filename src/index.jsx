// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { stats, services } from './fastly-api';
import { GroupedChart } from './LineChart';
import { groupings } from './fastly-groupings';
import { handleClientLoad } from './google-sheets.js';

import {
  setStats,
  setServices,
  setGroupings,
  setArea,
  setStagingFastlyKey,
  submitFastlyKey,
  reducer,
} from './reducer';

declare var module : {
  hot: {
    accept(): void;
  };
};


const store = createStore(reducer);

store.dispatch(setGroupings(groupings));

const element: ?Element = document.getElementById('app');

const fastlyKeyChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
  const fastlyKey: string = event.target.value;
  store.dispatch(setStagingFastlyKey(fastlyKey));
};

const submitFastlyKeyClick = () => {

  const key = store.getState().staging_fastly_key;
  services(key).then((serviceList) => {
    store.dispatch(setServices(new Map(serviceList.map(item => [item.id, item.name]))));
  });

  stats('2 months ago', 'day', key).then(json => store.dispatch(setStats(json.data)));

  store.dispatch(submitFastlyKey());
};

function gapiOnLoad() {
  console.log('gapi on load');
  this.onload = function () {};
  handleClientLoad();
}

function gapiOnReady() {
  console.log('gapi on ready');
  if (this.readyState === 'complete') { this.onload() }
}

if (element) {
  ReactDOM.render(
    (
      <Provider store={store}>
        <div>
          <p>
            <form onSubmit={e => e.preventDefault()}>
              <label htmlFor="fastly-key">
                <input
                  id="fastly-key"
                  type="password"
                  onChange={fastlyKeyChange}
                />
                <button
                  type="button"
                  id="fastly-key-submit"
                  onClick={submitFastlyKeyClick}
                >
                  Submit
                </button>
                Fastly Key
              </label>
            </form>
          </p>
          <GroupedChart
            title="Fastly bandwidth - last 28 days"
            yAxis="Bandwidth (TB)"
            dataExtractor={_ => _.bandwidth / 1000000000000}
          />
          <GroupedChart
            title="Fastly requests - last 28 days"
            yAxis="Requests (million)"
            dataExtractor={_ => _.requests / 1000000}
          />
          <GroupedChart
            title="Fastly cost estimate - last 28 days"
            yAxis="Cost ($)"
            dataExtractor={_ => _.bandwidth * 0.019 / 1000000000}
          />
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
          <script
            async
            defer
            src="https://apis.google.com/js/api.js"
            onLoad={gapiOnLoad}
            onreadystatechange={gapiOnReady}
          />
        </div>
      </Provider>
    ),
    element,
  );
} else {
  console.log('Fatal error trying to render a page');
}

module.hot.accept();
