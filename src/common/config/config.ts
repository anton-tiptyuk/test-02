import {
  // WEB
  WEB_PORT,

  // DB
  REDIS_URL,
  REDIS_KEY_PREFIX,

  // rate limit
  RATE_LIMIT_RANGE_SECONDS,
  RATE_MAX_REQUESTS_IP,
  RATE_MAX_REQUESTS_TOKEN,
} from './schema';

export class Config {
  constructor(private readonly envData: Record<string, string>) {}

  protected getValue<T = string>(name: string) {
    return <T>(<unknown>this.envData[name]);
  }

  get webPort() {
    return this.getValue<number>(WEB_PORT);
  }

  get redisOptions() {
    return {
      url: this.getValue(REDIS_URL),
      keyPrefix: this.getValue(REDIS_KEY_PREFIX) || undefined,
    };
  }

  get rateLimit() {
    return {
      rangeSeconds: this.getValue<number>(RATE_LIMIT_RANGE_SECONDS),
      maxRequestsIp: this.getValue<number>(RATE_MAX_REQUESTS_IP),
      maxRequestsToken: this.getValue<number>(RATE_MAX_REQUESTS_TOKEN),
    };
  }
}
