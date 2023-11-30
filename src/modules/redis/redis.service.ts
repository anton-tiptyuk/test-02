import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

import { config } from '@/common';

import { luaRateLimit } from './lua-rate-limit';

const luaRateLimitCmd = 'luaRateLimit';

const tokenKey = 'token';
const ipRateBaseKey = 'ipRate';
const tokenRateBaseKey = 'tokenRate';

const getIpKey = (ip: string) => `${ipRateBaseKey}:${ip.replaceAll('.', '_')}`;
const getTokenKey = (token: string) => `${tokenRateBaseKey}:${token}`;

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly redis: Redis;

  constructor() {
    const { url, keyPrefix } = config.redisOptions;

    this.redis = new Redis(url, { keyPrefix });
    this.redis.on('error', (err) => this.logger.error(err.message, err));
    this.redis.defineCommand(luaRateLimitCmd, {
      numberOfKeys: 1,
      lua: luaRateLimit,
    });
  }

  private async cleanup() {
    await this.redis.del(tokenKey);

    const ipKeys = await this.redis.keys(`${ipRateBaseKey}:*`);
    if (ipKeys.length) {
      await this.redis.del(ipKeys);
    }
    const tokenKeys = await this.redis.keys(`${tokenRateBaseKey}:*`);
    if (tokenKeys.length) {
      await this.redis.del(tokenKeys);
    }
  }

  async seed(tokens: string[]) {
    await this.cleanup();
    tokens.length && (await this.redis.sadd(tokenKey, ...tokens));
  }

  private async luaRateLimit(
    keyName: string,
    rangeSeconds: number,
    maxRequests: number,
    weight: number,
  ) {
    const [isFine, allowedRequestSeconds]: [number, number] = await this.redis[
      luaRateLimitCmd
    ](keyName, rangeSeconds, maxRequests, weight);

    return {
      exceeded: !isFine,
      tryAfter: allowedRequestSeconds
        ? new Date(allowedRequestSeconds * 1000)
        : undefined,
    };
  }

  checkRequestForIp(ip: string, weight: number) {
    const { rangeSeconds, maxRequestsIp } = config.rateLimit;
    return this.luaRateLimit(getIpKey(ip), rangeSeconds, maxRequestsIp, weight);
  }

  checkRequestForToken(token: string, weight: number) {
    const { rangeSeconds, maxRequestsToken } = config.rateLimit;
    return this.luaRateLimit(
      getTokenKey(token),
      rangeSeconds,
      maxRequestsToken,
      weight,
    );
  }

  async validateToken(token: string) {
    const found = await this.redis.sismember(tokenKey, token);
    return !!found;
  }
}
