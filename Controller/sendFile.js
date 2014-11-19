module.exports = function( req, res, next ){
  this.options.metadataEngine.getAsync( req.params.id ).then( res.send, next )
}
