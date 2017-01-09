
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('versions', function (table) {
      table.increments('id').primary()
      table.integer('app_id').unsigned()
      table.foreign('app_id').references('apps.id')
      table.string('text')
      table.timestamps()
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('versions')
  ])
};
