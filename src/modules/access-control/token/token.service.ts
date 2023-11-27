import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';

import { TOKEN_MODEL } from './token.schema';
import { Token } from './token.interface';

@Injectable()
export class TokenService {
  constructor(
    @Inject(TOKEN_MODEL)
    private readonly tokenModel: Model<Token>,
  ) {}

  findByToken(token: string) {
    return this.tokenModel.findOne<Token>({ token }).exec();
  }
}
