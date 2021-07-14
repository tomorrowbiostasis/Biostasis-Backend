import * as JoiLibrary from 'joi';
import * as JoiDate from '@hapi/joi-date';
import { profileSchema } from '../../../common/request/schema/profile.schema';

const Joi = JoiLibrary.extend(JoiDate);

export const updateUserProfileSchema: JoiLibrary.ObjectSchema =
  JoiLibrary.object({
    name: profileSchema.name.optional(),
    surname: profileSchema.surname.optional(),
    prefix: profileSchema.prefix,
    phone: profileSchema.phone,
    address: Joi.string().max(200),
    dateOfBirth: Joi.date().format('DD/MM/YYYY'),
  })
    .and('prefix', 'phone')
    .options({
      presence: 'optional',
    });
