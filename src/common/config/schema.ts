import * as Joi from 'joi';

export const DEFAULT_PORT = 3000;

export const WEB_PORT = 'WEB_PORT';

export const REDIS_URL = 'REDIS_URL';
export const REDIS_KEY_PREFIX = 'REDIS_KEY_PREFIX';

export const RATE_LIMIT_RANGE_SECONDS = 'RATE_LIMIT_RANGE_SECONDS';
export const RATE_MAX_REQUESTS_IP = 'RATE_MAX_REQUESTS_IP';
export const RATE_MAX_REQUESTS_TOKEN = 'RATE_MAX_REQUESTS_TOKEN';
// 3600

export const schema = Joi.object().keys({
  // WEB
  [WEB_PORT]: Joi.number().default(DEFAULT_PORT),

  // DB
  [REDIS_URL]: Joi.string().default('redis://localhost:6379'),
  [REDIS_KEY_PREFIX]: Joi.string().default('test02:'),

  // rate limit
  [RATE_LIMIT_RANGE_SECONDS]: Joi.number().default(3600),
  [RATE_MAX_REQUESTS_IP]: Joi.number().default(100),
  [RATE_MAX_REQUESTS_TOKEN]: Joi.number().default(200),
});
