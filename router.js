var express = require( 'express' )
var multerLib = require( 'multer' )

function buildRouter( strategy ){
  var router = express.Router()
  multer = multerLib()

  /*
   * File Upload
   */

  router.post( '/upload', multer, strategy.upload )
  router.put( '/upload', multer, strategy.upload )

  router.post( '/upload/:bucket', multer, strategy.upload )
  router.put( '/upload/:bucket', multer, strategy.upload )

  /*
   * Bucket Access
   */

  router.get( '/b/:bucket', strategy.bucketMeta )

  /*
   * File Access
   */

  router.get( '/:id', strategy.sendFile )
  router.get( '/:id/meta', strategy.sendFileMeta )
  router.get( '/:id/preview', strategy.sendFilePreview )
  router.get( '/:id/embed', strategy.sendFileEmbed )

  router.get( '/:bucket/:id', strategy.sendFileMeta )
  router.get( '/:bucket/:id/meta', strategy.sendFileMeta )
  router.get( '/:bucket/:id/preview', strategy.sendFilePreview )
  router.get( '/:bucket/:id/embed', strategy.sendFileEmbed )

  /*
   * Bucket Modification
   */

  router.patch( '/b/:bucket', strategy.modifyBucketMeta )

  /*
   * File Modification
   */

  router.put( '/:id', strategy.overwriteFile )
  router.patch( '/:id', strategy.overwriteFile )

  router.put( '/:bucket/:id', strategy.overwriteFile )
  router.patch( '/:bucket/:id', strategy.overwriteFile )

  router.patch( '/:id/meta', strategy.modifyFileMeta )
  router.patch( '/:bucket/:id/meta', strategy.modifyFileMeta )

  return router
}

module.exports = buildRouter
