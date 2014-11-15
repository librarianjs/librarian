var sqlite = require( 'sqlite3' ).verbose()
var Promise = require( 'bluebird' )
var fs = require( 'fs' )

Promise.promisifyAll( fs )

module.exports = function localSetup(){
  var dbCreate = new Promise( function( reject, resolve ){
    var db = new sqlite.Database( this.options.root + '/' + this.options.db )
    db.on( 'open', resolve )
    db.on( 'error', reject )
  })

  var dbSetup = new Promise( function( reject, resolve ){
    dbCreate.then( function( db ){
      resolve()
    })
  })

  var fileSetup = new Promise( function( reject, resolve ){
    fs.mkdir( this.options.root + '/' + this.options.files ).then( resolve )
  }.bind( this ) )

  return Promise.all([ dbSetup, fileSetup ])
}
