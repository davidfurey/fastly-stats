// @flow

import type { ServiceStats } from './fastly-api';

type Action =
  | { type: 'SET_STATS', data: { [string]: ServiceStats[] } }
  | { type: 'SET_SERVICES', data: Map<string, string> }
  | { type: 'SET_GROUPINGS', data: Map<string, string> }
  | { type: 'SET_AREA', enabled: boolean }
  | { type: 'SET_STAGING_FASTLY_KEY', key: string }
  | { type: 'SUBMIT_FASTLY_KEY' };


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

function setStagingFastlyKey(key: string) {
  return { type: 'SET_STAGING_FASTLY_KEY', key };
}

function submitFastlyKey() {
  return { type: 'SUBMIT_FASTLY_KEY' };
}

type State = {
  stats: { [string]: ServiceStats[] },
  groupings: Map<string, string>,
  services: Map<string, string>,
  area: boolean,
  fastly_key: string,
  staging_fastly_key: string,
}

const initialState = {
  stats: {},
  groupings: new Map(),
  services: new Map(),
  area: false,
  fastly_key: '',
  staging_fastly_key: '',
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

    case 'SET_STAGING_FASTLY_KEY':
      return Object.assign({}, state, { staging_fastly_key: action.key });

    case 'SUBMIT_FASTLY_KEY':
      return Object.assign({}, state, { fastly_key: state.staging_fastly_key });

    default:
      return state;

  }
}

export {
  setStats,
  setServices,
  setGroupings,
  setArea,
  setStagingFastlyKey,
  submitFastlyKey,
  reducer,
};
