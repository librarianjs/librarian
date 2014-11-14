var _ = require( 'lodash' )
var defaults = {
  root: process.env.PWD,
  db: 'files.db',
  files: 'files'
}

function LocalStrategy( options ){
  this.options = _.merge( defaults, options )

  this.ready = false
  this.init()
}

var functions = [
  //Route handlers
  'upload',
  'bucketMeta',
  'modifyBucketMeta',
  'sendFile',
  'sendFileMeta',
  'sendFilePreview',
  'sendFileEmbed',
  'overwriteFile',
  'modifyFileMeta',

  //Utility methods
  'init',
  'rename',
  'buffer'
]

functions.forEach( function( func ){
  LocalStrategy.prototype[ func ] = require( './' + func )
})

module.exports = LocalStrategy