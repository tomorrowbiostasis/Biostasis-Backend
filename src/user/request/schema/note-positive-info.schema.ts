import * as Joi from 'joi';

export const notePositiveInfoSchema: Joi.ObjectSchema = Joi.object({
  minutesToNext: Joi.number().min(90).max(1000).required(),
});
