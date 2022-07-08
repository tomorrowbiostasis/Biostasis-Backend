require('dotenv').config();

import database from './typeorm';

const env = process.env;

let firebaseAccountKey = {};

try {
  firebaseAccountKey = JSON.parse(env.FIREBASE_ACCOUNT_KEY);
} catch { }

export default () => ({
  application: {
    call_timeout: 30,
    port: env.APP_PORT || 5000,
    global_prefix: env.GLOBAL_PREFIX || 'v1',
    encryptionKey: env.ENCRYPTION_KEY,
    encryptionIv: env.ENCRYPTION_IV
  },
  authorization: {
    accessKeyId: process.env.COGNITO_ACCESS_KEY_ID,
    secretAccessKey: process.env.COGNITO_SECRET_ACCESS_KEY,
    clientId: env.COGNITO_CLIENT_ID,
    region: env.COGNITO_REGION,
    userPoolId: env.COGNITO_USER_POOL_ID,
    jwks: `https://cognito-idp.${env.COGNITO_REGION}.amazonaws.com/${env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
  },
  mailJet: {
    apiKey: env.MAILJET_API_KEY || '',
    apiSecret: env.MAILJET_API_SECRET || '',
    email: env.MAILJET_EMAIL || '',
    username: env.MAILJET_USERNAME || '',
  },
  twilio: {
    accountSid: env.TWILIO_ACCOUNT_SID || '',
    authToken: env.TWILIO_AUTH_TOKEN || '',
    phoneNumber: env.TWILIO_PHONE_NUMBER || '',
  },
  redis: {
    connectionName: 'REDIS',
    host: env.REDIS_HOST || '',
    schema: env.REDIS_SCHEMA || 'redis',
    user: env.REDIS_USER || 'redis',
    port: env.REDIS_PORT || '',
    password: env.REDIS_PASSWORD || '',
    disableTls: parseInt(env.REDIS_DISABLE_TLS) == 1,
    db: 0,
  },
  queue: {
    numberOfAttempts: 3,
    sendAfterTime: {
      repeatTryingToSendMessage: 60000, // milliseconds
      noConnectionToWatch: 300000, // milliseconds
      heartRateInvalid: 300000, // milliseconds,
      smsIfNoPositiveInfoAfterPushNotification: 5, // minutes
      alertIfNoPositiveInfoAfterSms: 5, // minutes
      triggerIfNoPositiveInfoAfterSms: 15, // minutes
    },
  },
  night: {
    start: 22,
    end: 6,
  },
  database: {
    enable_ssl: false,
    charset: 'utf8mb4_unicode_ci',
    database: env.DB_DATABASE,
    host: env.DB_HOST,
    logging: false,
    password: env.DB_PASSWORD,
    port: env.DB_PORT,
    synchronize: false,
    type: 'mysql',
    username: env.DB_USERNAME,
  },
  backend: {
    url: env.BACKEND_URL || '',
  },
  sms: {
    noConnectionToWatch: 'We have detected no connection with your watch.',
    heartRateInvalid: 'Your hear rate is invalid.',
  },
  firebase: {
    accountKey: firebaseAccountKey,
    notification: {
      sound: 'alarm.mp3',
      title: 'Click to verify your health status now',
      message: {
        regular: 'Automated check from the Biostasis Emergency App',
        pulseBased: 'No pulse data for {minutes}+ minutes.',
        alert: 'Are you ok? Open to cancel emergency trigger!',
      },
    },
    sms: 'Verify your health status now, click here {domain}/deeplink/are-you-ok to app page where health status can be verified. If you ignore this message, your emergency contacts will be notified in a few minutes.',
  },
  emergencyTrigger: {
    customMessagePrefix:
      'An emergency signal has been triggered with the following message:',
    defaultMessage:
      'This is an emergency signal from {name}. You are receiving this message because I may be in need of a cryopreservation.',
    ifThereAreAttachments: 'Additional information here and attached.',
  },
  s3: {
    bucket: process.env.S3_BUCKET,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    endpoint: process.env.S3_URL,
    region: process.env.S3_REGION,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    fileSizeLimit: process.env.S3_FILE_SIZE_LIMIT,
  },
  cloudFrontSigner: {
    accessKeyId: env.CDN_PRIV_KEY_ID,
    privateKey: String(env.CDN_PRIV_KEY).replace(/\\n/g, '\n'),
    url: env.CDN_PRIV_DNS,
    validityTime: 200000,
  },
});
