module.exports = function( req, res, next ){
  req.params.width = 256
  this.sendFileResized( req, res, next )
}
