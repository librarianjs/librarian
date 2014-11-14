var sqlite = require( 'sqlite3' ).verbose()
var Promise = require( 'bluebird' )

Promise.promisify( sqlite.Database )

module.exports = function localSetup(){
  this.db = new sqlite.Database( this.options.db )
  }.bind( this ))
}
