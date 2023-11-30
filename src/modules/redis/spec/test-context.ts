import { redisServiceWrapped } from './redis-service-wrapped';

export const testKey = 'testKey';

export interface HistoricalRequest {
  offsetSeconds: number;
  weight: number;
  qty: number;
}

export const createContext = () => {
  const now = Date.now();
  const nowSeconds = Math.trunc(now / 1000);

  const seedHistoricalRequest = async ({
    offsetSeconds,
    weight,
    qty,
  }: HistoricalRequest) => {
    const pipeline = redisServiceWrapped.redis.pipeline();

    const timeSeconds = nowSeconds - offsetSeconds;

    let q = qty;
    while (q--) {
      let w = weight;
      while (w--) {
        pipeline.zadd(testKey, timeSeconds, `${timeSeconds}-${q}-${w}`);
      }
    }

    await pipeline.exec();
  };

  const seedHistoricalRequests = async (requests: HistoricalRequest[]) => {
    let idx = 0;
    while (idx < requests.length) {
      await seedHistoricalRequest(requests[idx]);
      ++idx;
    }
  };

  return {
    nowSeconds,
    seedHistoricalRequest,
    seedHistoricalRequests,
  };
};
