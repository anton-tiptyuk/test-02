import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

import { config } from '@/common';

import { luaTry01 } from './lua-try-01';
import { luaTry02 } from './lua-try-02';
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
    this.redis.defineCommand('try01', {
      numberOfKeys: 2,
      lua: 'return {KEYS[1],KEYS[2],ARGV[1],ARGV[2]}',
    });
    this.redis.defineCommand('luaTry01', {
      numberOfKeys: 0,
      lua: luaTry01,
    });
    this.redis.defineCommand('luaTry02', {
      numberOfKeys: 1,
      lua: luaTry02,
    });
    this.redis.defineCommand(luaRateLimitCmd, {
      numberOfKeys: 1,
      lua: luaRateLimit,
    });
  }

  async try01() {
    // keys are first; then arbitrary number of args.
    const x = await this.redis['try01']('k1', 'k2', 'a1', 'a2');
    console.log(x);
  }

  luaTry01() {
    return this.redis['luaTry01']();
  }

  luaTry02() {
    // return this.redis['luaTry02']('yoppa', 4, 20, 6);
    return this.redis['luaTry02']('yoppa', 60 * 60, 200, 6);

    // if [0] = 1
    // - return * 1000
    // new Date(return[1] * 1000)
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
