module.exports = function( req, res, next ){
  this.options.metadataEngine
    .getAsync( req.params.id )
    .bind( res )
    .then( res.send, next )
}
