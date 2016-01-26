'use strict'

module.exports = function init () {
  let waiters = []
  if (this.storage.init) {
    waiters.push(this.storage.init())
  }

  if (this.data.init) {
    waiters.push(this.data.init())
  }

  if (this.cache && this.cache.init) {
    waiters.push(this.cache.init())
  }

  if (waiters.length) {
    return Promise.all(waiters)
  } else {
    return Promise.resolve(true)
  }
}
