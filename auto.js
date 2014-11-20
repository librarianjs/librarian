var librarian = require( './lib' )

librarian().listen( 8888, function(){
  console.log( 'Listening' )
} )
