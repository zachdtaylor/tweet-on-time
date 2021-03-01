import { useForm } from "react-hook-form";
import tw from "twin.macro";
import {
  useScheduleTweet,
  useScheduledTweets,
  useDeleteTweet,
} from "../utils/tweet";
import { DeleteButton, redBorder, Spinner, TwitterButton } from "./lib";

export const TweetForm = () => {
  const { register, errors, reset, handleSubmit } = useForm();
  const scheduleTweet = useScheduleTweet();

  const onSubmit = (data) => {
    scheduleTweet.mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} tw="mt-4">
      <label htmlFor="body" tw="hidden">
        Tweet Content
      </label>
      <textarea
        css={[tw`w-full p-3`, errors.body && redBorder]}
        name="body"
        rows="6"
        placeholder="What's happening?"
        ref={register({ required: true })}
      ></textarea>
      <div tw="flex flex-row mt-4">
        <div>
          <label htmlFor="tweet-date"> Date </label>
          <input
            css={[errors.tweetDate && redBorder]}
            type="date"
            id="tweet-date"
            name="tweetDate"
            ref={register({ required: true })}
          />
        </div>
        <div tw="mx-4">
          <label htmlFor="tweet-time my-1"> Time </label>
          <input
            css={[errors.tweetTime && redBorder]}
            type="time"
            id="tweet-time"
            name="tweetTime"
            ref={register({ required: true })}
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
      <p tw="text-base mb-2">{tweet.body}</p>
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
