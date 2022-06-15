import * as JoiLibrary from "joi";
import * as JoiDate from "@hapi/joi-date";
import { profileSchema } from "../../../common/request/schema/profile.schema";

const Joi = JoiLibrary.extend(JoiDate);

export const extendedProfileSchema = {
  name: profileSchema.name.optional(),
  surname: profileSchema.surname.optional(),
  prefix: profileSchema.prefix,
  location: Joi.string().max(200),
  timezone: Joi.string().optional().allow('').max(200),
  phone: profileSchema.phone,
  email: Joi.string().email(),
  address: Joi.string().max(200),
  dateOfBirth: Joi.date().format("DD/MM/YYYY").max("now"),
  primaryPhysician: Joi.string(),
  primaryPhysicianAddress: Joi.string(),
  seriousMedicalIssues: Joi.boolean(),
  mostRecentDiagnosis: Joi.string().allow("", null),
  lastHospitalVisit: Joi.date().format("DD/MM/YYYY").allow(null).max("now"),
  allowNotifications: Joi.boolean(),
  tipsAndTricks: Joi.boolean(),
  emergencyEmailAndSms: Joi.boolean(),
  locationAccess: Joi.boolean(),
  uploadedDocumentsAccess: Joi.boolean(),
  readManual: Joi.boolean(),
  automatedEmergency: Joi.boolean(),
  emergencyMessage: Joi.string().min(10).max(1000),
  regularPushNotification: Joi.boolean(),
  frequencyOfRegularNotification: Joi.number().min(6).max(2880),
  positiveInfoPeriod: Joi.number().min(6).max(2880),
  pulseBasedTriggerIOSHealthPermissions: Joi.boolean(),
  pulseBasedTriggerIOSAppleWatchPaired: Joi.boolean(),
  pulseBasedTriggerGoogleFitAuthenticated: Joi.boolean(),
  pulseBasedTriggerConnectedToGoogleFit: Joi.boolean(),
  pulseBasedTriggerBackgroundModesEnabled: Joi.boolean(),
};
