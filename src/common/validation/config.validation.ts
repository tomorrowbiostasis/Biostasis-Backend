import * as Joi from 'joi';

export const configSchema: Joi.ObjectSchema = Joi.object({
  APP_PORT: Joi.number(),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'stage', 'test')
    .default('development'),
  DB_USERNAME: Joi.string(),
  DB_DATABASE: Joi.string(),
  DB_PASSWORD: Joi.string(),
  DB_HOST: Joi.string(),
  DB_PORT: Joi.number().default(3306),
  GLOBAL_PREFIX: Joi.string(),
}).options({ allowUnknown: true, presence: 'required' });
