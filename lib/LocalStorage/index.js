var _ = require( 'lodash' )
var path = require( 'path' )
var fs = require( 'fs' )

var defaults = {
  files: path.join( process.env.PWD, 'files' )
}

function LocalStorage( options ){
  this.options = _.merge( defaults, options )
}

LocalStorage.prototype.filepath = function( id ){
  return path.join( this.options.files, id )
}

LocalStorage.prototype.get = function( filepath, callback ){
  fs.readFile( this.filepath( id ), function( err, file ){
    if( err ){
      callback( err, null )
    } else {
      callback( null, file )
    }
  })
}

LocalStorage.prototype.overwrite = function( id, file, callback ){
  fs.exists( this.filepath( id ), function( err, exists ){
    if( exists ){
      callback( false, null )
    } else {
      this.put( filepath, file, callback )
    }
  })
}

LocalStorage.prototype.put = function( name, file, callback ){
  fs.writeFile( this.filepath( name ), file, function( err ){
    if( err ){
      callback( err, null )
    } else {
      callback( null, file )
    }
  })
}

module.exports = LocalStorage
