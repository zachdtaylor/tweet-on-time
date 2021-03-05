import React from "react";
import { Controller } from "react-hook-form";
import tw from "twin.macro";
import { useScheduleTweet } from "../utils/tweet";
import { range } from "../utils/misc";
import {
  redBorder,
  Spinner,
  TwitterButton,
  AddButton,
  CloseButton,
} from "./lib";
import { TweetFormProvider, useTweetForm } from "../context/tweet-form-context";

const TweetControls = ({ bodyLength, children, showAddButton }) => {
  const limit = 280;
  const { setThreadLength } = useTweetForm();
  return (
    <div tw="my-6">
      {children}
      <div tw="flex justify-between">
        <pre tw="pl-3 text-xs">
          <span css={[bodyLength > limit && tw`text-red-600`]}>
            {`${bodyLength ?? 0} `}
          </span>
          / {limit} character limit
        </pre>
        {bodyLength > 0 && showAddButton && (
          <div tw="mr-2">
            <AddButton onClick={() => setThreadLength((l) => l + 1)} />
          </div>
        )}
      </div>
    </div>
  );
};

const MainTweetBody = () => {
  const { form, threadLength } = useTweetForm();
  const watchBody = form.watch("body");
  return (
    <TweetControls
      bodyLength={watchBody?.length}
      showAddButton={threadLength === 0}
    >
      <textarea
        name="body"
        tw="w-full h-44 p-4 resize-none"
        placeholder="What's happening?"
        ref={form.register({ required: true, maxLength: 280 })}
      />
    </TweetControls>
  );
};

const ThreadBody = ({ threadPos }) => {
  const { form, threadLength, setThreadLength } = useTweetForm();
  const name = `thread[${threadPos}].body`;
  const watchThreadBody = form.watch(name);
  return (
    <TweetControls
      bodyLength={watchThreadBody?.length}
      showAddButton={threadLength === threadPos + 1}
    >
      <div
        css={[
          tw`flex bg-slategray mb-2 rounded-md`,
          form.errors[name] && redBorder,
        ]}
      >
        <Controller
          control={form.control}
          name={name}
          rules={{ required: true, maxLength: 280 }}
          defaultValue=""
          render={({ onChange, ref }) => (
            <div
              tw="w-full h-44 p-4 focus:outline-none"
              contentEditable={true}
              onInput={(e) => onChange(e.currentTarget.textContent)}
              ref={ref}
            ></div>
          )}
        />
        {(!watchThreadBody || watchThreadBody.length === 0) && (
          <div tw="flex pt-2 pr-2 justify-end">
            <CloseButton
              onClick={() => setThreadLength((l) => Math.max(l - 1, 0))}
            />
          </div>
        )}
      </div>
    </TweetControls>
  );
};

const TweetThread = () => {
  const { form, threadLength } = useTweetForm();
  return (
    <>
      <MainTweetBody form={form} />
      {range(threadLength).map((k) => (
        <ThreadBody key={k} threadPos={k} form={form} />
      ))}
    </>
  );
};

const DateAndTime = () => {
  const { form } = useTweetForm();
  return (
    <div tw="flex flex-row mt-4">
      <div>
        <label htmlFor="tweet-date"> Date </label>
        <input
          css={[form.errors.tweetDate && redBorder]}
          type="date"
          id="tweet-date"
          name="tweetDate"
          ref={form.register({ required: true })}
        />
      </div>
      <div tw="mx-4">
        <label htmlFor="tweet-time my-1"> Time </label>
        <input
          css={[form.errors.tweetTime && redBorder]}
          type="time"
          id="tweet-time"
          name="tweetTime"
          ref={form.register({ required: true })}
        />
      </div>
    </div>
  );
};

const ScheduleTweetButton = ({ isLoading }) => (
  <div tw="flex justify-end mt-7">
    <TwitterButton type="submit">
      {isLoading ? <Spinner /> : "Schedule Tweet"}
    </TwitterButton>
  </div>
);

const TweetFormConsumer = () => {
  const scheduleTweet = useScheduleTweet();
  const { setThreadLength, form } = useTweetForm();

  const onSubmit = (data) => {
    scheduleTweet.mutate(data, {
      onSuccess: () => {
        form.reset();
        setThreadLength(0);
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} tw="mt-4">
      <label htmlFor="body" tw="hidden">
        Tweet Content
      </label>
      <TweetThread />
      <DateAndTime />
      <ScheduleTweetButton isLoading={scheduleTweet.isLoading} />
    </form>
  );
};

export const TweetForm = () => (
  <TweetFormProvider>
    <TweetFormConsumer />
  </TweetFormProvider>
);
