var Promise = require( 'bluebird' )
var fs = require( 'fs' )

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
      return storageEngine
        .putAsync( meta.id, fs.createReadStream( file.path ) )
        .then( function(){
          return meta
        })
    })
  }.bind( this ) )

  Promise.all( writers ).bind( res ).then( res.send, next )
}
