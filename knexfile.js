// Update with your config settings.

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: 'platform-app-registry',
      user:     'postgres',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    seeds: {
      directory: './src/db'
    },
    migrations: {
      tableName: 'schema_migrations',
      directory: './src/db/migrations'
    }
  }

};
