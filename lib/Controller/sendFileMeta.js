module.exports = function( req, res, next ){
  this.options.metaEngine.getAsync( req.params.id ).then( res.send, next )
}
