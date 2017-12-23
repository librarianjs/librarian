const sharp = require('sharp')
let E = module.exports = {}

function fit_sizes (meta, options) {
  let horizontalRatio = options.width / meta.width
  let verticalRatio = options.height / meta.height

  if (verticalRatio < horizontalRatio) {
    return {height: options.height}
  } else {
    return {width: options.width}
  }
}

// TODO josh: should have unit tests for the resizing logic
E.resize = async (buffer, opt) => {
  let img = sharp(buffer)
  let metadata = await img.metadata()
  if (opt.max) {
    if (metadata.width > metadata.height) {
      opt.width = opt.max
      opt.height = null
    } else {
      opt.height = opt.max
      opt.width = null
    }
  } else if (opt.width && opt.height) {
    opt = fit_sizes(metadata, opt)
  }
  if (opt.width && metadata.width <= opt.width) {
    opt.width = null
  }
  if (opt.height && metadata.height <= opt.height) {
    opt.height = null
  }
  if (opt.height || opt.width) {
    return img.resize(opt.width, opt.height).toBuffer()
  }
  // if we are being asked to resize an image larger than it is, do nothing
}
