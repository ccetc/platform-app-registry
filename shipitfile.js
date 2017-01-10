module.exports = function (shipit) {

  const config = require('./config.js')[shipit.options.environment]
  let shipitConfig = {}
  shipitConfig[shipit.options.environment] = config.deployment || {}

  shipit.initConfig(shipitConfig)

  shipit.task('deploy', function () {
    return shipit.remote('cd /var/www/registry && git pull && yarn install && npm run compile && service nginx restart')
  })

}
