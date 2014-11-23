var Promise = require( 'bluebird' )

module.exports = function( req, res, next ){
  var files = []
  var metaEngine = this.options.metadataEngine
  var storageEngine = this.options.storageEngine

  var reqFiles = req.files
  for( file in reqFiles ){
    if( !reqFiles.hasOwnProperty( file ) ) continue
    files.push( reqFiles[ file ] )
  }

  var writers = files.map( function( file ){
    var fileMeta
    return this.parseFileMeta( file ).then( function( meta ){
      return metaEngine.newAsync( meta )
    }).then( function( meta ){
      storageEngine.putAsync( meta.id, file.path )
      return meta
    })
  }.bind( this ) )

  Promise.all( writers ).bind( res ).then( res.send, next )
}
