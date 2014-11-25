var Promise = require( 'bluebird' )

module.exports = function( req, res ){
  var id = req.params.id

  var filePromise = this.options.storageEngine.getAsync( id )
  var metaPromise = this.options.metadataEngine.getAsync( id )

  Promise.all([ metaPromise, filePromise ]).bind( this ).spread( function( meta, file ){
    this.outputFile( res, meta, file )
  }, function(){
    res.status( 404 ).end()
  })
}
