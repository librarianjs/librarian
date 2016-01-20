'use strict'

const sharp = require('sharp')
const presets = {
  thumb: 256,
  thumbnail: 256,
  small: 512,
  medium: 1024,
  large: 2048
}

function resizeFile (file, width) {
  let img = sharp(file)

  return img.metadata().then(metadata => {
    if (metadata.width <= width) {
      return false
    }
    return img.resize(width).toBuffer()
  })
}

module.exports = function createOrRetrieveResized (req, res, next) {
  let params = req.params
  let id = params.id
  let width = params.width

  if (presets[width]) {
    width = presets[width]
  } else {
    width = parseInt(width, 10)
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
      // If file is false here, then resizeFile did not modify the file.
      // If this happens, a size larger than the file was asked for.
      // In this case, we should just send the full version of the file as is.
      if (!file) {
        return id
      }

      return this.storage.put(filename, file).then(() => {
        return filename
      })
    }).then(name => {
      return this.storage.get(name)
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
