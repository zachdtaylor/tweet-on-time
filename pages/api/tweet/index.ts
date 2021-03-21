import type { NextApiRequest, NextApiResponse } from 'next';
import type { Db } from 'mongodb';
import { ObjectID } from 'mongodb';
import schedule from 'node-schedule';
import type { Tweet } from '../../../types/index';
import { connectToDB } from '../../../utils/db';
import { twitterClient } from '../../../utils/twitter-client';

const sendTweet = async ({ body, thread }: Tweet) => {
  try {
    const tweet = await twitterClient.post('statuses/update', {
      status: body,
    });
    let lastTweetID: string = tweet.id_str;
    for (const status of thread ?? []) {
      const result = await twitterClient.post('statuses/update', {
        status: status.body,
        in_reply_to_status_id: lastTweetID,
        auto_populate_reply_metadata: true,
      });
      lastTweetID = result.id_str;
    }
  } catch (error) {
    console.log(error);
  }
};

const scheduleTweet = async (db: Db, tweet: Tweet) => {
  const { insertedId } = await db.collection('tweets').insertOne(tweet);
  schedule.scheduleJob(
    new Date(`${tweet.tweetDate} ${tweet.tweetTime}`),
    async () => {
      const tweet: Tweet = await db
        .collection('tweets')
        .findOne({ _id: new ObjectID(insertedId) });
      if (tweet) {
        db.collection('tweets').deleteOne({ _id: new ObjectID(tweet._id) });
        sendTweet(tweet);
      } else {
        console.log(`tweet ${insertedId} not found, not sending tweet`);
      }
    }
  );
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { body: tweet, method } = req;
  const db = await connectToDB();
  switch (method) {
    case 'POST':
      return scheduleTweet(db, tweet).then(() =>
        res.status(200).json({ message: 'scheduled tweet' })
      );
    default:
      const tweets = await db.collection('tweets').find().toArray();
      return res.status(200).json(tweets);
  }
}
