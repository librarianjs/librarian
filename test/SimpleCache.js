module.exports = class SimpleCache {
  constructor () {
    this.cache = {}
    this._put = 0
    this._hit = 0
  }
  get (key) {
    let value = this.cache[key] || null
    if (value) {
      this._hit += 1
    }
    return Promise.resolve(value)
  }
  put (key, value) {
    this._put += 1
    return Promise.resolve(this.cache[key] = value)
  }
}
