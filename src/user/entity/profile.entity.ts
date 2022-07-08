import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("profile")
export class ProfileEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ name: "user_id", type: "varchar", length: 36 })
  userId: string;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 100 })
  surname: string;

  @Column({ type: "varchar", length: 3 })
  prefix: number;

  @Column({ type: "varchar", length: 12 })
  phone: string;

  @Column({ type: "varchar", length: 200 })
  address: string;

  @Column({ name: "date_of_birth", type: "date" })
  dateOfBirth: Date;

  @Column({ name: "primary_phisican", type: "varchar", length: 100 })
  primaryPhysician: string;

  @Column({ name: "primary_phisican_address", type: "varchar", length: 200 })
  primaryPhysicianAddress: string;

  @Column({ name: "serious_medical_issues", type: "longtext" })
  seriousMedicalIssues: boolean;

  @Column({ name: "most_recent_diagnosis", type: "varchar", length: 300 })
  mostRecentDiagnosis: string;

  @Column({ name: "last_hospital_visit", type: "date" })
  lastHospitalVisit: Date;

  @Column({ name: "allow_notifications", type: "boolean" })
  allowNotifications: boolean;

  @Column({ name: "tips_and_tricks", type: "boolean" })
  tipsAndTricks: boolean;

  @Column({ name: "emergency_email_and_sms", type: "boolean" })
  emergencyEmailAndSms: boolean;

  @Column({ name: "location_access", type: "boolean" })
  locationAccess: boolean;

  @Column({ name: "uploaded_documents_access", type: "boolean" })
  uploadedDocumentsAccess: boolean;

  @Column({ name: "emergency_message", type: "varchar", length: 1000 })
  emergencyMessage: string;

  @Column({ name: "read_manual", type: "boolean" })
  readManual: boolean;

  @Column({ name: "automated_emergency", type: "boolean" })
  automatedEmergency: boolean;

  @Column({ name: "regular_push_notification", type: "boolean" })
  regularPushNotification: boolean;

  @Column({
    name: "pulse_based_trigger_ios_health_permissions",
    type: "boolean",
  })
  pulseBasedTriggerIOSHealthPermissions: boolean;

  @Column({
    name: "pulse_based_trigger_ios_apple_watch_paired",
    type: "boolean",
  })
  pulseBasedTriggerIOSAppleWatchPaired: boolean;

  @Column({
    name: "pulse_based_trigger_google_fit_authenticated",
    type: "boolean",
  })
  pulseBasedTriggerGoogleFitAuthenticated: boolean;

  @Column({
    name: "pulse_based_trigger_connected_to_google_fit",
    type: "boolean",
  })
  pulseBasedTriggerConnectedToGoogleFit: boolean;

  @Column({
    name: "pulse_based_trigger_background_modes_enabled",
    type: "boolean",
  })
  pulseBasedTriggerBackgroundModesEnabled: boolean;

  @Column({ name: "frequency_of_regular_notification", type: "tinyint" })
  frequencyOfRegularNotification: number;

  @Column({ name: "positive_info_period", type: "tinyint" })
  positiveInfoPeriod: number;

  @Column({ type: "varchar", length: 200 })
  location: string;

  @Column({ type: 'varchar', nullable: true })
  timezone?: string;

  @CreateDateColumn({ name: "created_at", type: "datetime" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "datetime" })
  updatedAt: Date;

  @UpdateDateColumn({ name: "regular_notification_time", type: "datetime" })
  regularNotificationTime: Date;

  @JoinColumn({ name: "user_id" })
  @OneToOne(() => UserEntity, (user) => user.profile)
  user: UserEntity;
}
