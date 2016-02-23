'use strict'

const wait = require('promise-wait')

class InMemoryData {
  constructor (options) {
    this.options = options || {}
    this.db = {}
  }

  init () {
    return wait(3e3).then(() => {
      if (this.options.fail) {
        return Promise.reject(new Error('BAAAAAD ERROR'))
      }
    })
  }

  get (id) {
    return Promise.resolve(this.db[id] || null)
  }

  put (record) {
    if (!(record && record.id)) {
      return Promise.reject('Invalid record')
    }
    this.db[record.id] = record
    return Promise.resolve()
  }

  getAll () {
    return Promise.resolve(Object.keys(this.db))
  }
}

module.exports = InMemoryData
