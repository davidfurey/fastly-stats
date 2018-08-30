// @flow

const debug = true;

export type ServiceStats = {
  service_id: string,
  start_time: number,
  requests: number,
  bandwidth: number,
};

export type FastlyStats = {
  data: {
    [string]: ServiceStats[],
  },
  status: string,
  msg: ?string,
  meta: {
    from: string,
    to: string,
    by: string,
    region: string,
  }
};

type FastlyVersion = {
  active: ?boolean,
  comment: string,
  created_at: string,
  deleted_at: ?string,
  deployed: boolean,
  locked: boolean,
  number: number,
  service: string,
  service_id: string,
  staging: boolean,
  testing: boolean,
  updated_at: string
};

type FastlyService = {
  comment: string,
  customer_id: string,
  id: string,
  name: string,
  version: number,
  versions: FastlyVersion[],
};

const hostname = debug ? 'http://localhost:8000' : 'https://api.fastly.com';

const requestData = debug ? {
  method: 'GET',
} : {
  method: 'GET',
  headers: { 'Fastly-Key': process.env.FASTLY_KEY || '' },
};


function statsByField(
  field: string,
  from: string,
  by: string,
): Promise<FastlyStats> {

  return fetch(`${hostname}/stats/field/${field}?from=${from}&by=${by}`, requestData).then(response => response.json());
}

function services(): Promise<FastlyService[]> {

  return fetch(`${hostname}/service`, requestData).then(response => response.json());
}

export { statsByField, services };
