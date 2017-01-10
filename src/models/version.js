import checkit from  'checkit'
import bookshelf from '../services/bookshelf'
import App from './app'

export default bookshelf.Model.extend({

  tableName: 'versions',

  hasTimestamps: ['created_at', 'updated_at'],

  rules: {
    app_id: 'required',
    text: 'required'
  },

  app: function() {
    return this.belognsTo(App, 'app_id')
  },

  initialize: function(attrs, opts) {
    this.on('saving', this.validateSave)
  },

  validateSave: function() {
    return new checkit(this.rules).run(this.attributes)
  }

})
