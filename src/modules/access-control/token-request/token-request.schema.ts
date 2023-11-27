import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class TokenRequest {
  @Prop()
  token: string;

  @Prop()
  timestamp: Date;
}

export type TokenRequestDocument = HydratedDocument<TokenRequest>;

export const tokenRequestSchema = SchemaFactory.createForClass(TokenRequest);
