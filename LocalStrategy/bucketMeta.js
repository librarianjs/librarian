var _ = require( 'lodash' )
var File = require( './File' )

module.exports = function( req, res ){
  _( req.files ).forOwn( function( file ){

  })
  var file = new File({
    name: upload.name,
    size: upload.size,
    path: upload.path,
    mime: upload.mimetype
  })
  file.save( function( err ){
    if( err ) console.log( err )
    res.send( file )
  })
}
