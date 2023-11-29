import * as Joi from 'joi';

export const DEFAULT_PORT = 3000;

export const WEB_PORT = 'WEB_PORT';

export const REDIS_URL = 'REDIS_URL';
export const REDIS_KEY_PREFIX = 'REDIS_KEY_PREFIX';

export const MONGO_URL = 'MONGO_URL';

export const schema = Joi.object().keys({
  // WEB
  [WEB_PORT]: Joi.number().default(DEFAULT_PORT),

  // DB
  [REDIS_URL]: Joi.string().default('redis://localhost:6379'),
  [REDIS_KEY_PREFIX]: Joi.string().default('test02:'),
  [MONGO_URL]: Joi.string().default('mongodb://localhost:27017/test-02'),
});
