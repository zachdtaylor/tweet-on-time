import type { APIClientConfig } from '../types';
import type { Method } from 'axios';
import axios from 'axios';

async function client<T>(endpoint, { data, ...customConfig }: APIClientConfig = {}) {
  const config = {
    method: (data ? 'POST' : 'GET') as Method,
    baseURL: process.env.API_URL,
    url: endpoint,
    headers: {
      'Content-Type': data ? 'application/json' : undefined,
    },
    data,
    ...customConfig,
  };
  const response = await axios(config);
  return response.data as T;
}

export { client };
