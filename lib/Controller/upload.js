var Promise = require( 'bluebird' )

module.exports = function( req, res, next ){
  var files = []
  var metaEngine = this.options.metaEngine

  var reqFiles = req.files
  for( file in reqFiles ){
    if( !reqFiles.hasOwnProperty( file ) ) continue
    files.push( reqFiles[ file ] )
  }

  var writers = files.map( function( file ){
    return this.parseFileMeta( file ).then( function( meta ){
      return metaEngine.newAsync( meta )
    })
  }.bind( this ) )

  Promise.all( writers ).bind( res ).then( res.send, next )
}
