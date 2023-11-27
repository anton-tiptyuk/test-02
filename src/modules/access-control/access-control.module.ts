import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';

import { DATABASE_CONNECTION } from '../db/db-providers';
import { DbModule } from '../db/db.module';

import { TOKEN_MODEL, tokenSchema } from './token/token.schema';
import { TokenService } from './token/token.service';

import {
  TOKEN_REQUEST_MODEL,
  tokenRequestSchema,
} from './token-request/token-request.schema';
import { TokenRequestService } from './token-request/token-request.service';

import {
  IP_REQUEST_MODEL,
  ipRequestSchema,
} from './ip-request/ip-request.schema';
import { IpRequestService } from './ip-request/ip-request.service';

@Module({
  imports: [DbModule],
  providers: [
    {
      provide: TOKEN_MODEL,
      useFactory: (connection: Connection) =>
        connection.model('Token', tokenSchema),
      inject: [DATABASE_CONNECTION],
    },
    TokenService,
    {
      provide: TOKEN_REQUEST_MODEL,
      useFactory: (connection: Connection) =>
        connection.model('TokenRequest', tokenRequestSchema),
      inject: [DATABASE_CONNECTION],
    },
    TokenRequestService,
    {
      provide: IP_REQUEST_MODEL,
      useFactory: (connection: Connection) =>
        connection.model('IpRequest', ipRequestSchema),
      inject: [DATABASE_CONNECTION],
    },
    IpRequestService,
  ],
})
export class AccessControlModule {}
