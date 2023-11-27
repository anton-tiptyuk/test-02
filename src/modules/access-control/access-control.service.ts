import { Injectable } from '@nestjs/common';

import { IpRequestService } from './ip-request/ip-request.service';
import { TokenService } from './token/token.service';
import { TokenRequestService } from './token-request/token-request.service';

@Injectable()
export class AccessControlService {
  constructor(
    private readonly ipRequestService: IpRequestService,
    private readonly tokenService: TokenService,
    private readonly tokenRequestService: TokenRequestService,
  ) {}

  async seed() {
    //
  }
}
