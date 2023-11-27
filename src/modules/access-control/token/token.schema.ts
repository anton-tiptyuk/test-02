import * as mongoose from 'mongoose';

export const TOKEN_MODEL = 'TOKEN_MODEL';

export const tokenSchema = new mongoose.Schema({
  token: String,
  expiresAt: Date,
});
