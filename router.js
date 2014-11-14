var controller = require( './controller' )
var router = require( 'express' ).Router()

/*
 * File Upload
 */

router.post( '/upload', controller.upload )
router.put( '/upload', controller.upload )

router.post( '/upload/:bucket', controller.upload )
router.put( '/upload/:bucket', controller.upload )

/*
 * Bucket Access
 */

router.get( '/b/:bucket', controller.bucketMeta )

/*
 * File Access
 */

router.get( '/:id', controller.sendFile )
router.get( '/:id/meta', controller.sendFileMeta )
router.get( '/:id/preview', controller.sendFilePreview )
router.get( '/:id/embed', controller.sendFileEmbed )

router.get( '/:bucket/:id', controller.sendFileMeta )
router.get( '/:bucket/:id/meta', controller.sendFileMeta )
router.get( '/:bucket/:id/preview', controller.sendFilePreview )
router.get( '/:bucket/:id/embed', controller.sendFileEmbed )

/*
 * Bucket Modification
 */

router.patch( '/b/:bucket', controller.modifyBucketMeta )

/*
 * File Modification
 */

router.put( '/:id', controller.overwriteFile )
router.patch( '/:id', controller.overwriteFile )

router.put( '/:bucket/:id', controller.overwriteFile )
router.patch( '/:bucket/:id', controller.overwriteFile )

router.patch( '/:id/meta', controller.modifyFileMeta )
router.patch( '/:bucket/:id/meta', controller.modifyFileMeta )

module.exports = router
