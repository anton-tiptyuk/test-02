import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Token {
  @Prop({ index: true })
  token: string;
}

export type TokenDocument = HydratedDocument<Token>;

export const tokenSchema = SchemaFactory.createForClass(Token);
