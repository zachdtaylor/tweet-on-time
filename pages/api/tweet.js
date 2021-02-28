import schedule from "node-schedule";
import { twitterClient } from "../../utils/twitter-client";

const sendTweet = (tweet) => {
  twitterClient
    .post("statuses/update", {
      status: tweet,
    })
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
};

export default (req, res) => {
  const { body, method } = req;
  switch (method) {
    case "POST":
      sendTweet(body.body);
      schedule.scheduleJob(
        new Date(`${body.tweetDate} ${body.tweetTime}`),
        () => sendTweet(body.body)
      );
      return res.status(200).json({ message: "scheduled tweet" });
    default:
      return res.status(200).json({ name: "John Doe" });
  }
};
