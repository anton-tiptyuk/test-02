import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as crypto from 'crypto';
import * as fs from 'fs';

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

  createDraftSeeds() {
    const x = Array(10)
      .fill(undefined)
      .map(
        (_, idx): Token => ({
          token: crypto.createHash('sha1').update(`token${idx}`).digest('hex'),
          expiresAt: new Date(),
        }),
      );

    fs.writeFileSync('token-seeds.json', JSON.stringify(x, undefined, 2));
  }
}
