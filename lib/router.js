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

  router.get( '/upload', controller.uploadForm )
  router.post( '/upload', multer, controller.upload )
  router.put( '/upload', multer, controller.upload )

  /*
   * File Access
   */

  router.get( '/:id', controller.sendFile )
  router.get( '/:id/meta', controller.sendFileMeta )
  router.get( '/:id/embed', controller.sendFileEmbed )
  router.get( '/:id/(:width)(px)?', controller.sendFileResized )

  /*
   * File Meta Modification
   */

  router.patch( '/:id/meta', controller.modifyFileMeta )

  /*
   * Misc metadata
   */

  router.get( '/', controller.allFileMeta.bind( controller ) )

  return router
}

module.exports = buildRouter
