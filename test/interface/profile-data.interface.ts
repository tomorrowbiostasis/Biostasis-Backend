export interface IProfileData {
  userId: string;
  name?: string;
  surname?: string;
  prefix?: number;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  primaryPhisican?: string;
  primaryPhisicanAddress?: string;
  seriousMedicalIssues?: boolean;
  mostRecentDiagnosis?: string;
  lastHospitalVisit?: Date;
  emergencyEmailAndSms?: boolean;
  locationAccess?: boolean;
}
