import * as Joi from 'joi';

export const sendTestEmergencyMessageSchema: Joi.ObjectSchema = Joi.object({
  locationUrl: Joi.string().allow(''),
}).options({
  presence: 'optional',
});
