import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.client.on('error', (error) => {
      console.log(`Redis client not connected to the server: ${error.message}`);
    });
  }

  // verify if the client is connected to the server
  isAlive() {
    return this.client.connected;
  }

  // get the value of a key
  async get(key) {
    const value = await this.getAsync(key);
    return value;
  }

  // set a key with a value and an expiration time
  async set(key, value, duration) {
    this.client.setex(key, duration, value);
  }

  // delete a key
  async del(key) {
    this.client.del(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;
