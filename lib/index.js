var express = require( 'express' )
var routes = require( './router' )
var LocalStorage = require( './LocalStorage' )
var LocalMeta = require( './LocalMeta' )
var Promise = require( 'bluebird' )

function buildLibrarian( options ){
  options = options || {}
  options.metadataEngine = Promise.promisifyAll( options.metadataEngine || new LocalMeta() )
  options.fileEngine =Promise.promisifyAll(  options.fileEngine || new LocalStorage() )

  var app = express()
  app.use( routes( options ) )
  return app
}

buildLibrarian.LocalStorage = LocalStorage
buildLibrarian.LocalMeta = LocalMeta

module.exports = buildLibrarian
