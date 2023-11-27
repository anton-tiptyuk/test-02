import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Token {
  @Prop()
  token: string;

  @Prop()
  expiresAt: Date;
}

export type TokenDocument = HydratedDocument<Token>;

export const tokenSchema = SchemaFactory.createForClass(Token);
