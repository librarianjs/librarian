var gm = require( 'gm' )
var Promise = require( 'bluebird' )

var presets = {
  thumb: 256,
  thumbnail: 256,
  small: 512,
  medium: 1024,
  large: 2048
}

function resizeFile( file, width ){
  return new Promise( function( resolve, reject ){
    var img = gm( file ).size( function( err, size ){
      if( err ){
        reject( err )
        return
      }

      if( size.width > width ){
        img.resize( width )
      }
      resolve( img.stream() )
    })
  })
}

module.exports = function createOrRetrieveResized( req, res, next ){
  var width
  var params = req.params
  var id = params.id

  for( var preset in presets ){
    if( !presets.hasOwnProperty( preset ) ) continue

    if( preset === params.width ){
      width = presets[ preset ]
      handled = true
      break
    }
  }

  if( !width ){
    width = params.width
  }

  var filename = id + '-' + width
  var storage = this.options.storageEngine

  function makeResizedFile( id ){
    return storage.getAsync( id ).then( function( file ){
      return resizeFile( file, width )
    }).then( function( file ){
      return storage.putAsync( filename, file )
    }).then( function(){
      return storage.getAsync( filename )
    })
  }

  var filePromise = storage.getAsync( filename ).bind( this ).then( function( file ){
    if( file ){
      return file
    } else {
      return makeResizedFile( id )
    }
  }, function(){
    return makeResizedFile( id )
  })

  var metaPromise = this.options.metadataEngine.getAsync( id )

  Promise.all([ metaPromise, filePromise ]).bind( this ).spread( function( meta, file ){
    this.outputFile( res, meta, file )
  }, function( e ){
    res.status( 404 ).end()
  })
}
