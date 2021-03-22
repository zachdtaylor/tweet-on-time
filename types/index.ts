import type { Method } from 'axios';

export interface Tweet {
  _id: string;
  body: string;
  tweetDate: string;
  tweetTime: string;
  thread: Tweet[];
}

export interface APIClientConfig {
  data?: any;
  method?: Method;
}

export interface APIResponse {
  message: string;
}

type Transition<TEvent, TState> = (event: TEvent, state: TState) => TState;

export interface NonNegativeIntState {
  state: 'positive' | 'zero';
  value: number;
}

export type NonNegativeIntEvent = 'increment' | 'decrement' | 'reset';

type NonNegativeIntTransition = Transition<NonNegativeIntEvent, NonNegativeIntState>;

interface NonNegativeIntTransitions {
  increment?: NonNegativeIntTransition;
  decrement?: NonNegativeIntTransition;
  reset?: NonNegativeIntTransition;
}

export interface NonNegativeIntTransitionConfig {
  positive: NonNegativeIntTransitions;
  zero: NonNegativeIntTransitions;
}
