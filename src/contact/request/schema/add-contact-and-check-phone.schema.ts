import * as Joi from 'joi';
import { profileSchema } from '../../../common/request/schema/profile.schema';

export const addContactAndCheckPhoneSchema: Joi.ObjectSchema = Joi.object({
  ...profileSchema,
  countryCode: Joi.string(),
})
  .and('prefix', 'phone', 'countryCode')
  .or('phone', 'email')
  .options({
    presence: 'optional',
  });
