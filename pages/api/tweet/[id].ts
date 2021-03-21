import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectID } from 'mongodb';
import { connectToDB } from '../../../utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;
  const db = await connectToDB();
  switch (method) {
    case 'DELETE':
      if (typeof id === 'string') {
        await db.collection('tweets').deleteOne({ _id: new ObjectID(id) });
        return res.status(200).json({ message: `successfully deleted tweet ${id}` });
      }
      return res
        .status(400)
        .json({ message: "'id' parameter must be a single string, not an array" });
    default:
      return res.status(200).json({ message: 'nothing to see here' });
  }
}
