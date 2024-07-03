import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export const getStatus = (req, res) => {
  const db = dbClient.isAlive;
  const redis = redisClient.isAlive;

  if (db === 'true' && redis === 'true') {
    res.status(200).json({ redis: true, db: true });
  }
};

export const getStats = (req, res) => {
  res.status(200).json({
    users: dbClient.nbUsers,
    files: dbClient.nbFiles,
  });
};
