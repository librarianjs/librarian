module.exports = function( req, res, next ){
  this.options.storageEngine
    .getAsync( req.params.id )
    .bind( res )
    .then( res.send, next )
}
