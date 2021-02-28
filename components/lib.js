import { useForm } from "react-hook-form";
import Head from "next/head";
import tw from "twin.macro";
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

const redBorder = tw`border-solid border border-red-600`;

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
      <div tw="mt-7 float-right">
        <input type="submit" value="Schedule Tweet" className="btn" />
      </div>
    </form>
  );
};
