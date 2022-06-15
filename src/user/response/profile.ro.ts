import {
  Exclude,
  Expose,
  Transform,
  TransformFnParams,
} from "class-transformer";
import * as moment from "moment";
import { ApiProperty } from "@nestjs/swagger";

@Exclude()
export class ProfileRO {
  @Expose()
  @ApiProperty({ type: String })
  userId: string;

  @Expose()
  @Transform(({ value }: TransformFnParams) => value ?? null)
  @ApiProperty({ type: String })
  address?: string;

  @Expose()
  @Transform(({ value }: TransformFnParams) => value ?? null)
  @ApiProperty({ type: String })
  name?: string;

  @Expose()
  @Transform(({ value }: TransformFnParams) => value ?? null)
  @ApiProperty({ type: String })
  surname?: string;

  @Expose()
  @Transform(({ value }: TransformFnParams) => value ?? null)
  @ApiProperty({ type: String })
  phone?: string;

  @Expose()
  @Transform(({ value }: TransformFnParams) =>
    value !== undefined ? Number(value) : null
  )
  @ApiProperty({ type: Number })
  prefix?: number;

  @Expose()
  @Transform(({ value }: TransformFnParams) =>
    value ? moment(value).format("DD/MM/YYYY") : null
  )
  @ApiProperty({ type: String })
  dateOfBirth?: string;

  @Expose()
  @Transform(({ value }: TransformFnParams) => value ?? null)
  @ApiProperty({ type: String })
  primaryPhysician: string;

  @Expose()
  @Transform(({ value }: TransformFnParams) => value ?? null)
  @ApiProperty({ type: String })
  primaryPhysicianAddress: string;

  @Expose()
  @Transform(({ value }: TransformFnParams) => value ?? null)
  @ApiProperty({ type: String })
  deviceId: string;

  @Expose()
  @Transform(({ value }: TransformFnParams) =>
    value !== undefined ? value : null
  )
  @ApiProperty({ type: Boolean })
  seriousMedicalIssues: boolean;

  @Expose()
  @Transform(({ value }: TransformFnParams) => value ?? null)
  @ApiProperty({ type: String })
  mostRecentDiagnosis: string;

  @Expose()
  @Transform(({ value }: TransformFnParams) =>
    value ? moment(value).format("DD/MM/YYYY") : null
  )
  @ApiProperty({ type: String })
  lastHospitalVisit: string;

  @Expose()
  @ApiProperty({ type: Boolean })
  allowNotifications: boolean;

  @Expose()
  @ApiProperty({ type: Boolean })
  tipsAndTricks: boolean;

  @Expose()
  @ApiProperty({ type: Boolean })
  emergencyEmailAndSms: boolean;

  @Expose()
  @ApiProperty({ type: Boolean })
  locationAccess: boolean;

  @Expose()
  @ApiProperty({ type: Boolean })
  uploadedDocumentsAccess: boolean;

  @Expose()
  @Transform(({ value }: TransformFnParams) => value ?? null)
  @ApiProperty({ type: String })
  emergencyMessage: string;

  @Expose()
  @ApiProperty({ type: Boolean })
  readManual: boolean;

  @Expose()
  @ApiProperty({ type: Boolean })
  automatedEmergency: boolean;

  @Expose()
  @ApiProperty({ type: Boolean })
  regularPushNotification: boolean;

  @Expose()
  @ApiProperty({ type: Number })
  frequencyOfRegularNotification: number;

  @Expose()
  @ApiProperty({ type: Number })
  positiveInfoPeriod: number;

  @Expose()
  @ApiProperty({ type: String })
  location: string;

  @Expose()
  @ApiProperty({ type: String })
  timezone: string;

  @Expose()
  @ApiProperty({ type: Boolean })
  pulseBasedTriggerIOSHealthPermissions: boolean;

  @Expose()
  @ApiProperty({ type: Boolean })
  pulseBasedTriggerIOSAppleWatchPaired: boolean;

  @Expose()
  @ApiProperty({ type: Boolean })
  pulseBasedTriggerGoogleFitAuthenticated: boolean;

  @Expose()
  @ApiProperty({ type: Boolean })
  pulseBasedTriggerConnectedToGoogleFit: boolean;

  @Expose()
  @ApiProperty({ type: Boolean })
  pulseBasedTriggerBackgroundModesEnabled: boolean;

  @Expose()
  @ApiProperty({ type: String })
  createdAt: string;

  @Expose()
  @ApiProperty({ type: String })
  updatedAt: string;
}
