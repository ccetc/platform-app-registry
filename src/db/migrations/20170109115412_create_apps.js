
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('apps', function (table) {
      table.increments('id').primary()
      table.string('title')
      table.string('latest')
      table.timestamps()
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('apps')
  ])
};
