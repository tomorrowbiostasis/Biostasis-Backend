import * as Joi from 'joi';
import { profileSchema } from '../../../common/request/schema/profile.schema';

export const updateContactAndCheckPhoneSchema: Joi.ObjectSchema = Joi.object({
  name: profileSchema.name.optional(),
  surname: profileSchema.surname.optional(),
  active: profileSchema.active,
  prefix: profileSchema.prefix,
  phone: profileSchema.phone,
  email: profileSchema.email,
  countryCode: Joi.string(),
})
  .and('prefix', 'phone', 'countryCode')
  .options({
    presence: 'optional',
  });
