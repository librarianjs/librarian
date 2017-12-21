const assert = require('assert')
const NoCache = require('../lib/plugins/NoCache.js')

describe('NoCache', () => {
  let plugin
  before(() => plugin = new NoCache())
  it('get() should return null', async () => {
    assert.equal(await plugin.get('testing'), null)
  })
  it('put() should return null', async () => {
    assert.equal(await plugin.put('testing', {}), null)
  })
})
