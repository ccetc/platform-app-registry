exports.seed = (knex, Promise) => {
  return knex('apps').del()
  .then(() => {
    return knex('apps').insert([
      {
        title: 'expenses',
        latest: '1.0.2'
      }, {
        title: 'competency',
        latest: '1.0.0'
      }, {
        title: 'learning',
        latest: '1.0.1'
      }
    ])
  }).then(() => {
    return knex('versions').del()
  })
  .then(() => {
    return knex('versions').insert([
      {
        app_id: 1,
        text: '1.0.0'
      }, {
        app_id: 1,
        text: '1.0.1'
      }, {
        app_id: 1,
        text: '1.0.2'
      }, {
        app_id: 2,
        text: '1.0.0'
      }, {
        app_id: 3,
        text: '1.0.0'
      }, {
        app_id: 3,
        text: '1.0.1'
      }
    ])
  })
}
