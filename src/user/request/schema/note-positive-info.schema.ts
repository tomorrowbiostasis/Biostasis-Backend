import * as Joi from 'joi';

export const notePositiveInfoSchema: Joi.ObjectSchema = Joi.object({
  minutesToNext: Joi.number().min(10).max(720),
  locationUrl: Joi.string().max(200),
}).options({
  presence: 'optional',
});
