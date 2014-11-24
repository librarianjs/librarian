module.exports = function( req, res, next ){
  var metaEngine = this.options.metadataEngine

  metaEngine.getAsync( req.params.id ).then( function( data ){
    res.send( data )
  }, function(){
    next
  })
}
