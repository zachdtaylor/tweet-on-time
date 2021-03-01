import { ObjectID } from "mongodb";
import schedule from "node-schedule";
import { connectToDB } from "../../../utils/db";
import { twitterClient } from "../../../utils/twitter-client";

const sendTweet = (body) => {
  return twitterClient
    .post("statuses/update", {
      status: body,
    })
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
};

const scheduleTweet = async (db, tweet) => {
  const { insertedId } = await db.collection("tweets").insertOne(tweet);
  schedule.scheduleJob(
    new Date(`${tweet.tweetDate} ${tweet.tweetTime}`),
    () => {
      db.collection("tweets").deleteOne({ _id: ObjectID(insertedId) });
      // sendTweet(tweet.body);
    }
  );
};

export default async function handler(req, res) {
  const { body: tweet, method } = req;
  const db = await connectToDB();
  switch (method) {
    case "POST":
      return scheduleTweet(db, tweet).then(() =>
        res.status(200).json({ message: "scheduled tweet" })
      );
    default:
      const tweets = await db.collection("tweets").find().toArray();
      return res.status(200).json(tweets);
  }
}