var gm = require( 'gm' )
var Promise = require( 'bluebird' )

var presets = {
  small: 512,
  medium: 1024,
  large: 2048
}

function resizeFile( file, width, height ){
  return new Promise( function( reject, resolve ){
    var img = gm( file ).size( function( err, size ){
      if( err ){
        reject( err )
        return
      }
      if( size.width > width ){
        if( size.height > height ){
          img.resize( width, height )
        } else {
          img.resize( width )
        }
      }
      resolve( img )
    })
  })
}

module.exports = function createOrRetrieveResized( req, res, next ){
  var width
  var height
  var id = req.params.id

  if( req.params.preset ){
    for( var preset in presets ){
      if( !presets.hasOwnProperty( preset ) ) continue

      if( preset === params.req.preset ){
        width = presets[ preset ]
        break
      }
    }
  }

  if( req.params.width ){
    width = req.params.width
  }

  if( req.params.height ){
    height = height
  }

  var filename = id + '-' + width
  if( height ){
    filename += 'x' + height
  }

  var storage = this.options.storageEngine
  storage.getAsync( filename ).then( res.send.bind( res ), function(){
    storage.getAsync( id ).then( function( file ){
      return resizeFile( file, width, height )
    }).then( function( file ){
      storage.putAsync( filename, file )
      res.send( file )
    })
  })
}
