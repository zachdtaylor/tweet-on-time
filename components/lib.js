import Head from "next/head";
import tw from "twin.macro";
import { FaSpinner } from "react-icons/fa";

export const Spinner = () => <FaSpinner tw="animate-spin" />;

const Button = tw.button`font-bold transition duration-200 focus:outline-none`;

export const TwitterButton = tw(
  Button
)`bg-twitterblue text-white py-3 px-8 rounded-3xl hover:bg-twitterblue-light`;

export const DeleteButton = tw(
  Button
)`rounded-md bg-red-600 px-4 py-2 hover:bg-red-700`;

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
        <h1 tw="text-2xl my-1">{userData.name}</h1>
        <h2 tw="my-1">@{userData.screenName}</h2>
        <p tw="mt-4">{userData.description}</p>
      </div>
    </div>
  </div>
);

export const redBorder = tw`border-solid border border-red-600`;
