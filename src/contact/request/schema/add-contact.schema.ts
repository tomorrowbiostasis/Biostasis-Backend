import * as Joi from 'joi';
import { contactSchema } from './contact.schema';

export const addContactSchema: Joi.ObjectSchema = Joi.object(contactSchema)
  .and('prefix', 'phone')
  .or('phone', 'email')
  .options({
    presence: 'optional',
  });
