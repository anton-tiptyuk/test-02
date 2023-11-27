import * as mongoose from 'mongoose';

export const TOKEN_REQUEST_MODEL = 'TOKEN_REQUEST_MODEL';

export const tokenRequestSchema = new mongoose.Schema({
  token: String,
  timestamp: Date,
});
