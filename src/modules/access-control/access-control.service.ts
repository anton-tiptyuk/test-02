import { Injectable } from '@nestjs/common';

import {
  AccessControlProvider,
  RateLimitResult,
} from '@/domain/access-control';

import { RedisService } from '../redis/redis.service';

@Injectable()
export class AccessControlService implements AccessControlProvider {
  constructor(private readonly redisService: RedisService) {}
  seed(tokens: string[]) {
    return this.redisService.seed(tokens);
  }

  validateToken(token: string) {
    return this.redisService.validateToken(token);
  }

  validateRateLimitForIp(ip: string, weight: number): Promise<RateLimitResult> {
    return this.redisService.checkRequestForIp(ip, weight);
  }

  validateRateLimitForToken(
    token: string,
    weight: number,
  ): Promise<RateLimitResult> {
    return this.redisService.checkRequestForToken(token, weight);
  }
}
