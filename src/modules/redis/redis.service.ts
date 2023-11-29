import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

import { config } from '@/common';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly redis: Redis;

  constructor() {
    const { url, keyPrefix } = config.redisOptions;

    this.redis = new Redis(url, { keyPrefix });
    this.redis.on('error', (err) => this.logger.error(err.message, err));
    this.redis.defineCommand('myecho', {
      numberOfKeys: 2,
      lua: 'return {KEYS[1],KEYS[2],ARGV[1],ARGV[2]}',
    });
  }

  async try01() {
    // keys are first; then arbitrary number of args.
    const x = await this.redis['myecho']('k1', 'k2', 'a1', 'a2');
    console.log(x);
  }
}
