var _ = require( 'lodash' )
var path = require( 'path' )
var file = require( './File' )

var defaults = {
  db: path.join( process.env.PWD, 'files.db' )
}

function LocalMeta( options ){
  this.options = _.merge( defaults, options )
  this.File = file( options )
}

LocalMeta.prototype.get = function( fileId, callback ){
  callback( null, {} )
}

LocalMeta.prototype.get = function( fileId, callback ){
  callback( null, {} )
}

LocalMeta.prototype.get = function( fileId, callback ){
  callback( null, {} )
}


module.exports = LocalMeta
