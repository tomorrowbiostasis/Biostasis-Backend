import * as Joi from 'joi';

export const profileSchema = {
  name: Joi.string().max(100).required(),
  surname: Joi.string().max(100).required(),
  active: Joi.boolean().allow(null),
  prefix: Joi.number().min(1).max(999).allow(null),
  phone: Joi.string().allow(null).min(4).max(12).regex(/^\d+$/),
  email: Joi.string()
    .email()
    .max(320)
    .allow(null)
    .when('phone', { is: null, then: Joi.string() }),
};
