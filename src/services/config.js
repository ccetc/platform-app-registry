import config from '../../config'

const environment = process.env.NODE_ENV || 'development'

export default config[environment]
