module.exports = function( res, meta, file ){
  res.set( 'Content-Type', meta.mimeType )
  res.set( 'Content-Length', meta.fileSize )

  if( file.pipe ){
    file.pipe( res )
    return
  } else if( typeof file === 'string' || Buffer.isBuffer( file ) ){
    res.send( file )
  } else {
    res.status( 500 ).send( 'Invalid image type' )
    throw new Error( 'Invalid file returned. Please return ReadableStream, string, or Buffer' )
  }

}
