import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';

import { TooManyRequestsException } from '@/common';

import {
  ACCESS_CONTROL_PROVIDER,
  AccessControlProvider,
} from '../access-control';
import { RATE_LIMIT_WEIGHT_METADATA_KEY } from '../decorators';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(ACCESS_CONTROL_PROVIDER)
    private readonly accessControlProvider: AccessControlProvider,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    const metadataTargets = [context.getHandler(), context.getClass()];

    const weight =
      this.reflector.getAllAndOverride<number>(
        RATE_LIMIT_WEIGHT_METADATA_KEY,
        metadataTargets,
      ) || 1;

    const { ip } = request;
    const token: string = request['token'];

    const isForToken = !!token;

    const { exceeded, tryAfter } = await (isForToken
      ? this.accessControlProvider.validateRateLimitForToken(token, weight)
      : this.accessControlProvider.validateRateLimitForIp(ip, weight));

    // 2do:
    // format date
    if (exceeded) {
      throw new TooManyRequestsException(
        `Rate Limit exceeded. Try after ${tryAfter}`,
      );
    }

    return true;
  }
}
