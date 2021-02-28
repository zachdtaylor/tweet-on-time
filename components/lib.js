import { useForm } from "react-hook-form";
import Head from "next/head";
import "twin.macro";
import { useScheduleTweet } from "../utils/tweet";

export const PageInfo = ({ title }) => (
  <Head>
    <title>{title}</title>
    <link rel="icon" href="/favicon.ico" />
  </Head>
);

export const Layout = ({ children }) => (
  <div tw="md:m-auto md:max-w-3xl">
    <section tw="p-3 overflow-hidden m-auto">{children}</section>
  </div>
);

export const ProfileInfo = ({ userData }) => (
  <div tw="mt-4">
    <div tw="sm:grid sm:grid-cols-3 sm:grid-flow-col sm:gap-1">
      <img
        id="profile-picture"
        src={userData.profileImage}
        alt="Twitter Profile Picture"
      />
      <div tw="sm:py-2 sm:col-span-2">
        <h1 tw="my-1">{userData.name}</h1>
        <h2 tw="my-1">@{userData.screenName}</h2>
        <p tw="mt-4">{userData.description}</p>
      </div>
    </div>
  </div>
);

export const TweetForm = () => {
  const { register, getValues } = useForm();
  const scheduleTweet = useScheduleTweet();

  const handleSubmit = (e) => {
    e.preventDefault();
    scheduleTweet.mutate(getValues());
  };

  return (
    <form onSubmit={handleSubmit} tw="mt-4">
      <label for="body" tw="hidden">
        Tweet Content
      </label>
      <textarea
        tw="w-full p-3"
        name="body"
        rows="6"
        placeholder="What's happening?"
        ref={register({ required: true })}
      ></textarea>
      <div tw="flex flex-row mt-4">
        <div>
          <label for="tweet-date"> Date </label>
          <input
            type="date"
            id="tweet-date"
            name="tweetDate"
            ref={register({ required: true })}
          />
        </div>
        <div tw="mx-4">
          <label for="tweet-time my-1"> Time </label>
          <input
            type="time"
            id="tweet-time"
            name="tweetTime"
            ref={register({ required: true })}
          />
        </div>
      </div>
      <div tw="mt-7 float-right">
        <input type="submit" value="Schedule Tweet" className="btn" />
      </div>
    </form>
  );
};
