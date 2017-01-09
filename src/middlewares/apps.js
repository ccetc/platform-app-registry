import { Router } from 'express'
import App from '../models/app'
import Version from '../models/version'
import fs from 'fs'
import path from 'path'

const index = (req, res) => {

  App.fetchAll({ withRelated: ['versions'] }).then(apps => {

    let json = {}
    apps.map(app => {
      json[app.get('title').toLowerCase()] = {
        versions: app.related('versions').map(version => ({
          url: '',
          version: version.get('text')
        }))
      }
    })
    res.json(json)

  }).catch(err => {
    res.send(err.message)
  })

}

const download = (req, res) => {

  const title = req.params.title

  App.where('title', req.params.title).fetch().then(app => {

    if(!app) {
      return res.status(404).json({ message: `There is no app with the title '${title}'` })
    }

    const version  = req.params.version || app.get('latest')
    const filepath = path.resolve(`./bundles/${title}-${version}.zip`)
    if(!fs.existsSync(filepath)) {
      return res.status(404).json({ message: `There is no version '${version}' for the app '${title}'` })
    }

    res.status(200).download(filepath, `${title}-${version}.zip`)

  }).catch(err => {
    console.log(err)
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
  const version = req.params.version

  App.where('title', req.params.title).fetch().then(app => {

    if(!app) {
      return res.status(404).json({ message: `There is no app with the title '${title}'` })
    }

    Version.where({
      app_id: app.get('id')
    }).fetch().then(version => {

      if(version) {
        return res.status(404).json({ message: `There is already a bundle with version '${version}' for the app '${title}'` })
      }
      res.status(200).json({ message: `Bundle successfully created for the app '${title}' with version '${version}'` })

    })


  }).catch(err => {
    res.send(err.message)
  })

}

const router = Router()
router.get('/', index)
router.get('/:title', download)
router.get('/:title/:version', download)
router.post('/:title', create)
router.post('/:title/:version', publish)

export default router
