import React from "react";
import { Controller } from "react-hook-form";
import tw, { css } from "twin.macro";
import { MdClose } from "react-icons/md";
import { useScheduleTweet } from "../utils/tweet";
import { range } from "../utils/misc";
import { redBorder, Spinner, TwitterButton, CircleButton } from "./lib";
import { TweetFormProvider, useTweetForm } from "../context/tweet-form-context";

const stylesCloseButton = [
  tw`cursor-pointer p-1 transition duration-200 rounded-full`,
  css`
    &:hover {
      background: rgb(31, 161, 241, 0.2);
    }
  `,
];

const TweetBody = ({ length, children }) => {
  const limit = 280;
  const { setThreadLength } = useTweetForm();
  return (
    <div tw="my-6">
      {children}
      <div tw="flex justify-between">
        <pre tw="pl-3 text-xs">
          <span css={[length > limit && tw`text-red-600`]}>
            {`${length ?? 0} `}
          </span>
          / {limit} character limit
        </pre>
        <CircleButton
          tw="mr-2"
          role="button"
          onClick={() => setThreadLength((l) => l + 1)}
        >
          +
        </CircleButton>
      </div>
    </div>
  );
};

const MainTweetBody = () => {
  const { form } = useTweetForm();
  const watchBody = form.watch("body");
  return (
    <TweetBody length={watchBody?.length}>
      <textarea
        name="body"
        tw="w-full h-44 p-4 resize-none"
        placeholder="What's happening?"
        ref={form.register({ required: true, maxLength: 280 })}
      />
    </TweetBody>
  );
};

const ThreadBody = ({ threadPos }) => {
  const { form } = useTweetForm();
  const name = `thread[${threadPos}].body`;
  const watchThreadBody = form.watch(name);
  const { setThreadLength } = useTweetForm();
  return (
    <TweetBody length={watchThreadBody?.length}>
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
          <div tw="flex pt-2 pr-2 justify-end text-white">
            <MdClose
              css={stylesCloseButton}
              size={36}
              onClick={() => setThreadLength((l) => Math.max(l - 1, 0))}
            />
          </div>
        )}
      </div>
    </TweetBody>
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
