import Bookshelf from 'bookshelf'
import knex from './knex'

const bookshelf = Bookshelf(knex)
bookshelf.plugin('virtuals')
bookshelf.plugin('pagination')

module.exports = bookshelf
