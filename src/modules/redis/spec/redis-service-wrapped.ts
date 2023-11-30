import { Redis } from 'ioredis';

import { RateLimitResult } from '@/domain/access-control';

import { RedisService } from '../redis.service';

export const redisServiceWrapped = (() => {
  const service = new RedisService();

  const redis: Redis = service['redis'];

  const luaRateLimit: (
    keyName: string,
    rangeSeconds: number,
    maxRequests: number,
    weight: number,
  ) => Promise<RateLimitResult> = service['luaRateLimit'].bind(service);

  return { service, redis, luaRateLimit };
})();
