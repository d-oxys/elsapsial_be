module.exports = {
  type: 'postgres',
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsTableName: 'migration_table',
  migrations: ['dist/migration/*.js'],
  cli: {
    migrationsDir: 'src/migration',
  },
};
