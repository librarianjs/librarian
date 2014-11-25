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

LocalStorage.prototype.put = function( name, file, callback ){
  var src
  if( file.pipe ){
    src = file
  } else {
    src = fs.createReadStream( file )
  }
  var dest = fs.createWriteStream( this.filepath( name ) )
  src.pipe( dest )
  src.on( 'end', function(){
    callback( null )
  })
  src.on( 'error', callback )
}

module.exports = LocalStorage
