var Promise = require( 'bluebird' )

function Controller( options ){
  this.options = options

  /*
   * The controller's methods are provided to express as route callbacks.
   * When express calls them, `this` becomes the root scope.
   * This code binds all methods to the instance
   */
  for( var prop in this ){
    if( typeof this[ prop ] === 'function' && Controller.prototype.hasOwnProperty( prop ) ){
      this[ prop ] = this[ prop ].bind( this )
    }
  }
}

var methods = [
  'allFileMeta',
  'sendFile',
  'outputFile',
  'sendFileMeta',
  'sendFileEmbed',
  'sendFileResized',
  'upload',
  'uploadForm',
  'modifyFileMeta',
  'parseFileMeta'
]

methods.forEach( function( method ){
  Controller.prototype[ method ] = require( './' + method )
})

module.exports = Controller
