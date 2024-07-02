import MongoClient from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.DB_HOST ? process.env.DB_HOST : 'localhost';
const port = process.env.DB_PORT ? process.env.DB_PORT : 27017;
const database = process.env.DB_DATABASE
  ? process.env.DB_DATABASE
  : 'files_manager';
const url = `mongodb://${host}:${port}/${database}`;

class DBClient {
  constructor() {
    this.db = null;
    this.connect();
  }

  async connect() {
    try {
      const client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      this.db = client.db(database);
      // console.log('Connected to database');
      // test insertion into db
      // const users = this.db.collection('users');
      // await users.insertOne({ email: 'oumalkhair@holbertonschool' });
    } catch (error) {
      console.error('Could not connect to database', error);
    }
  }

  isAlive() {
    return !!this.db;
  }

  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();

export default dbClient;
