var DEFAULT_CACHE_TIME = 30 * 24 * 60 * 60

module.exports = function( res, meta, file ){
  if( !meta ){
    res.status( 404 ).end()
    return
  }

  res.set( 'Content-Type', meta.mimeType )
  res.set( 'Content-Length', meta.fileSize )
  res.set( 'Cache-Control', 'max-age=' + ( this.options.maxAge || DEFAULT_CACHE_TIME ) )

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
