module.exports = function( req, res, next ){
  var id = req.params.id
  var storageEngine = this.options.storageEngine
  var metaEngine = this.options.metaEngine
  metaEngine.getAsync( id ).then( function( meta ){
    return storageEngine.overwriteAsync( meta.id )
  }, next ).then( function(){
    return metaEngine.getAsync( id )
  }, next ).bind( res ).then( res.json, next )
}
