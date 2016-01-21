'use strict'

const sharp = require('sharp')
const SIZE_PRESETS = {
  thumb: 256,
  thumbnail: 256,
  small: 512,
  medium: 1024,
  large: 2048
}

function matchPreset (key) {
  if (SIZE_PRESETS[key]) {
    return SIZE_PRESETS[key]
  } else if (key) {
    return parseInt(key, 10)
  }
  return key
}

function resizeFile (file, options) {
  let img = sharp(file)

  return img.metadata().then(metadata => {
    if (metadata.width <= options.width) {
      return false
    }
    return img.resize(options.width).toBuffer()
  })
}

function sendFile (req, res, next) {
  let id = req.params.id
  let width = matchPreset(req.query.width)

  let filename = width ? id + '-' + width + 'px' : id
  let filePromise

  /*
   * Try to get either the cached version of the file or the standard version of the file
   */
  filePromise = this.cache.get(filename).then(file => {
    return file || this.storage.get(filename)
  })

  /*
   * If we were trying to get a resized version of the file, and didn't find it,
   * get the regular version of the file.
   */
  if (filename !== id) {
    filePromise = filePromise.then(() => {
     return this.cache.get(id)
    }).then(file => {
     return file || this.storage.get(id)
    })

    /*
    * If we found the original version, resize it, save it, and send the
    * resized version back.
    * Otherwise we should send back null to show that we couldn't find it.
    */
    filePromise = filePromise.then(file => {
      if (!file) {
        return null
      }

      return resizeFile(file, {
        width: width
      }).then(resizedFile => {
        /*
         * If file is false here, then resizeFile did not modify the file.
         * If this happens, a size larger than the file was asked for.
         * In this case, we should just send the full version of the file as is.
         */
        if (!resizedFile) {
          return file
        } else {
          return this.storage.put(filename, resizedFile).then(() => resizedFile)
        }
      })
    })
  }

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

module.exports = sendFile
