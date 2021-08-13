import * as JoiLibrary from 'joi';
import * as JoiDate from '@hapi/joi-date';
import { profileSchema } from '../../../common/request/schema/profile.schema';

const Joi = JoiLibrary.extend(JoiDate);

export const extendedProfileSchema = {
  name: profileSchema.name.optional(),
  surname: profileSchema.surname.optional(),
  prefix: profileSchema.prefix,
  phone: profileSchema.phone,
  email: Joi.string().email(),
  address: Joi.string().max(200),
  dateOfBirth: Joi.date().format('DD/MM/YYYY'),
  primaryPhysician: Joi.string(),
  primaryPhysicianAddress: Joi.string(),
  seriousMedicalIssues: Joi.boolean(),
  mostRecentDiagnosis: Joi.string(),
  lastHospitalVisit: Joi.date().format('DD/MM/YYYY'),
  allowNotifications: Joi.boolean(),
  tipsAndTricks: Joi.boolean(),
  emergencyEmailAndSms: Joi.boolean(),
  automatedVoiceCall: Joi.boolean(),
  locationAccess: Joi.boolean(),
  uploadedDocumentsAccess: Joi.boolean(),
  readManual: Joi.boolean(),
  automatedEmergency: Joi.boolean(),
  emergencyMessage: Joi.string().min(10).max(1000),
};
