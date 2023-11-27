import {
  // WEB
  WEB_PORT,

  // DB
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

  get mongoUrl() {
    return this.getValue(MONGO_URL);
  }
}
