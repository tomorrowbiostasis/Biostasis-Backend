require('dotenv').config();

const env = process.env;

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
};
