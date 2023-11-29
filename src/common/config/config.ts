import {
  // WEB
  WEB_PORT,

  // DB
  REDIS_URL,
  REDIS_KEY_PREFIX,
  MONGO_URL,
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

  get mongoUrl() {
    return this.getValue(MONGO_URL);
  }
}
