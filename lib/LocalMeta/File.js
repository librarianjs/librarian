var Sequelize = require( 'sequelize' )
var path = require( 'path' )

module.exports = function setupFile( options ){
  var db = new Sequelize( 'database', null, null, {
    dialect: 'sqlite',
    storage: options.db
  })

  var File = db.define( 'File', {
    fileName: Sequelize.STRING,
    filePath: Sequelize.STRING,
    mimeType: Sequelize.STRING,
    fileSize: Sequelize.BIGINT
  })

  var Attribute = db.define( 'Attribute', {
    name: Sequelize.STRING,
    value: Sequelize.STRING
  })

  File.hasMany( Attribute, { as: 'Attributes' } )

  File.sync()

  return File
}
