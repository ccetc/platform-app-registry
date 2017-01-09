import checkit from  'checkit'
import bookshelf from '../bookshelf'
import Version from './version'

export default bookshelf.Model.extend({

  tableName: 'apps',

  hasTimestamps: ['created_at', 'updated_at'],

  rules: {
    title: 'required'
  },

  versions: function() {
    return this.hasMany(Version, 'app_id')
  },

  initialize: function(attrs, opts) {
    this.on('saving', this.validateSave)
  },

  validateSave: function() {
    return new checkit(this.rules).run(this.attributes)
  }

})
