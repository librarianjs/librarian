'use strict'

const assert = require('assert')
const librarian = require('../lib')
const request = require('request')
const fs = require('fs')
const path = require('path')

const MemoryStorage = require('librarian-memory-storage')
const MemoryData = require('librarian-memory-data')

function testLibrarian(){
  return librarian({
    data: new MemoryData,
    storage: new MemoryStorage
  })
}

describe('Librarian', function(){
  let app = testLibrarian()
  let port = process.env.PORT || 8888
  let baseUrl = 'http://localhost:' + port
  let testFile = path.join(__dirname, 'test_image.png')
  let saved = null

  function url () {
    return baseUrl + '/' + saved.id
  }

  it('should start up', function(done){
    app.listen(port, function(){
      done()
    })
  })

  it('should upload a file', function(done){
    let req = request.post({
      url: baseUrl + '/upload',
      json: true
    }, function(err, response, body){
      assert.equal(response.statusCode, 200)
      assert.notEqual(body.id, undefined)
      saved = body
      done()
    }).form().append('file', fs.createReadStream(testFile))
  })

  it('should retreive the file', function(done){
    request(url(), function(err, response, body){
      assert.equal(response.statusCode, 200)
      done()
    })
  })

  it('should retreive file meta', function(done){
    request({
      url: url() + '/info',
      json: true
    }, function(err, response, body){
      assert.equal(response.statusCode, 200)
      assert.notEqual(body.id, undefined)
      assert.notEqual(body.mimeType, undefined)
      assert.notEqual(body.name, undefined)
      assert.notEqual(body.size, undefined)
      done()
    })
  })

  it('should resized file', function(done){
    request({
      url: url() + '/10',
      json: true
    }, function(err, response, body){
      assert.equal(response.statusCode, 200)
      done()
    })
  })

  it('should 404 when asked for a non-existant file', function(done){
    request(baseUrl + '/foobar', function(err, response, body){
      assert.equal(response.statusCode, 404)
      done()
    })
  })

  it('should 404 when asked for a non-existant file with size', function(done){
    request(baseUrl + '/foobar/100', function(err, response, body){
      assert.equal(response.statusCode, 404)
      done()
    })
  })
})
