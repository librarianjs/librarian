var _ = require( 'lodash' )

module.exports = function( req, res, next ){
  var metaEngine = this.options.metaEngine
  var id = req.params.id
  metaEngine.getAsync( id ).then( function( meta ){
    meta = _.merge( meta, req.body )
    return metaEngine.putAsync( id )
  }).bind( res ).then( res.json, next )
}
