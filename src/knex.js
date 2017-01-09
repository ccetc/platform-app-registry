const knex = require('knex')
const config = require('../knexfile')

var defaults = {
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'schema_migrations',
    directory: '/'
  },
  seeds: {
    directory: '/'
  }
}

module.exports = knex(Object.assign({}, defaults, config.development))
