// @flow

type ServiceStats = {
  service_id: string,
  start_time: number,
  requests: number,
};

type FastlyStats = {
  data: {
    string: ServiceStats[],
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

const fetchStats = (
  from: string,
  by: string,
): Promise<FastlyStats> => {

  const requestData = {
    method: 'GET',
    headers: { 'Fastly-Key': process.env.FASTLY_KEY },
  };

  return fetch(`https://api.fastly.com/stats/field/requests?from=${from}&by=${by}`, requestData).then(response => response.json());
};

const services = (): Promise<FastlyService[]> => {

  const requestData = {
    method: 'GET',
    headers: { 'Fastly-Key': process.env.FASTLY_KEY },
  };

  return fetch('https://api.fastly.com/service', requestData).then(response => response.json());
};

export { fetchStats, services };
