import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class IpRequest {
  @Prop()
  ip: string;

  @Prop()
  timestamp: Date;
}

export type IpRequestDocument = HydratedDocument<IpRequest>;

export const ipRequestSchema = SchemaFactory.createForClass(IpRequest);
