import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export const postNew = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });

    const exist = await dbClient.findUser({ email });
    if (exist) {
      return res.status(400).json({ error: 'Already exist' });
    }

    const hash = sha1(password);

    const user = await dbClient.insertUser({ email, password: hash });

    return res
      .status(201)
      .json({ email: user.ops[0].email, id: user.insertedId });
  } catch (err) {
    console.log(err);
    return res.status(500).json('server error');
  }
};

export const getMe = async (req, res) => {
  try {
    const token = req.headers['x-token'];

    const key = `auth_${token}`;
    const _id = await redisClient.get(key);
    if (!_id) return res.status(401).json({ error: 'Unauthorized' });

    const user = await dbClient.findUser({ _id: ObjectId(_id) });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    return res.status(200).json({ id: user._id, email: user.email });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'server error', status: 500 });
  }
};
