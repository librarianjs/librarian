'use strict'

class NoCache {
  get () {
    return Promise.resolve(null)
  }
  put () {
    return Promise.resolve(null)
  }
}

module.exports = NoCache
