// @flow

import type { ServiceStats } from './fastly-api';

type Action =
  | { type: 'SET_STATS', data: { [string]: ServiceStats[] } }
  | { type: 'SET_SERVICES', data: Map<string, string> }
  | { type: 'SET_GROUPINGS', data: Map<string, string> }
  | { type: 'SET_AREA', enabled: boolean };

function setStats(data: { [string]: ServiceStats[] }) {
  return { type: 'SET_STATS', data };
}

function setServices(data: Map<string, string>) {
  return { type: 'SET_SERVICES', data };
}

function setGroupings(data: Map<string, string>) {
  return { type: 'SET_GROUPINGS', data };
}

function setArea(enabled: boolean) {
  return { type: 'SET_AREA', enabled };
}

type State = {
  stats: { [string]: ServiceStats[] },
  groupings: Map<string, string>,
  services: Map<string, string>,
  area: boolean,
}

const initialState = {
  stats: {},
  groupings: new Map(),
  services: new Map(),
  area: false,
};

function reducer(state: State = initialState, action: Action) {
  switch (action.type) {

    case 'SET_STATS':
      return Object.assign({}, state, { stats: action.data });

    case 'SET_SERVICES':
      return Object.assign({}, state, { services: action.data });

    case 'SET_GROUPINGS':
      return Object.assign({}, state, { groupings: action.data });

    case 'SET_AREA':
      return Object.assign({}, state, { area: action.enabled });

    default:
      return state;

  }
}

export {
  setStats,
  setServices,
  setGroupings,
  setArea,
  reducer,
};
