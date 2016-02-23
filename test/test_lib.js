'use strict'

const assert = require('assert')
const librarian = require('../lib')
const request = require('request')
const fs = require('fs')
const path = require('path')
const http = require('http-status-codes')

const MemoryStorage = require('librarian-memory-storage')
const MemoryData = require('librarian-memory-data')

const AsyncMemoryStorage = require('./AsyncMemoryStorage')
const AsyncMemoryData = require('./AsyncMemoryData')

function randomPort () {
  return Math.round(Math.random()*10000) + 1000
}

function waitForInitStop (url, step, done) {
  if (step && !done) {
    done = step
    step = 0
  }

  request(url, (err, response) => {
    if (err) {
      return done(err)
    }

    if (response.statusCode === http.SERVICE_UNAVAILABLE) {
      if (step >= 6) {
        return done(new Error('URL ' + url + ' never returned a non SERVICE_UNAVAILABLE code'))
      }
      return setTimeout(() => {
        waitForInitStop(url, step + 1, done)
      }, 5e2)
    } else {
      done()
    }
  })
}

describe('Librarian', () => {
  describe('with defaults', () => {
    let app

    function url () {
      return baseUrl + '/' + saved.id
    }

    let port = process.env.PORT || randomPort()
    let baseUrl = 'http://localhost:' + port
    let testFile = path.join(__dirname, 'test_image.png')
    let saved = null
    let fileDataBuffer

    before(() => {
      app = librarian({
        data: new MemoryData,
        storage: new MemoryStorage
      })
      fileDataBuffer = fs.readFileSync(testFile)
    })

    it('should start up', done => {
      app.listen(port, function(){
        done()
      })
    })

    it('should upload a file', done => {
      request.post({
        url: baseUrl,
        json: true
      }, (err, response, body) => {
        assert.equal(response.statusCode, http.CREATED)
        assert.notEqual(body.id, undefined)
        saved = body
        done()
      }).form().append('file', fs.createReadStream(testFile))
    })

    it('should fail with message for missing file', done => {
      request({
        url: baseUrl,
        method: 'post',
        json: true
      }, (err, res, body) => {
        assert.equal(res.statusCode, http.BAD_REQUEST)
        assert(body.error)
        assert.equal(body.error.type, 'missing_file')
        assert.equal(body.error.message, 'Please POST with name `file`')
        done()
      })
    })

    it('should retreive the file', done => {
      request(url(), (err, response, body) => {
        assert.equal(response.statusCode, 200)
        assert(fileDataBuffer.compare(new Buffer(body)))
        done()
      })
    })

    it('should retreive file meta', done => {
      request({
        url: url() + '/info',
        json: true
      }, function (err, response, body) {
        assert.equal(response.statusCode, 200)
        assert.notEqual(body.id, undefined)
        assert.notEqual(body.mimeType, undefined)
        assert.notEqual(body.name, undefined)
        assert.notEqual(body.size, undefined)
        done()
      })
    })

    it('should resized file', done => {
      request({
        url: url() + '?width=10',
        json: true
      }, (err, response, body) => {
        assert.equal(response.statusCode, 200)
        done()
      })
    })

    it('should 404 when asked for a non-existant file', done => {
      request(baseUrl + '/foobar', function (err, response, body) {
        assert.equal(response.statusCode, 404)
        done()
      })
    })

    it('should 404 when asked for a non-existant file with size', done => {
      request(baseUrl + '/foobar?width=100', (err, response, body) => {
        assert.equal(response.statusCode, 404)
        done()
      })
    })
  })

  describe('with async plugins', () => {
    let app

    function url () {
      return baseUrl + '/' + saved.id
    }

    let port = process.env.PORT || randomPort()
    let baseUrl = 'http://localhost:' + port
    let testFile = path.join(__dirname, 'test_image.png')
    let saved = null
    let fileDataBuffer

    before(() => {
      fileDataBuffer = fs.readFileSync(testFile)
      app = librarian({
        data: new AsyncMemoryData,
        storage: new AsyncMemoryStorage
      })
    })

    it('should start up', done => {
      app.listen(port, () => {
        done()
      })
    })

    it('should show message when plugins are initializing', function (done) {
      this.timeout(10e3)

      request({
        url: baseUrl,
        json: true,
      }, (err, response, body) => {
        if (err) {
          return done(err)
        }

        assert.equal(response.statusCode, http.SERVICE_UNAVAILABLE)
        assert.equal(body.error, 'plugins_initializing')

        done()
      })
    })

    it('should finish initializing', function (done) {
      this.timeout(4e3)

      waitForInitStop(baseUrl, done)
    })

    it('should upload a file', done => {
      request.post({
        url: baseUrl,
        json: true
      }, (err, response, body) => {
        if (response.statusCode !== http.CREATED) {
          console.log('ERROR BODY', body)
        }
        assert.equal(response.statusCode, http.CREATED)
        assert.notEqual(body.id, undefined)
        saved = body
        done()
      }).form().append('file', fs.createReadStream(testFile))
    })
  })

  describe('with async plugins that fail', () => {
    let app

    function url () {
      return baseUrl + '/' + saved.id
    }

    let port = process.env.PORT || randomPort()
    let baseUrl = 'http://localhost:' + port
    let testFile = path.join(__dirname, 'test_image.png')
    let saved = null
    let fileDataBuffer

    before(() => {
      fileDataBuffer = fs.readFileSync(testFile)
      app = librarian({
        data: new AsyncMemoryData({
          fail: true
        }),
        storage: new AsyncMemoryStorage({
          fail: true
        })
      })
    })

    it('should start up', done => {
      app.listen(port, () => {
        done()
      })
    })

    it('should show message when plugins are initializing', function (done) {
      this.timeout(10e3)

      request({
        url: baseUrl,
        json: true,
      }, (err, response, body) => {
        if (err) {
          return done(err)
        }

        assert.equal(response.statusCode, http.SERVICE_UNAVAILABLE)
        assert.equal(body.error, 'plugins_initializing')

        done()
      })
    })

    it('should finish initializing', function (done) {
      this.timeout(4e3)

      waitForInitStop(baseUrl, done)
    })

    it('should show message when plugins have failed', function (done) {
      this.timeout(4e3)

      request({
        url: baseUrl,
        json: true,
      }, (err, response, body) => {
        if (err) {
          return done(err)
        }

        try {
          assert.equal(response.statusCode, http.INTERNAL_SERVER_ERROR)
          assert.equal(body.error, 'plugin_failed')
        } catch (e) {
          return done(e)
        }

        done()
      })
    })
  })
})
