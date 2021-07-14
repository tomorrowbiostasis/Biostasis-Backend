import * as Joi from 'joi';
import { profileSchema } from '../../../common/request/schema/profile.schema';

export const addContactSchema: Joi.ObjectSchema = Joi.object(profileSchema)
  .and('prefix', 'phone')
  .or('phone', 'email')
  .options({
    presence: 'optional',
  });
