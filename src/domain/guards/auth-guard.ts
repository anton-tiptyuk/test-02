import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import {
  ACCESS_CONTROL_PROVIDER,
  AccessControlProvider,
} from '../access-control';

const bearerTokenRegExp = /Bearer\s+(.*)/;

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(ACCESS_CONTROL_PROVIDER)
    private readonly accessControlProvider: AccessControlProvider,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    const authorization = request.header('authorization') || '';

    const match = authorization.match(bearerTokenRegExp);

    if (!match) {
      throw new UnauthorizedException('auth header not recognized');
    }

    const token = match[1];

    if (await this.accessControlProvider.validateToken(token)) {
      request['token'] = token;
      return true;
    }

    throw new UnauthorizedException();
  }
}
