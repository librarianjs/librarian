var _ = require( 'lodash' )
var path = require( 'path' )
var fs = require( 'fs' )

var defaults = {
  files: path.join( process.env.PWD, 'files' )
}

function LocalStorage( options ){
  this.options = _.merge( defaults, options )
  this.init()
}

LocalStorage.prototype.init = function(){
  fs.mkdir( this.options.files, function(){ /* do nothing if the directory already existed */ } )
}

LocalStorage.prototype.filepath = function( id ){
  return path.join( this.options.files, id )
}

LocalStorage.prototype.get = function( name, callback ){
  fs.readFile( this.filepath( name ), function( err, file ){
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
  var src = fs.createReadStream( file )
  var dest = fs.createWriteStream( this.filepath( name ) )
  src.pipe( dest )
  src.on( 'end', function(){
    callback( null, name )
  })
  src.on( 'error', callback )
}

module.exports = LocalStorage
