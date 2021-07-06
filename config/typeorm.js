const env = process.env;

module.exports = {
    database: env.DB_DATABASE,
    host: env.DB_HOST,
    logging: true,
    password: env.DB_PASSWORD,
    port: env.DB_PORT,
    synchronize: false,
    type: "mysql",
    username: env.DB_USERNAME,
    entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../src/migrations/*{.ts,.js}'],
    cli: {
        migrationsDir: 'src/migrations',
    }
};
