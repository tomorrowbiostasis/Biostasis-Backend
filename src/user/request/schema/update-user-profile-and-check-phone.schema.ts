import * as JoiLibrary from 'joi';
import * as JoiDate from '@hapi/joi-date';
import { extendedProfileSchema } from './extended-profile.schema';

const Joi = JoiLibrary.extend(JoiDate);

export const updateUserProfileAndCheckPhoneSchema: JoiLibrary.ObjectSchema =
  JoiLibrary.object({
    ...extendedProfileSchema,
    countryCode: Joi.string(),
  })
    .and('prefix', 'phone', 'countryCode')
    .options({
      presence: 'optional',
    });
