var express = require( 'express' )
var routes = require( './router' )
var LocalFiles = require( './LocalFiles' )
var LocalMeta = require( './LocalMeta' )

function buildLibrarian( options ){
  options = options || {}
  options.metadataEngine = options.metadataEngine || new LocalMetadata()
  options.fileEngine = options.fileEngine || new LocalFiles()

  var app = express()
  app.use( routes( options ) )
  return app
}

buildLibrarian.LocalFiles = LocalFiles
buildLibrarian.LocalMeta = LocalMeta

module.exports = buildLibrarian
