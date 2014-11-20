module.exports = function( req, res ){
  this.options.metadataEngine.allAsync().bind( res ).then( res.json )
}
