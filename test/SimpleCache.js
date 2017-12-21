module.exports = class SimpleCache {
  constructor () {
    this.cache = {}
    this._put = 0
    this._hit = 0
  }
  async get (key) {
    let value = this.cache[key] || null
    if (value) {
      this._hit += 1
    }
    return value
  }
  async put (key, value) {
    this._put += 1
    return this.cache[key] = value
  }
}
