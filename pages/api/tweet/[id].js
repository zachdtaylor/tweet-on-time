import { ObjectID } from "mongodb";
import { connectToDB } from "../../../utils/db";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;
  const db = await connectToDB();
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
