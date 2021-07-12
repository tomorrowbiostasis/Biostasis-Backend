import * as Joi from 'joi';
import { contactSchema } from './contact.schema';

export const updateContactSchema: Joi.ObjectSchema = Joi.object({
  name: contactSchema.name.optional(),
  surname: contactSchema.surname.optional(),
  active: contactSchema.active,
  prefix: contactSchema.prefix,
  phone: contactSchema.phone,
  email: contactSchema.email,
})
  .and('prefix', 'phone')
  .options({
    presence: 'optional',
  });
