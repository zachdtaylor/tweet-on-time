import type { Method } from 'axios';

export interface Tweet {
  _id: string;
  body: string;
  tweetDate: string;
  tweetTime: string;
  thread: Tweet[];
}

export interface APIClientConfig {
  data: any;
  method: Method;
}
