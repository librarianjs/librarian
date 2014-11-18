var Sequelize = require( 'sequelize' )

module.exports = function setupFile( options ){
  var db = new Sequelize({
    dialect: 'sqlite',
    storage: options.root + '/' + options.db
  })

  return db.define({
    filepath: Sequelize.STRING
  })
}
