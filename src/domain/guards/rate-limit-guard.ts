import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';

import { TooManyRequestsException, config } from '@/common';

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

    const ip =
      (request.headers['x-forwarded-for'] || [])[0] ||
      request.socket.remoteAddress;

    const token: string = request['token'];

    const isForToken = !!token;

    const { exceeded, tryAfter } = await (isForToken
      ? this.accessControlProvider.validateRateLimitForToken(token, weight)
      : this.accessControlProvider.validateRateLimitForIp(ip, weight));

    if (exceeded) {
      const { rangeSeconds, maxRequestsIp, maxRequestsToken } =
        config.rateLimit;

      const limitationLemma = `${
        isForToken ? maxRequestsToken : maxRequestsIp
      } request points per ${Math.trunc(rangeSeconds / 60)} minutes`;

      throw new TooManyRequestsException(
        `Rate Limit (${limitationLemma}) exceeded. This request costs ${weight} points. Try after ${tryAfter.toISOString()}`,
      );
    }

    return true;
  }
}
