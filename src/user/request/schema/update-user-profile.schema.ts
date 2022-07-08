import * as JoiLibrary from 'joi';
import * as JoiDate from '@hapi/joi-date';
import { extendedProfileSchema } from './extended-profile.schema';

const Joi = JoiLibrary.extend(JoiDate);

export const updateUserProfileSchema: JoiLibrary.ObjectSchema =
  JoiLibrary.object({
    ...extendedProfileSchema,
  })
    .and('prefix', 'phone')
    .options({
      presence: 'optional',
    });
