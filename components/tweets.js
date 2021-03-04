import React from "react";
import { useForm, Controller } from "react-hook-form";
import tw, { css } from "twin.macro";
import { MdClose } from "react-icons/md";
import {
  useScheduleTweet,
  useScheduledTweets,
  useDeleteTweet,
} from "../utils/tweet";
import { range } from "../utils/misc";
import {
  DeleteButton,
  redBorder,
  Spinner,
  TwitterButton,
  CircleButton,
} from "./lib";

const stylesCloseButton = [
  tw`cursor-pointer p-1 transition duration-200 rounded-full`,
  css`
    &:hover {
      background: rgb(31, 161, 241, 0.2);
    }
  `,
];

const TweetBody = ({ thread, threadPos, form, setThreadLength }) => {
  const limit = 280;
  const name = thread ? `thread[${threadPos}].body` : "body";
  const watchBody = form.watch(name);
  return (
    <div tw="my-6">
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
        {thread && (!watchBody || watchBody.length === 0) && (
          <div tw="flex pt-2 pr-2 justify-end text-white">
            <MdClose
              css={stylesCloseButton}
              size={36}
              onClick={() => setThreadLength((l) => Math.max(l - 1, 0))}
            />
          </div>
        )}
      </div>
      <div tw="flex justify-between">
        <pre tw="pl-3 text-xs">
          <span css={[watchBody?.length > limit && tw`text-red-600`]}>
            {`${watchBody?.length ?? 0} `}
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

export const TweetForm = () => {
  const form = useForm();
  const scheduleTweet = useScheduleTweet();
  const [threadLength, setThreadLength] = React.useState(0);

  const onSubmit = (data) => {
    scheduleTweet.mutate(data, {
      onSuccess: () => {
        form.reset();
        form.setValue("body", "");
        setThreadLength(0);
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} tw="mt-4">
      <label htmlFor="body" tw="hidden">
        Tweet Content
      </label>
      <TweetBody form={form} setThreadLength={setThreadLength} />
      {range(threadLength).map((k) => (
        <TweetBody
          key={k}
          thread={true}
          threadPos={k}
          form={form}
          setThreadLength={setThreadLength}
        />
      ))}
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
      <div tw="flex justify-end mt-7">
        <TwitterButton type="submit">
          {scheduleTweet.isLoading ? <Spinner /> : "Schedule Tweet"}
        </TwitterButton>
      </div>
    </form>
  );
};

const TweetBodyPreview = tw.p`
  text-base mb-2 bg-gray-200 bg-opacity-10 p-2 rounded-md
`;

const Tweet = ({ tweet }) => {
  const deleteTweet = useDeleteTweet();

  const formatDate = (date, time) => {
    const dateTime = new Date(`${date} ${time}`);
    return Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(dateTime);
  };

  return (
    <div tw="p-4 my-4 rounded-md bg-gray-700 opacity-80">
      <div tw="flex justify-between mb-2">
        <h1 tw="text-xl">Tweet</h1>
        <p tw="text-xs">{formatDate(tweet.tweetDate, tweet.tweetTime)}</p>
      </div>
      <div tw="grid gap-2 mb-6">
        <TweetBodyPreview>{tweet.body}</TweetBodyPreview>
        {tweet.thread.map((tweet) => (
          <TweetBodyPreview>{tweet.body}</TweetBodyPreview>
        ))}
      </div>
      <div tw="flex justify-end">
        <DeleteButton onClick={() => deleteTweet.mutate(tweet._id)}>
          {deleteTweet.isLoading ? <Spinner /> : "Delete"}
        </DeleteButton>
      </div>
    </div>
  );
};

export const ScheduledTweets = () => {
  const scheduledTweets = useScheduledTweets();

  return (
    <div tw="my-8">
      {scheduledTweets.data.length ? (
        scheduledTweets.data.map((tweet) => (
          <Tweet key={tweet._id} tweet={tweet} />
        ))
      ) : (
        <div tw="flex justify-center opacity-60">
          You have no scheduled tweets
        </div>
      )}
    </div>
  );
};
