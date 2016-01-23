'use strict'

const sharp = require('sharp')
const SIZE_PRESETS = {
  icon: 64,
  thumbnail: 128,
  small: 256,
  medium: 512,
  large: 1024,
  huge: 2048,
}

function matchPreset (key) {
  if (SIZE_PRESETS[key]) {
    return SIZE_PRESETS[key]
  } else if (key) {
    return parseInt(key, 10)
  }
  return key
}

function createFileName (id, params) {
  let query = Object.keys(params).filter(function (key) {
    return !!params[key]
  }).map(function (key) {
    return key + '=' + params[key]
  }).join('=')

  if (query) {
    return id + '?' + query
  } else {
    return id
  }
}

function calculateFittingSizes (meta, options) {
  let horizontalRatio = options.width / meta.width
  let verticalRatio = options.height / meta.height

  if (verticalRatio < horizontalRatio) {
    return {height: options.height}
  } else {
    return {width: options.width}
  }
}

function resizeFile (file, options) {
  let img = sharp(file)

  return img.metadata().then(metadata => {
    if (options.max) {
      if (metadata.width > metadata.height) {
        options.width = options.max
        options.height = null
      } else {
        options.height = options.max
        options.width = null
      }
    } else if (options.width && options.height) {
      options = calculateFittingSizes(metadata, options)
    }

    if (options.width && metadata.width <= options.width) {
      options.width = null
    }

    if (options.height && metadata.height <= options.height) {
      options.height = null
    }

    if (!(options.height || options.width)) {
      return false
    }

    return img.resize(options.width, options.height).toBuffer()
  })
}

function sendFile (req, res, next) {
  let id = req.params.id
  let width = matchPreset(req.query.width)
  let height = matchPreset(req.query.height)
  let max = matchPreset(req.query.max)

  let filename = createFileName(id, {width, height, max})
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

      return resizeFile(file, {width, height, max}).then(resizedFile => {
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
