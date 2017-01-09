const Bookshelf = require('bookshelf')
const knex = require('./knex')

const bookshelf = Bookshelf(knex)

bookshelf.plugin('virtuals')
bookshelf.plugin('pagination')

module.exports = bookshelf
