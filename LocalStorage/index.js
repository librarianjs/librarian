var _ = require( 'lodash' )
var path = require( 'path' )
var fs = require( 'fs' )

var defaults = {
  files: path.join( process.env.PWD, 'files' )
}

function LocalStorage( options ){
  this.options = _.merge( defaults, options )
}

LocalStorage.prototype.get = function( filepath, callback ){
  fs.readFile( filepath, function( err, file ){
    if( err ){
      callback( err, null )
    } else {
      callback( null, file )
    }
  })
}

LocalStorage.prototype.overwrite = function( filepath, file, callback ){
  fs.exists( filepath, function( err, exists ){
    if( exists ){
      callback( false, null )
    } else {
      this.put( filepath, file, callback )
    }
  })
}

LocalStorage.prototype.put = function( filepath, file, callback ){
  fs.writeFile( filepath, file, function( err ){
    if( err ){
      callback( err, null )
    } else {
      callback( null, file )
    }
  })
}


module.exports = LocalStorage
