const transition = (state, event, transitions) => {
  const type = typeof event === "string" ? event : event.type;
  return transitions[state.state][type]
    ? transitions[state.state][type](event, state)
    : state;
};

export const nonNegativeIntegerReducer = (integer, event) =>
  transition(integer, event, {
    POSITIVE: {
      INCREMENT: (_, integer) => ({
        state: "POSITIVE",
        value: integer.value + 1,
      }),
      DECREMENT: (_, integer) => ({
        state: integer.value === 1 ? "ZERO" : "POSITIVE",
        value: integer.value - 1,
      }),
      RESET: () => ({ state: "ZERO", value: 0 }),
    },
    ZERO: {
      INCREMENT: () => ({ state: "POSITIVE", value: 1 }),
    },
  });
