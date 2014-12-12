var assert = require( 'assert' )
var librarian = require( '../lib' )
var request = require( 'request' )
var fs = require( 'fs' )
var path = require( 'path' )

function MockMeta(){
  var storage = {}
  var nextFreeId = 1

  this.get = function( id, callback ){
    callback( null, storage[ id ] )
  }

  this.new = function( meta, callback ){
    meta.id = nextFreeId
    nextFreeId++
    storage[ meta.id ] = meta
    callback( null, meta )
  }

  this.all = function( callback ){
    var arr = []
    for( var key in storage ){
      arr.push( storage[key] )
    }
    callback( null, arr )
  }

  this.patch = function( id, meta, callback ){
    for( var prop in meta ){
      storage[ id ][ prop ] = meta[ prop ]
    }

    callback( null, storage[ id ] )
  }
}

function MockStorage(){
  var storage = {}

  this.put = function( name, file, callback ){
    var fileParts = []
    file.on( 'data', function( chunk ){
      fileParts.push( chunk )
    })

    file.on( 'end', function(){
      storage[ name ] = Buffer.concat( fileParts )
      callback( null )
    })
  }

  this.get = function( name, callback ){
    callback( null, storage[ name ] )
  }
}

function testLibrarian(){
  return librarian({
    metadataEngine: new MockMeta(),
    storageEngine: new MockStorage()
  })
}
describe( 'Librarian', function(){
  var app = testLibrarian()
  var port = process.env.PORT || 8888
  var baseUrl = 'http://localhost:' + port
  var testFile = path.join( __dirname, 'test_image.png' )

  it( 'should start up', function( done ){
    app.listen( port, function(){
      done()
    })
  })

  it( 'should show file listing', function( done ){
    request( baseUrl, function( err, response ){
      if( err ) throw err
      assert.equal( response.statusCode, 200 )
      done()
    })
  })

  it( 'should upload a file', function( done ){
    var req = request.post( baseUrl + '/upload', function( err, response, body ){
      assert.equal( response.statusCode, 200 )
      done()
    }).form().append( 'file', fs.createReadStream( testFile ) )
  })

  it( 'should retreive the file', function( done ){
    request( baseUrl + '/1', function( err, response, body ){
      assert.equal( response.statusCode, 200 )
      done()
    })
  })

  it( 'should retreive file meta', function( done ){
    request( baseUrl + '/1/meta', function( err, response, body ){
      assert.equal( response.statusCode, 200 )

      body = JSON.parse( body )
      assert.notEqual( body.id, undefined )
      assert.notEqual( body.mimeType, undefined )
      assert.notEqual( body.fileName, undefined )
      assert.notEqual( body.fileSize, undefined )
      done()
    })
  })

  it( 'should resized file', function( done ){
    request( baseUrl + '/1/10px', function( err, response, body ){
      assert.equal( response.statusCode, 200 )
      done()
    })
  })

  it( 'should 404 when asked for a non-existant file', function( done ){
    request( baseUrl + '/foobar', function( err, response, body ){
      assert.equal( response.statusCode, 404 )
      done()
    })
  })

  it( 'should allow patching of filename', function( done ){
    var fileName = 'my-test-file.png'
    request({
      url: baseUrl + '/1/meta',
      method: 'PATCH',
      json: true,
      body: {
        fileName: fileName
      }
    }, function( err, response, body ){
      assert.equal( response.statusCode, 200 )
      assert.equal( body.fileName, fileName )
      done()
    })
  })
})
