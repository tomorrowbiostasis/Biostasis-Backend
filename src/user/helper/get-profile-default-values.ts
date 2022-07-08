import { ProfileEntity } from '../../user/entity/profile.entity';

export const getProfileDefaultValues = (
  profile: ProfileEntity
): Record<string, unknown> => ({
  allowNotifications: profile?.allowNotifications !== false,
  tipsAndTricks: profile?.tipsAndTricks !== false,
  emergencyEmailAndSms: profile?.emergencyEmailAndSms !== false,
  uploadedDocumentsAccess: profile?.uploadedDocumentsAccess !== false,
  locationAccess: !!profile?.locationAccess,
  readManual: !!profile?.readManual,
  automatedEmergency: !!profile?.automatedEmergency,
  regularPushNotification: !!profile?.regularPushNotification,
  pulseBasedTriggerIOSHealthPermissions:
    !!profile?.pulseBasedTriggerIOSHealthPermissions,
  pulseBasedTriggerIOSAppleWatchPaired:
    !!profile?.pulseBasedTriggerIOSAppleWatchPaired,
  pulseBasedTriggerGoogleFitAuthenticated:
    !!profile?.pulseBasedTriggerGoogleFitAuthenticated,
  pulseBasedTriggerConnectedToGoogleFit:
    !!profile?.pulseBasedTriggerConnectedToGoogleFit,
  pulseBasedTriggerBackgroundModesEnabled:
    !!profile?.pulseBasedTriggerBackgroundModesEnabled,
});
