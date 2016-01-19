const express = require('express')
const routes = require('./router')
const InMemoryStorage = require('librarian-memory-storage')
const InMemoryData = require('librarian-memory-data')
const InMemoryCache = require('librarian-memory-cache')

function buildLibrarian (options) {
  options = options || {}
  options.data = options.data || new InMemoryData
  options.storage = options.storage || new InMemoryStorage
  options.cache = options.cache || new InMemoryCache

  var app = express()
  app.use(routes(options))
  return app
}

module.exports = buildLibrarian
