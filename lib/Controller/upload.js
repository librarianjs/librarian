'use strict'

const fs = require('fs')
const http = require('http-status-codes')
const uuid = require('node-uuid')

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
  if (!req.file) {
    return res.status(http.BAD_REQUEST).json({
      error: {
        type: 'missing_file',
        message: 'Please POST with name `file`'
      }
    })
  }

  let file = req.file
  let fileData = {
    id: uuid.v4(),
    size: file.size,
    mimeType: file.mimetype,
    name: file.originalname
  }
  let fileBuffer = req.file.buffer

  return this.data.put(fileData).then(() => {
    return this.storage.put(fileData.id, fileBuffer)
  }).then(() => {
    return this.data.get(fileData.id)
  }).then(data => {
    res.status(http.CREATED).json(data)
  }).catch(next)
}
