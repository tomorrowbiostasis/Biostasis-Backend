export interface IProfileData {
  userId: string;
  name?: string;
  surname?: string;
  prefix?: number;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  primaryPhysician?: string;
  primaryPhysicianAddress?: string;
  seriousMedicalIssues?: boolean;
  mostRecentDiagnosis?: string;
  lastHospitalVisit?: Date;
  emergencyEmailAndSms?: boolean;
  locationAccess?: boolean;
  location?: string;
  automatedEmergency?: boolean;
  readManual?: boolean;
  emergencyMessage?: string;
  regularPushNotification?: boolean;
  frequencyOfRegularNotification?: number;
  positiveInfoPeriod?: number;
}
