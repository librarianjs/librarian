var Promise = require( 'bluebird' )

module.exports = function( req, res, next ){
  var storageEngine = this.options.storageEngine
  var metaEngine = this.options.metadataEngine

  var id = req.params.id
  metaEngine.getAsync( id ).then( function( meta ){
    res.set( 'Content-Type', meta.mimeType )
    res.set( 'Content-Length', meta.fileS )
    return storageEngine.getAsync( id )
  }, function(){
    res.status( 404 ).end()
    return Promise.reject( 'File not found' )
  } ).then( function( file ){
    if( file.pipe ){
      file.pipe( res )
      return
    } else if( typeof file === 'string' || Buffer.isBuffer( file ) ){
      res.send( file )
    } else {
      res.status( 500 ).send( 'Invalid image type' )
      throw new Error( 'Invalid file returned. Please return ReadableStream, string, or Buffer' )
    }
  }, function( err ){
    res.status( 500 ).end( 'An unknown server error occured' )
  } )
}
