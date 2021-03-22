import type {
  NonNegativeIntEvent,
  NonNegativeIntState,
  NonNegativeIntTransitionConfig,
} from '../types';

const transition = (
  state: NonNegativeIntState,
  event: NonNegativeIntEvent,
  transitions: NonNegativeIntTransitionConfig
): NonNegativeIntState => {
  return transitions[state.state][event]
    ? transitions[state.state][event](event, state)
    : state;
};

export const nonNegativeIntegerReducer = (
  integer: NonNegativeIntState,
  event: NonNegativeIntEvent
): NonNegativeIntState =>
  transition(integer, event, {
    positive: {
      increment: (_, integer) => ({
        state: 'positive',
        value: integer.value + 1,
      }),
      decrement: (_, integer) => ({
        state: integer.value === 1 ? 'zero' : 'positive',
        value: integer.value - 1,
      }),
      reset: () => ({ state: 'zero', value: 0 }),
    },
    zero: {
      increment: () => ({ state: 'positive', value: 1 }),
    },
  });
