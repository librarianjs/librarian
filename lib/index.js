var express = require( 'express' )
var routes = require( './router' )
var LocalStorage = require( 'librarian-local-storage' )
var LocalMeta = require( 'librarian-local-meta' )
var Promise = require( 'bluebird' )

function buildLibrarian( options ){
  options = options || {}
  options.metadataEngine = Promise.promisifyAll( options.metadataEngine || new LocalMeta() )
  options.storageEngine = Promise.promisifyAll(  options.fileEngine || new LocalStorage() )

  var app = express()
  app.use( routes( options ) )
  return app
}

buildLibrarian.LocalStorage = LocalStorage
buildLibrarian.LocalMeta = LocalMeta

module.exports = buildLibrarian
