'use strict'

const express = require('express')
const cors = require('cors')
const multerLib = require('multer')
const bodyParser = require('body-parser')
const Controller = require('./Controller')
const waiter = require('./middleware/waiter')

function buildRouter (options) {
  let app = express()
  let multer = multerLib()
  let controller = new Controller(options)

  if (options.cors) {
    app.use(cors(options.cors))
  }

  /*
   * Wait for all plugins to be ready
   */
  app.use(waiter(controller.init()))

  /*
   * File Upload
   */

  if (options.debug) {
    app.get('/', controller.sendAllFileIds)
  }

  let uploadHandlers = [multer, controller.upload]
  if(options.authenticate){
    uploadHandlers.unshift(options.authenticate)
  }
  app.post('/', uploadHandlers)

  /*
   * File Access
   */

  app.get('/:id', controller.sendFile)
  app.get('/:id/info', controller.sendFileInfo)

  return app
}

module.exports = buildRouter
