const env = process.env;

export default {
  database: env.DB_DATABASE,
  host: env.DB_HOST,
  logging: false,
  password: env.DB_PASSWORD,
  port: env.DB_PORT,
  synchronize: false,
  type: 'mysql',
  username: env.DB_USERNAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
