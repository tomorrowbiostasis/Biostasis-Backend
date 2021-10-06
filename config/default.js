require('dotenv').config();

const env = process.env;

let firebaseAccountKey = {};

try {
  firebaseAccountKey = JSON.parse(env.FIREBASE_ACCOUNT_KEY);
} catch {}

module.exports = {
  application: {
    call_timeout: 30,
    port: env.APP_PORT || 5000,
    global_prefix: env.GLOBAL_PREFIX || 'v1',
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
    db: 0,
  },
  queue: {
    numberOfAttempts: 3,
    sendAfterTime: {
      repeatTryingToSendMessage: 60000, // milliseconds
      noConnectionToWatch: 300000, // milliseconds
      heartRateInvalid: 300000, // milliseconds,
      smsIfNoPositiveInfoAfterPushNotification: 5, // minutes
      triggerIfNoPositiveInfoAfterSms: 15, // minutes
    },
  },
  night: {
    start: 20,
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
    isEverythingOk:
      'Based on your settings an automated emergency will be triggered soon. Are you ok?',
  },
  firebase: {
    accountKey: firebaseAccountKey,
  },
  emergencyTrigger: {
    defaultMessage:
      'Hey, I’m having a medical emergency. Please hide the key and burn that letter. My medical directives are attached.',
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
};
