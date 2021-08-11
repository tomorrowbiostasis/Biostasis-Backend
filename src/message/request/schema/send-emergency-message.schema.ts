import * as Joi from 'joi';

export const sendEmergencyMessageSchema: Joi.ObjectSchema = Joi.object({
  locationUrl: Joi.string(),
}).options({
  presence: 'optional',
});
