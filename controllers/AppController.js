import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export const getStatus = (req, res) => {
  try {
    const db = dbClient.isAlive();
    const redis = redisClient.isAlive();

    return res.status(200).json({ redis, db });
  } catch (err) {
    console.log(err);
    return res.status(500).json('server error');
  }
};

export const getStats = (req, res) => {
  try {
    const users = dbClient.nbUsers();
    const files = dbClient.nbFiles();

    return res.status(200).json({ users, files });
  } catch (err) {
    console.log(err);
    return res.status(500).json('server error');
  }
};
