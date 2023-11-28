import { Injectable } from '@nestjs/common';

import { AccessControlProvider } from '@/domain/access-control';

import { IpRequestService } from './ip-request/ip-request.service';
import { TokenService } from './token/token.service';
import { TokenRequestService } from './token-request/token-request.service';

@Injectable()
export class AccessControlService implements AccessControlProvider {
  constructor(
    private readonly ipRequestService: IpRequestService,
    private readonly tokenService: TokenService,
    private readonly tokenRequestService: TokenRequestService,
  ) {}

  async seed() {
    await this.ipRequestService.clear();
    await this.tokenService.clear();
    await this.tokenRequestService.clear();

    await this.tokenService.seed();
  }

  async validateToken(token: string) {
    const found = await this.tokenService.findByToken(token);
    return !!found;
  }
}
