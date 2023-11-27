import * as mongoose from 'mongoose';

export const IP_REQUEST_MODEL = 'TOKEN_REQUEST_MODEL';

export const ipRequestSchema = new mongoose.Schema({
  ip: String,
  timestamp: Date,
});
