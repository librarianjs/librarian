module.exports = function( req, res, next ){
  this.options.metaEngine
    .getAsync( req.params.id )
    .bind( res )
    .then( res.send, next )
}
