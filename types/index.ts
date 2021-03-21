export interface Tweet {
  _id: string;
  body: string;
  tweetDate: string;
  tweetTime: string;
  thread: Tweet[] | undefined;
}
