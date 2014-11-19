var express = require( 'express' )
var multerLib = require( 'multer' )
var Controller = require( './controller' )

function buildRouter( options ){
  var router = express.Router()
  var multer = multerLib()
  var controller = new Controller( options )

  /*
   * File Upload
   */

  router.post( '/upload(/:bucket)?', multer, controller.upload )
  router.put( '/upload(/:bucket)?', multer, controller.upload )

  /*
   * Bucket Access
   */

  router.get( '/b/:bucket', controller.bucketMeta )

  /*
   * File Access
   */

  router.get( '/(:bucket/)?:id', controller.sendFile )
  router.get( '/(:bucket/)?:id/meta', controller.sendFileMeta )
  router.get( '/(:bucket/)?:id/embed', controller.sendFileEmbed )
  router.get( '/(:bucket/)?:id/preview', controller.sendFilePreview )
  router.get( '/(:bucket/)?:id/sm(all)?', controller.sendFileResized )
  router.get( '/(:bucket/)?:id/med(ium)?', controller.sendFileResized )
  router.get( '/(:bucket/)?:id/large', controller.sendFileResized )
  router.get( '/(:bucket/)?:id/:width(x:height)?', controller.sendFileResized )

  /*
   * Bucket Modification
   */

  router.patch( '/b/:bucket', controller.modifyBucketMeta )

  /*
   * File Modification
   */

  router.put( '/(:bucket/)?:id', files.overwriteFile )
  router.patch( '/(:bucket/)?:id', files.overwriteFile )
  router.patch( '/(:bucket/)?:id/meta', strategy.modifyFileMeta )

  return router
}

module.exports = buildRouter
