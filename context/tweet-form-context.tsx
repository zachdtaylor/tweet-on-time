import React from 'react';
import { useForm } from 'react-hook-form';
import { nonNegativeIntegerReducer } from '../state/reducers';

const TweetFormContext = React.createContext(null);

export const TweetFormProvider = (props) => {
  const form = useForm();
  const value = { form };
  return <TweetFormContext.Provider value={value} {...props} />;
};

export const useTweetForm = () => {
  const context = React.useContext(TweetFormContext);
  if (context === undefined) {
    throw new Error('useTweetForm must be used within a TweetFormProvider');
  }
  return context;
};

const ThreadLengthContext = React.createContext(null);

export const ThreadLengthProvider = (props) => {
  const threadLengthReducer = React.useReducer(nonNegativeIntegerReducer, {
    state: 'ZERO',
    value: 0,
  });
  return <ThreadLengthContext.Provider value={threadLengthReducer} {...props} />;
};

export const useThreadLength = () => {
  const context = React.useContext(ThreadLengthContext);
  if (context === undefined) {
    throw new Error('useThreadLength must be used within a ThreadLengthProvider');
  }
  return context;
};
