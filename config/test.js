require('dotenv').config();

const env = process.env;

module.exports = {
  application: {
    call_timeout: 30,
    port: 5000,
    global_prefix: 'v1',
    timeoutForTests: 100000,
  },
  authorization: {
    accessKeyId: '',
    secretAccessKey: '',
    clientId: '',
    region: '',
    userPoolId: '',
    jwks: '',
  },
  database: {
    enable_ssl: false,
    charset: 'utf8mb4_unicode_ci',
    database: 'biostasis_test',
    host: env.DB_HOST,
    logging: false,
    password: env.DB_PASSWORD,
    port: env.DB_PORT,
    synchronize: false,
    type: 'mysql',
    username: env.DB_USERNAME,
  },
};
