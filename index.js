var express = require( 'express' )
var routes = require( './router' )
function buildLibrarian( options ){
  var app = express()
  app.use( routes )
  return app
}

module.exports = buildLibrarian
