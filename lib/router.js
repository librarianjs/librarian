var express = require( 'express' )
var multerLib = require( 'multer' )
var bodyParser = require( 'body-parser' )
var Controller = require( './Controller' )

function buildRouter( options ){
  var router = express.Router()
  var multer = multerLib()
  var controller = new Controller( options )

  /*
   * File Upload
   */

  if( options.authenticate ){
    router.get( '/upload', options.authenticate, controller.uploadForm )
    router.post( '/upload', options.authenticate, multer, controller.upload )
    router.put( '/upload', options.authenticate, multer, controller.upload )
  } else {
    router.get( '/upload', controller.uploadForm )
    router.post( '/upload', multer, controller.upload )
    router.put( '/upload', multer, controller.upload )
  }

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

  if( options.authenticate ){
    router.patch( '/:id/meta', options.authenticate, bodyParser.json(), controller.modifyFileMeta )
  } else {
    router.patch( '/:id/meta', bodyParser.json(), controller.modifyFileMeta )
  }

  /*
   * Misc metadata
   */

  router.get( '/', controller.allFileMeta.bind( controller ) )

  return router
}

module.exports = buildRouter
