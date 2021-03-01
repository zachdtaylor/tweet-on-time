import { ObjectID } from "mongodb";
import { connectToDB } from "../../../utils/db";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;
  const db = await connectToDB();
  await sleep(1000);
  switch (method) {
    case "DELETE":
      await db.collection("tweets").deleteOne({ _id: ObjectID(id) });
      return res
        .status(200)
        .json({ message: `successfully deleted tweet ${id}` });
    default:
      return res.status(200).json({ message: "nothing to see here" });
  }
}
