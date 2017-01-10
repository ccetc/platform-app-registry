import { Router } from 'express'
import App from '../models/app'
import Version from '../models/version'
import config from '../services/config'
import s3 from '../services/s3'
import fs from 'fs'
import fse from 'fs-extra'
import path from 'path'

const index = (req, res) => {

  App.fetchAll({ withRelated: ['versions'] }).then(apps => {

    let json = {}
    apps.map(app => {
      json[app.get('title').toLowerCase()] = {
        latest: app.get('latest'),
        versions: app.related('versions').map(version => version.get('text'))
      }
    })
    res.json(json)

  }).catch(err => {
    res.send(err.message)
  })

}

const show = (req, res) => {

  const title = req.params.title

  App.where('title', req.params.title).fetch().then(app => {

    if(!app) {
      return res.status(404).json({ message: `There is no app with the title '${title}'` })
    }

    const version  = (!req.params.version || req.params.version === 'latest') ? app.get('latest') : req.params.version

    if(!version) {
      return res.status(404).json({ message: `Invalid version` })
    }

    res.redirect(301, `http://${config.aws.bucket}.s3.amazonaws.com/${title}-${version}.zip`,);

  }).catch(err => {
    res.send(err.message)
  })

}

const create = (req, res) => {

  const title = req.params.title

  App.where('title', req.params.title).fetch({ withRelated: ['versions'] }).then(app => {

    if(app) {
      return res.status(404).json({ message: `There is already an app with the title '${title}'` })
    }

    return App.forge({
      title: req.params.title
    }).save().then(app => {

      res.status(200).json({ message: `An app with the title '${title}' was successfully created` })

    }).catch(err => {
      res.status(404).json({ message: `Unable to create an app with the title '${title}'` })
    })

  }).catch(err => {
    res.status(404).json({ message: `Unable to create an app with the title '${title}'` })
  })


}

const publish = (req, res) => {

  const title = req.params.title

  return App.where('title', req.params.title).fetch().then(app => {

    if(!app) {
      return res.status(404).json({ message: `There is no app with the title '${title}'` })
    }

    return Version.where({
      app_id: app.get('id'),
      text: req.params.version
    }).fetch().then(version => {

      if(version) {
        return res.status(404).json({ message: `There is already a bundle with version '${req.params.version}' for the app '${title}'` })
      }

      if(!req.files || !req.files.bundle) {
        return res.status(404).json({ message: 'There was no attached bundle' })
      }

      const filename = `${title}-${req.params.version}.zip`

      fs.readFile(req.files.bundle.file, (err, data) => {

        if (err) {
          return res.status(404).json({ message: 'Unable to read file' })
        }

        const object = {
          Bucket: config.aws.bucket,
          Key: `${title}-${req.params.version}.zip`,
          ACL: 'public-read',
          Body: data
        }

        s3.putObject(object, (err, data) => {

          if(err) {
            return res.status(404).json({ message: 'Unable to upload file' })
          }

          return Version.forge({
            app_id: app.get('id'),
            text: req.params.version
          }).save().then(version => {

            return app.save({
              latest: req.params.version
            }).then(app => {

              fs.unlinkSync(req.files.bundle.file)

              res.status(200).json({ message: `Bundle successfully created for the app '${title}' with version '${req.params.version}'` })

            }).catch(err => {
              res.send(err.message)
            })

          }).catch(err => {
            res.send(err.message)
          })

        })

      })

    }).catch(err => {
      res.send(err.message)
    })


  }).catch(err => {
    res.send(err.message)
  })

}

const router = Router()
router.get('/', index)
router.get('/:title', show)
router.get('/:title/:version', show)
router.post('/:title', create)
router.post('/:title/:version', publish)

export default router
