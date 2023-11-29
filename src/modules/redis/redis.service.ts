import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

import { config } from '@/common';

import { luaTry01 } from './lua-try-01';
import { luaTry02 } from './lua-try-02';

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
}
