'use strict'

const fs = require('fs')
const http = require('http-status-codes')

function readFile (path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, buffer) => {
      if (err) {
        reject(err)
      }
      resolve(buffer)
    })
  })
}

module.exports = function(req, res, next){
  if (!req.files.file) {
    return res.status(http.BAD_REQUEST).json({
      error: {
        type: 'missing_file',
        message: 'Please POST with name `file`'
      }
    })
  }
  let file = req.files.file

  let data
  this.parseFileInfo(file).then(fileData => {
    data = fileData
    return this.data.put(fileData)
  }).then(() => {
    return readFile(file.path)
  }).then(fileBuffer => {
    return this.storage.put(data.id, fileBuffer)
  }).then(() => {
    res.status(http.CREATED).json(data)
  }).catch(next)
}
