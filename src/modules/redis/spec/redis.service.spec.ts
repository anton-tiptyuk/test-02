import { HistoricalRequest, createContext, testKey } from './test-context';
import { redisServiceWrapped } from './redis-service-wrapped';

const commonSubject = async (
  requests: HistoricalRequest[],
  rangeSeconds: number,
  maxRequests: number,
  weight: number,
) => {
  const ctx = createContext();
  await ctx.seedHistoricalRequests(requests);
  const rateLimitResult = await redisServiceWrapped.luaRateLimit(
    testKey,
    rangeSeconds,
    maxRequests,
    weight,
  );

  return {
    rateLimitResult,
    nowSeconds: ctx.nowSeconds,
  };
};

describe('redis service', () => {
  afterEach(() => redisServiceWrapped.redis.del(testKey));

  afterAll(async () => {
    redisServiceWrapped.redis.disconnect();
  });

  it('can fit 4 points with 10x1 requests limited 50', async () => {
    const result = await commonSubject(
      [{ offsetSeconds: 200, qty: 10, weight: 1 }],
      600,
      50,
      4,
    );

    expect(result.rateLimitResult).toMatchObject({ exceeded: false });
  });

  it('can fit 4 points with 20x2 + 6x1 requests limited 50', async () => {
    const result = await commonSubject(
      [
        { offsetSeconds: 400, qty: 20, weight: 2 },
        { offsetSeconds: 200, qty: 6, weight: 1 },
      ],
      600,
      50,
      4,
    );

    expect(result.rateLimitResult).toMatchObject({ exceeded: false });
  });

  it('can not fit 5 points with 20x2 + 6x1 requests limited 50', async () => {
    const result = await commonSubject(
      [
        { offsetSeconds: 400, qty: 20, weight: 2 },
        { offsetSeconds: 200, qty: 6, weight: 1 },
      ],
      600,
      50,
      5,
    );

    const expectedTryAfter = new Date(
      (result.nowSeconds + 600 - 400 + 1) * 1000,
    );

    expect(result.rateLimitResult).toMatchObject({
      exceeded: true,
      tryAfter: expectedTryAfter,
    });
  });

  describe('9x1x2 requests limited 20', () => {
    const subject = (weight: number) =>
      commonSubject(
        [
          { offsetSeconds: 500, qty: 1, weight: 2 },
          { offsetSeconds: 450, qty: 1, weight: 2 },
          { offsetSeconds: 400, qty: 1, weight: 2 },
          { offsetSeconds: 350, qty: 1, weight: 2 },
          { offsetSeconds: 300, qty: 1, weight: 2 },
          { offsetSeconds: 250, qty: 1, weight: 2 },
          { offsetSeconds: 200, qty: 1, weight: 2 },
          { offsetSeconds: 150, qty: 1, weight: 2 },
          { offsetSeconds: 100, qty: 1, weight: 2 },
        ],
        600,
        20,
        weight,
      );

    it('can fit 2 points', async () => {
      const result = await subject(2);
      expect(result.rateLimitResult).toMatchObject({ exceeded: false });
    });

    it('can not fit 3 points; awaiting last element', async () => {
      const result = await subject(3);

      const expectedTryAfter = new Date(
        (result.nowSeconds + 600 - 500 + 1) * 1000,
      );

      expect(result.rateLimitResult).toMatchObject({
        exceeded: true,
        tryAfter: expectedTryAfter,
      });
    });

    it('can not fit 16 points, awaiting the fifth element', async () => {
      const result = await subject(16);

      const expectedTryAfter = new Date(
        (result.nowSeconds + 600 - 200 + 1) * 1000,
      );

      expect(result.rateLimitResult).toMatchObject({
        exceeded: true,
        tryAfter: expectedTryAfter,
      });
    });

    it('can not fit 19 points, awaiting the first element', async () => {
      const result = await subject(19);

      const expectedTryAfter = new Date(
        (result.nowSeconds + 600 - 100 + 1) * 1000,
      );

      expect(result.rateLimitResult).toMatchObject({
        exceeded: true,
        tryAfter: expectedTryAfter,
      });
    });
  });
});
