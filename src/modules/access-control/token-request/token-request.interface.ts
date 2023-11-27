import { Document } from 'mongoose';

export interface TokenRequest extends Document {
  token: string;
  timestamp: Date;
}
