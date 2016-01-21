'use strict'

function Controller (options) {
  this.data = options.data
  this.storage = options.storage
  this.cache = options.cache

  this.options = options

  /*
   * The controller's methods are provided to express as route callbacks.
   * When express calls them, `this` becomes the root scope.
   * This code binds all methods to the current controller instance
   */
  for(let prop in this){
    if(typeof this[ prop ] === 'function' && Controller.prototype.hasOwnProperty(prop)){
      this[ prop ] = this[ prop ].bind(this)
    }
  }
}

let methods = [
  'sendFile',
  'outputFile',
  'sendFileInfo',
  'upload',
  'parseFileInfo'
]

methods.forEach(function(method){
  Controller.prototype[ method ] = require('./' + method)
})

module.exports = Controller
