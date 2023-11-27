import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DbModule } from '../db/db.module';

import { Token, tokenSchema } from './token/token.schema';
import {
  TokenRequest,
  tokenRequestSchema,
} from './token-request/token-request.schema';
import { IpRequest, ipRequestSchema } from './ip-request/ip-request.schema';

import { TokenService } from './token/token.service';
import { TokenRequestService } from './token-request/token-request.service';
import { IpRequestService } from './ip-request/ip-request.service';
import { AccessControlService } from './access-control.service';

@Module({
  imports: [
    DbModule,
    MongooseModule.forFeature([
      { name: Token.name, schema: tokenSchema },
      { name: TokenRequest.name, schema: tokenRequestSchema },
      { name: IpRequest.name, schema: ipRequestSchema },
    ]),
  ],
  providers: [
    TokenService,
    TokenRequestService,
    IpRequestService,
    AccessControlService,
  ],
})
export class AccessControlModule {}
