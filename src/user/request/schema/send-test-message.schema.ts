import * as Joi from 'joi';

export const sendTestMessageSchema: Joi.ObjectSchema = Joi.object({
  latitude: Joi.number(),
  longitude: Joi.number(),
  accuracy: Joi.number(),
  locationUrl: Joi.string(),
})
  .and('latitude', 'longitude', 'accuracy', 'locationUrl')
  .options({
    presence: 'optional',
  });
