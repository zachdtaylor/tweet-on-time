import { twitterClient } from "../utils/twitter-client";
import { TweetForm } from "../components/tweet-form";
import { Layout, PageInfo, ProfileInfo } from "../components/lib";
import { ScheduledTweets } from "../components/scheduled-tweets";

export default function Home({ userData }) {
  return (
    <Layout>
      <PageInfo title="Tweet on Time" />
      <ProfileInfo userData={userData} />
      <TweetForm />
      <ScheduledTweets />
    </Layout>
  );
}

export async function getServerSideProps() {
  const result = await twitterClient.get("account/verify_credentials");
  return {
    props: {
      userData: {
        name: result.name,
        screenName: result.screen_name,
        profileImage: result.profile_image_url_https.replace(
          "normal",
          "400x400"
        ),
        description: result.description,
      },
    },
  };
}
