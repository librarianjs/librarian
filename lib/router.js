const express = require('express')
const cors = require('cors')
const multer = require('multer')
const bodyParser = require('body-parser')
const Api = require('./api')
const waiter = require('./middleware/waiter')

function build_librarian (options) {
  let app = express()
  let api = new Api(options)
  let upload = multer()
  if (options.cors === true) {
    options.cors = {}
  }
  if (options.cors) {
    app.use(cors(options.cors))
  }
  app.use(waiter(api.init()))
  if (options.debug) {
    app.get('/', api.all_ids.bind(api))
    app.get('/upload', (req, res) => res.sendFile(__dirname + '/public/upload-form.html'))
  }
  let upload_handlers = [upload.single('file'), api.upload.bind(api)]
  if(options.authenticate){
    upload_handlers.unshift(options.authenticate)
  }
  app.post('/', upload_handlers)
  app.get('/:id', api.send_file.bind(api))
  app.get('/:id/info', api.file_info.bind(api))
  return app
}

module.exports = build_librarian
