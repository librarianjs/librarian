'use strict'

const gm = require('gm')
const presets = {
  thumb: 256,
  thumbnail: 256,
  small: 512,
  medium: 1024,
  large: 2048
}

function resizeFile (file, width) {
  return new Promise((resolve, reject) => {
    let img = gm(file).size((err, size) => {
      if (err) {
        reject(err)
        return
      }

      if(size.width > width){
        img.resize(width)
      }
      resolve(img.stream())
    })
  })
}

module.exports = function createOrRetrieveResized (req, res, next) {
  let width
  let params = req.params
  let id = params.id

  for (let preset in presets) {
    if (!presets.hasOwnProperty(preset)) {
      continue
    }

    if (preset === params.width) {
      width = presets[ preset ]
      handled = true
      break
    }
  }

  if (!width) {
    width = params.width
  }

  let filename = id + '-' + width + 'px'
  let filePromise = this.cache.get(filename).then(file => {
    return file || this.storage.get(filename)
  }).then(file => {
    return file || this.storage.get(id)
  }).then(file => {
    if (!file) {
      return null
    }

    return resizeFile(file, width).then(file => {
      return this.storage.put(filename, file)
    }).then(() => {
      return this.storage.get(filename)
    })
  })

  Promise.all([
    this.data.get(id),
    filePromise
  ]).then(values => {
    if (values[0] === null || values[1] === null) {
      return res.status(404).end()
    }
    this.outputFile(res, values[0], values[1])
  }).catch(next)
}
