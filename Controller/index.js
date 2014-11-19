function Controller( options ){
  this.options =  options
}

var methods = [
  'sendFile',
  'sendFileMeta',
  'sendFilePreview',
  'sendFileEmbed',
  'sendFileResized',

  'upload',
  'overwriteFile',

  'modifyBucketMeta',
  'modifyFileMeta'
]

methods.forEach( function( method ){
  Controller.prototype[ method ] = require( './' + method )
})

module.exports = Controller
