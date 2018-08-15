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

const fetchStats = (
  from: string,
  by: string,
): Promise<FastlyStats> => {

  const requestData = {
    method: 'GET',
    headers: { 'Fastly-Key': '' },
  };

  return fetch(`https://api.fastly.com/stats/field/requests?from=${from}&by=${by}`, requestData).then(response => response.json());
};

export { fetchStats };
