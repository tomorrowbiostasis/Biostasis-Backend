import * as Joi from 'joi';

export const updateUserDeviceIdSchema: Joi.ObjectSchema = Joi.object({
  deviceId: Joi.string().max(200).allow(null).required(),
});
