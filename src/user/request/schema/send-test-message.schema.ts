import * as Joi from 'joi';

export const sendTestMessageSchema: Joi.ObjectSchema = Joi.object({
  locationUrl: Joi.string(),
}).options({
  presence: 'optional',
});
