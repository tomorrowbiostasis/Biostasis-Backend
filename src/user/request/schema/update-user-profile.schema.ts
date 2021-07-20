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
    email: Joi.string().email(),
    address: Joi.string().max(200),
    dateOfBirth: Joi.date().format('DD/MM/YYYY'),
    primaryPhisican: Joi.string().allow(null).optional(),
    primaryPhisicanAddress: Joi.string().allow(null).optional(),
    seriousMedicalIssues: Joi.boolean().allow(null).optional(),
    mostRecentDiagnosis: Joi.string().allow(null).optional(),
    lastHospitalVisit: Joi.date().format('DD/MM/YYYY').optional(),
  })
    .and('prefix', 'phone')
    .options({
      presence: 'optional',
    });
