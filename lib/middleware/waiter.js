'use strict'

const http = require('http-status-codes')

function buildPluginWaiter (readyPromise) {
  let ready = false
  let error = null

  readyPromise.then(() => {
    ready = true
  }, err => {
    error = err
  })

  return function processRequest (req, res, next) {
    if (error != null) {
      return res.status(http.INTERNAL_SERVER_ERROR).json({
        error: 'plugin_failed',
        message: error.message
      })
    }

    if (!ready) {
      return res.status(http.SERVICE_UNAVAILABLE).json({
        error: 'plugins_initializing',
        message: 'Waiting for plugins to start up, please wait'
      })
    }

    next()
  }
}

module.exports = buildPluginWaiter
