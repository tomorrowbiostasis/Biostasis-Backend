import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserProfileDTO {
  @ApiProperty({ type: String, maxLength: 100, required: false })
  name: string;

  @ApiProperty({ type: String, maxLength: 100, required: false })
  surname: string;

  @ApiProperty({ type: String, maxLength: 320, required: false })
  email: string;

  @ApiProperty({ type: Number, maxLength: 3, required: false })
  prefix: number;

  @ApiProperty({ type: String, required: false })
  location?: string;

  @ApiProperty({ type: String, required: false })
  timezone?: string;

  @ApiProperty({
    type: String,
    maxLength: 12,
    required: false,
    example: "123456789",
  })
  phone: string;

  @ApiProperty({ type: String, maxLength: 200, required: false })
  address: string;

  @ApiProperty({ type: String, required: false, example: "12/08/1986" })
  dateOfBirth: string;

  @ApiProperty({ type: String, maxLength: 200, required: false })
  primaryPhysician: string;

  @ApiProperty({ type: String, maxLength: 200, required: false })
  primaryPhysicianAddress: string;

  @ApiProperty({ type: Boolean, required: false })
  seriousMedicalIssues: boolean;

  @ApiProperty({ type: String, maxLength: 300, required: false })
  mostRecentDiagnosis: string;

  @ApiProperty({ type: String, required: false, example: "12/08/1986" })
  lastHospitalVisit: string;

  @ApiProperty({ type: Boolean, required: false })
  allowNotifications: boolean;

  @ApiProperty({ type: Boolean, required: false })
  tipsAndTricks: boolean;

  @ApiProperty({ type: Boolean, required: false })
  emergencyEmailAndSms: boolean;

  @ApiProperty({ type: Boolean, required: false })
  locationAccess: boolean;

  @ApiProperty({ type: Boolean, required: false })
  uploadedDocumentsAccess: boolean;

  @ApiProperty({ type: Boolean, required: false })
  readManual: boolean;

  @ApiProperty({ type: Boolean, required: false })
  automatedEmergency: boolean;

  @ApiProperty({ type: String, maxLength: 1000, required: false })
  emergencyMessage: string;

  @ApiProperty({ type: Boolean, required: false })
  regularPushNotification: boolean;

  @ApiProperty({ type: Number, required: false })
  frequencyOfRegularNotification: number;

  @ApiProperty({ type: Number, required: false })
  positiveInfoPeriod: number;

  @ApiProperty({ type: Boolean, required: false })
  pulseBasedTriggerIOSHealthPermissions: boolean;

  @ApiProperty({ type: Boolean, required: false })
  pulseBasedTriggerIOSAppleWatchPaired: boolean;

  @ApiProperty({ type: Boolean, required: false })
  pulseBasedTriggerGoogleFitAuthenticated: boolean;

  @ApiProperty({ type: Boolean, required: false })
  pulseBasedTriggerConnectedToGoogleFit: boolean;

  @ApiProperty({ type: Boolean, required: false })
  pulseBasedTriggerBackgroundModesEnabled: boolean;
}
