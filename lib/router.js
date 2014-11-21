var express = require( 'express' )
var multerLib = require( 'multer' )
var Controller = require( './Controller' )

function buildRouter( options ){
  var router = express.Router()
  var multer = multerLib()
  var controller = new Controller( options )

  /*
   * File Upload
   */

  router.post( '/upload', multer, controller.upload )
  router.put( '/upload', multer, controller.upload )

  /*
   * File Access
   */

  router.get( '/:id', controller.sendFile )
  router.get( '/:id/meta', controller.sendFileMeta )
  router.get( '/:id/embed', controller.sendFileEmbed )
  router.get( '/:id/preview', controller.sendFilePreview )
  router.get( '/:id/:preset', controller.sendFileResized )
  router.get( '/:id/:width(x:height)?', controller.sendFileResized )

  /*
   * File Modification
   */

  router.put( '/:id', controller.overwriteFile )
  router.patch( '/:id', controller.overwriteFile )
  router.patch( '/:id/meta', controller.modifyFileMeta )

  /*
   * Misc metadata
   */

  router.get( '/', controller.allFileMeta.bind( controller ) )


  return router
}

module.exports = buildRouter
