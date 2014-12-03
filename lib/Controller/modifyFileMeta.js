var allowed = [
  'fileName'
]

module.exports = function( req, res, next ){
  var metaEngine = this.options.metadataEngine
  var id = req.params.id
  metaEngine.getAsync( id ).then( function( meta ){
    for( var prop in req.body ){
      if( allowed.indexOf( prop ) >= 0 ){
        meta[ prop ] = req.body[ prop ]
      }
    }
    return metaEngine.patchAsync( id, meta )
  }).bind( res ).then( res.json, function( err ){
    res.status( 500 ).end()
  })
}
