import { SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_WEIGHT_METADATA_KEY = Symbol(
  'RATE_LIMIT_WEIGHT_METADATA_KEY',
);

export const RateLimitWeight = (weight: number) =>
  SetMetadata(RATE_LIMIT_WEIGHT_METADATA_KEY, weight);
