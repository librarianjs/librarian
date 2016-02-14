const assert = require('assert')
const DataPlugin = require('../')

const UUID_REGEX = /[\w]{8}(-[\w]{4}){3}-[\w]{12}/
const TEST_KEY = 'test-key'
const FAKE_KEY = 'fake-key'

describe('DataPlugin', function(){
  var record = {
    id: TEST_KEY,
    name: 'cats.png',
    size: 4444,
    mimeType: 'image/png'
  }

  var plugin

  before(function () {
    plugin = new DataPlugin({ /* ... */ })
  })

  after(function () {
    // do cleanup here
  })

  it('should put() successfully', () => {
    return plugin.put(record)
  })

  it('should get() successfully', () => {
    return plugin.get(TEST_KEY).then(fetched => {
      assert.deepEqual(record, fetched)
    })
  })

  it('should getAll() successfully', () => {
    return plugin.getAll().then(fetched => {
      assert(Array.isArray(fetched), 'Returned data is not in array form')
      assert(typeof fetched[0] !== 'object', 'Returned records are objects')
    })
  })

  it('should return null for a missing key', () => {
    return plugin.get(FAKE_KEY).then(data => {
      assert.equal(data, null)
    })
  })
})
