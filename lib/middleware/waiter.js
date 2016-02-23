const http = require('http-status-codes')

function buildPluginWaiter (readyPromise) {
  return function processRequest (req, res, next) {
    readyPromise
      .then(() => next())
      .catch(err => res.status(http.SERVICE_UNAVAILABLE).json({
        error: 'starting_up',
        message: 'Waiting for plugins to start up, please wait'
      }))
  }
}

module.exports = buildPluginWaiter
