'use strict'

const express = require('express')
const cors = require('cors')
const multerLib = require('multer')
const bodyParser = require('body-parser')
const Controller = require('./Controller')

function buildRouter (options) {
  let router = express.Router()
  let multer = multerLib()
  let controller = new Controller(options)

  if (options.cors) {
    router.use(cors(options.cors))
  }

  /*
   * File Upload
   */

  if (options.debug) {
    router.get('/', controller.sendAllFileIds)
  }

  let uploadHandlers = [multer, controller.upload]
  if(options.authenticate){
    uploadHandlers.unshift(options.authenticate)
  }
  router.post('/', uploadHandlers)

  /*
   * File Access
   */

  router.get('/:id', controller.sendFile)
  router.get('/:id/info', controller.sendFileInfo)

  return router
}

module.exports = buildRouter
