var _ = require( 'lodash' )
var path = require( 'path' )
var file = require( './File' )
var HashId = require( 'hashids' )

var defaults = {
  db: path.join( process.env.PWD, 'files.sqlite' )
}

function LocalMeta( options ){
  this.options = options = _.merge( defaults, options )
  this.File = file( this.options )
  this.hasher = new HashId( ( this.options.hashKey || 'strawberry jam' ), 5 )

}

LocalMeta.prototype.parseId = function( hash ){
  return this.hasher.decode( hash )
}

LocalMeta.prototype.makeId = function( numberId ){
  return this.hasher.encode( numberId )
}

LocalMeta.prototype.sanitize = function( file ){
  if( _.isArray( file ) ){
    return file.map( this.sanitize.bind( this ) )
  } else {
    file = file.values
    file.id = this.makeId( file.id )
    return file
  }
}

LocalMeta.prototype.get = function( fileId, callback ){
  var id = this.parseId( fileId )

  this.File.find( id ).bind( this ).then( function( file ){
    callback( null, this.sanitize( file ) )
  }, function(){
    callback( new Error( 'Could not retreive file ' + id ) )
  })
}

LocalMeta.prototype.all = function( callback ){
  this.File.findAll().bind( this ).then( function( files ){
    callback( null, this.sanitize( files ) )
  })
}

LocalMeta.prototype.patch = function( fileId, values, callback ){
  var id = this.parseId( fileId )

  this.File.find( id ).bind( this ).then( function( file ){
    for( var key in values ){
      if( !values.hasOwnProperty( key ) ) continue
      file[ key ] = values[ key ]
    }
    return file.save()
  }).then( function( file ){
    callback( null, file )
  })
}

LocalMeta.prototype.new = function( meta, callback ){
  this.file.create( meta ).bind( this ).then( function( file ){
    var meta = file.values
    meta.id = this.makeId( meta.id )
    callback( null, meta )
  }, function(){
    callback( new Error( 'Could not create record' ) )
  })
}

module.exports = LocalMeta
