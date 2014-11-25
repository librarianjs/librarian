var allowed = [
  'fileName'
]

module.exports = function( req, res, next ){
  var metaEngine = this.options.metaEngine
  var id = req.params.id
  metaEngine.getAsync( id ).then( function( meta ){
    for( var prop in req.body ){
      if( allowed.indexOf( prop ) >= 0 ){
        meta[ prop ] = req.body[ prop ]
      }
    }
    return metaEngine.putAsync( id, meta )
  }).bind( res ).then( res.json, function(){
    res.status( 500 ).end()
  })
}
