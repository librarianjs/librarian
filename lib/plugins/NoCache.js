'use strict'

class NoCache {
  async get () { return null }
  async put () { return null }
}

module.exports = NoCache
