import * as Joi from 'joi';

export const getAccessTokenSchema: Joi.ObjectSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string(),
}).options({
  presence: 'required',
});
