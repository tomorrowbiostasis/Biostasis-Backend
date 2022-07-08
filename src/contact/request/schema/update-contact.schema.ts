import * as Joi from 'joi';
import { profileSchema } from '../../../common/request/schema/profile.schema';

export const updateContactSchema: Joi.ObjectSchema = Joi.object({
  name: profileSchema.name.optional(),
  surname: profileSchema.surname.optional(),
  active: profileSchema.active,
  prefix: profileSchema.prefix,
  phone: profileSchema.phone,
  email: profileSchema.email,
})
  .and('prefix', 'phone')
  .options({
    presence: 'optional',
  });
