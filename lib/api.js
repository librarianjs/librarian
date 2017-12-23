const fs = require('fs')
const http = require('http-status-codes')
const uuid = require('node-uuid')
const image = require('./image.js')
const DEFAULT_CACHE_TIME = 30 * 24 * 60 * 60
const SIZE_PRESETS = {
  icon: 64,
  thumbnail: 128,
  small: 256,
  medium: 512,
  large: 1024,
  huge: 2048,
}

const normalize = k => {
  if (!k) {
    return k
  }
  return SIZE_PRESETS[k] || parseInt(k, 10)
}

const file_name = (id, params) => {
  let query = Object.keys(params).filter(k => params[k])
  .map(k => `${k}=${params[k]}`).join('=')
  return query ? `${id}?${query}` : id
}

class Api {
  constructor (opt) {
    this.options = opt
    this.data = opt.data || new InMemoryData()
    this.storage = opt.storage || new InMemoryStorage()
    this.cache = opt.cache || new NoCache()
  }
  async init () {
    return await Promise.all([
      this.storage.init && this.storage.init(),
      this.data.init && this.data.init(),
      this.cache && this.cache.init && this.cache.init(),
    ].filter(Boolean))
  }

  async all_ids (req, res, next) {
    try { res.json(await this.data.getAll()) }
    catch (e) { next(e) }
  }

  async file_info (req, res, next) {
    try { res.json(await this.data.get(req.params.id)) }
    catch (e) { next(e) }
  }

  async upload (req, res, next) {
    try {
      if (!req.file) {
        return res.status(http.BAD_REQUEST).json({
          error: {
            type: 'missing_file',
            message: 'Please POST with name `file`'
          }
        })
      }
      let {file} = req
      let {buffer} = file
      if (this.options.maxSize) {
        let resized = await image.resize(buffer, {max: this.options.maxSize})
        buffer = resized || buffer
      }
      let file_data = {
        id: uuid.v4(),
        size: buffer.length,
        mimeType: file.mimetype,
        name: file.originalname
      }
      await this.data.put(file_data)
      await this.storage.put(file_data.id, buffer)
      res.status(http.CREATED).json(await this.data.get(file_data.id))
    } catch (e) { next(e) }
  }

  async send_file (req, res, next) {
    try {
      let id = req.params.id
      let width = normalize(req.query.width)
      let height = normalize(req.query.height)
      let max = normalize(req.query.max)
      let [data, buffer] = await Promise.all([
        this.data.get(id),
        this._file_buffer(id, {width, height, max}),
      ])
      if (!data || !buffer) {
        return res.status(404).end()
      }
      this._output(res, data, buffer)
    } catch (e) { next(e) }
  }

  async _cache_or_storage (k) {
    let file = await this.cache.get(k)
    if (file) {
      return file
    }
    file = await this.storage.get(k)
    if (file) {
      await this.cache.put(k, file)
      return file
    }
  }

  async _file_buffer (id, params) {
    let name = file_name(id, params)
    let file = await this._cache_or_storage(name)
    // If we were trying to get a resized version of the file, and didn't find
    // it, we should resize the original
    if (!file && name !== id) {
      file = await this._cache_or_storage(id)
      if (!file) {
        return
      }
      let modified = await image.resize(file, params)
      // modified can be false when image.resize did not modify the file.
      // If this happens, a size larger than the file was asked for.
      // In this case, we should just send the original
      if (modified) {
        await Promise.all([
          this.storage.put(name, file),
          this.cache.put(name, file),
        ])
        file = modified
      }
    }
    return file
  }

  _output (res, meta, file) {
    res.set('Content-Type', meta.mimeType)
    res.set('Content-Length', meta.size)
    res.set('Cache-Control', 'max-age=' + (this.options.maxAge || DEFAULT_CACHE_TIME))
    res.set('Content-Disposition', `inline; filename="${meta.name}"`)
    res.send(file)
  }
}

module.exports = Api
