import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TokenRequest } from './token-request.schema';

@Injectable()
export class TokenRequestService {
  constructor(
    @InjectModel(TokenRequest.name)
    private readonly model: Model<TokenRequest>,
  ) {}
}
