module.exports = function( req, res ){
  var form = '<!doctype html>' +
    '<html><body>' +
      '<form enctype="multipart/form-data" method=post>' +
        '<input type=file name=file>' +
        '<input type=submit>' +
      '</form>' +
    '</body></html>'
  res.send( form )
}
