var librarian = require( './index' )

librarian().listen( 8888, function(){
  console.log( 'Listening' )
} )
