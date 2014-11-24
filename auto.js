var librarian = require( './lib' )()

librarian.set( 'port', process.env.PORT || 4111 )

librarian.listen( librarian.get( 'port' ), function(){
  console.log( 'Listening on port ' + librarian.get( 'port' ) )
} )
