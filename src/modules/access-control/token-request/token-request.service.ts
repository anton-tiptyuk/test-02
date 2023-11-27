import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';

import { TOKEN_REQUEST_MODEL } from './token-request.schema';
import { TokenRequest } from './token-request.interface';

@Injectable()
export class TokenRequestService {
  constructor(
    @Inject(TOKEN_REQUEST_MODEL)
    private readonly tokenRequestModel: Model<TokenRequest>,
  ) {}
}
