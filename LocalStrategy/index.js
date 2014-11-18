var _ = require( 'lodash' )
var logger = require( '../module/logger' )
var defaults = {
  root: process.env.PWD,
  db: 'files.db',
  files: 'files'
}

function LocalStrategy( options ){
  this.options = _.merge( defaults, options )

  this.ready = false
  this.init().then( function(){
    this.ready = true
  }.bind( this ), function(){
    logger.fatal( arguments )
  })
}

var functions = [
  //Route handlers
  'upload',
  'bucketMeta',
  'modifyBucketMeta',
  'sendFile',
  'sendFileResized',
  'sendFileMeta',
  'sendFilePreview',
  'sendFileEmbed',
  'overwriteFile',
  'modifyFileMeta',

  //Utility methods
  'init',
  'rename'
]

functions.forEach( function( func ){
  LocalStrategy.prototype[ func ] = require( './' + func )
})

module.exports = LocalStrategy
