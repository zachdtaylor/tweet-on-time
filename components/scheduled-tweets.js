import tw from "twin.macro";
import { useDeleteTweet, useScheduledTweets } from "../utils/tweet";
import { DeleteButton, Spinner } from "./lib";

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
        {tweet.thread?.map((tweet) => (
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
