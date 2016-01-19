var DEFAULT_CACHE_TIME = 30 * 24 * 60 * 60

module.exports = function (res, meta, file) {
  res.set('Content-Type', meta.mimeType)
  res.set('Content-Length', meta.size)
  res.set('Cache-Control', 'max-age=' + (this.options.maxAge || DEFAULT_CACHE_TIME))

  res.send(file)
}
