import React from "react";
import { useForm } from "react-hook-form";

const TweetFormContext = React.createContext();

export const TweetFormProvider = (props) => {
  const form = useForm();
  const [threadLength, setThreadLength] = React.useState(0);
  const value = { threadLength, setThreadLength, form };
  return <TweetFormContext.Provider value={value} {...props} />;
};

export const useTweetForm = () => {
  const context = React.useContext(TweetFormContext);
  if (context === undefined) {
    throw new Error("useTweetForm must be used within a TweetFormProvider");
  }
  return context;
};
