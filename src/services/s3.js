import config from './config'
import S3 from 'aws-sdk/clients/s3'

export default new S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey
})
