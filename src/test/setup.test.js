process.env.NODE_ENV = 'test';
logger.debug('Starting test setup');
import ExampleModel from '../models/exampleModel.js';

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer;

export const connect = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};

export const close = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
};

export const clear = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
};

//clean up the database before and after each test
beforeEach(async () => {
  await ExampleModel.deleteMany({});
});

afterEach(async () => {
  await ExampleModel.deleteMany({});
});
