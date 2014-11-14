var express = require( 'express' )
var routes = require( './router' )

function buildLibrarian( strategy ){
  strategy = strategy || new buildLibrarian.LocalStrategy()
  var app = express()
  app.use( routes( strategy ) )
  return app
}

buildLibrarian.LocalStrategy = require( './LocalStrategy' )
module.exports = buildLibrarian
