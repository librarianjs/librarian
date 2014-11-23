var Promise = require( 'bluebird' )

module.exports = function( file ){
  var meta = {}
  meta.mimeType = file.mimetype
  meta.fileName = file.originalname
  meta.fileSize = file.size

  return new Promise( function( resolve, reject ){
    resolve( meta )
  })
}
