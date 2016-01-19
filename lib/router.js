'use strict'

const express = require('express')
const multerLib = require('multer')
const bodyParser = require('body-parser')
const Controller = require('./Controller')

function buildRouter (options) {
  let router = express.Router()
  let multer = multerLib()
  let controller = new Controller(options)

  /*
   * File Upload
   */

  let uploadHandlers = [multer, controller.upload]
  if(options.authenticate){
    uploadHandlers.unshift(options.authenticate)
  }
  router.post('/upload', uploadHandlers)

  /*
   * File Access
   */

  router.get('/:id', controller.sendFile)
  router.get('/:id/info', controller.sendFileInfo)
  router.get('/:id/:width', controller.sendFileResized)

  return router
}

module.exports = buildRouter
