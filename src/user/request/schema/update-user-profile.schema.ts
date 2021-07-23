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
    primaryPhysician: Joi.string().allow(null),
    primaryPhysicianAddress: Joi.string().allow(null),
    seriousMedicalIssues: Joi.boolean().allow(null),
    mostRecentDiagnosis: Joi.string().allow(null),
    lastHospitalVisit: Joi.date().format('DD/MM/YYYY'),
    allowNotifications: Joi.boolean().allow(null),
    tipsAndTricks: Joi.boolean().allow(null),
    emergencyEmailAndSms: Joi.boolean().allow(null),
    automatedVoiceCall: Joi.boolean().allow(null),
    locationAccess: Joi.boolean().allow(null),
    uploadedDocumentsAccess: Joi.boolean().allow(null),
    emergencyMessage: Joi.string().allow(null).min(10).max(1000),
  })
    .and('prefix', 'phone')
    .options({
      presence: 'optional',
    });
