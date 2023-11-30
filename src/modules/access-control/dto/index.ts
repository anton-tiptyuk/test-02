import * as Joi from 'joi';

export const seedSchema = Joi.array()
  .items(Joi.string().regex(/\S{40}/))
  .min(1)
  .required();
