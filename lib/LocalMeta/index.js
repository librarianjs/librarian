var _ = require( 'lodash' )
var path = require( 'path' )
var file = require( './File' )

var defaults = {
  db: path.join( process.env.PWD, 'files.sqlite' )
}

function LocalMeta( options ){
  this.options = _.merge( defaults, options )
  this.File = file( this.options )
}

LocalMeta.prototype.get = function( fileId, callback ){
  callback( null, {} )
}

LocalMeta.prototype.all = function( callback ){
  callback( null, [] )
}

LocalMeta.prototype.put = function( fileId, callback ){
  callback( null, {} )
}

LocalMeta.prototype.patch = function( fileId, callback ){
  callback( null, {} )
}

LocalMeta.prototype.new = function( meta, callback ){
  callback( null, {} )
}


module.exports = LocalMeta
