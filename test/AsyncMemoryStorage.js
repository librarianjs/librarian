'use strict'

const wait = require('promise-wait')

class InMemoryStorage {
  constructor (options) {
    this.options = options || {}
    this.db = {}
  }

  init () {
    return wait(200).then(() => {
      if (this.options.fail) {
        return Promise.reject(new Error('BAAAAAD ERROR'))
      }
    })
  }

  get (id) {
    return Promise.resolve(this.db[id] || null)
  }

  put (key, record) {
    if (!record) {
      return Promise.reject('Invalid record')
    }
    this.db[key] = record
    return Promise.resolve()
  }
}

module.exports = InMemoryStorage
