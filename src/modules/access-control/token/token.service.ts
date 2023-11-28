import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Token } from './token.schema';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name)
    private readonly model: Model<Token>,
  ) {}

  clear() {
    return this.model.deleteMany();
  }

  findByToken(token: string) {
    return this.model.findOne<Token>({ token }).exec();
  }
}
