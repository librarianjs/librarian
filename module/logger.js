module.exports = {
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  FATAL: 5,

  debug: function( message ){ this.log( this.DEBUG ) },
  info: function( message ){ this.log( this.DEBUG ) },
  warn: function( message ){ this.log( this.DEBUG ) },
  error: function( message ){ this.log( this.DEBUG ) },
  fatal: function( message ){ this.log( this.DEBUG ) },

  log: function( level, message ){
    var level

    switch( level ){
      case this.DEBUG:
        level = 'DEBUG'
      break

      case this.INFO:
        level = 'INFO'
      break

      case this.WARN:
        level = 'WARN'
      break

      case this.ERROR:
        level = 'ERROR'
      break

      case this.FATAL:
      default:
        level = 'FATAL'
      break
    }
    console.log( level + '\t', message )

    if( level === this.FATAL ){
      process.exit()
    }
  }
}
