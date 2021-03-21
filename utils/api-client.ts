import type { APIClientConfig } from '../types';
import axios from 'axios';

async function client(endpoint, clientConfig: APIClientConfig | {} = {}) {
  const { data, ...customConfig } = clientConfig as APIClientConfig;
  const config = {
    method: data ? 'POST' : 'GET',
    baseURL: process.env.API_URL,
    url: endpoint,
    headers: {
      'Content-Type': data ? 'application/json' : undefined,
    },
    data,
    ...customConfig,
  };
  const response = await axios(config);
  return response.data;
}

export { client };
