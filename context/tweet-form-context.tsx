import type { Dispatch } from 'react'
import {FieldValues, UseFormMethods} from 'react-hook-form'
import React from 'react';
import { useForm } from 'react-hook-form';
import { nonNegativeIntegerReducer } from '../state/reducers';
import { NonNegativeIntEvent, NonNegativeIntState } from '../types';

const TweetFormContext = React.createContext<UseFormMethods<FieldValues>>(null);

export const TweetFormProvider = (props) => {
  const form = useForm();
  return <TweetFormContext.Provider value={form} {...props} />;
};

export const useTweetForm = () => {
  const context = React.useContext(TweetFormContext);
  if (context === undefined) {
    throw new Error('useTweetForm must be used within a TweetFormProvider');
  }
  return context;
};

type ThreadLength = [NonNegativeIntState, Dispatch<NonNegativeIntEvent>]

const ThreadLengthContext = React.createContext<ThreadLength>(null);

export const ThreadLengthProvider = (props) => {
  const threadLengthReducer = React.useReducer(nonNegativeIntegerReducer, {
    state: 'zero',
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
