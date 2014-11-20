var Sequelize = require( 'sequelize' )
var path = require( 'path' )

module.exports = function setupFile( options ){
  var db = new Sequelize( 'database', null, null, {
    dialect: 'sqlite',
    storage: options.db
  })

  return db.define( 'File', {
    filepath: Sequelize.STRING
  })
}
