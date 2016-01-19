'use strict'

const fs = require('fs')
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
    res.json(data)
  }).catch(next)
}
