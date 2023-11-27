import * as Joi from 'joi';

export const DEFAULT_PORT = 3000;

export const WEB_PORT = 'WEB_PORT';

export const MONGO_URL = 'MONGO_URL';

export const schema = Joi.object().keys({
  // WEB
  [WEB_PORT]: Joi.number().default(DEFAULT_PORT),

  // DB
  [MONGO_URL]: Joi.string().default('mongodb://localhost:27017/test-02'),
});
