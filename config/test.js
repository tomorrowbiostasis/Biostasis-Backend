module.exports = {
  application: {
    call_timeout: 30,
    port: 5000,
    global_prefix: 'v1',
    timeoutForTests: 100000,
  },
  database: {
    enable_ssl: false,
    database: 'biostasis-test',
    host: 'biostasis_database',
    logging: false,
    password: 'root',
    port: 3306,
    synchronize: false,
    type: 'mysql',
    username: 'root',
  },
};
