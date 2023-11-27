import { Document } from 'mongoose';

export interface IpRequest extends Document {
  ip: string;
  timestamp: Date;
}
