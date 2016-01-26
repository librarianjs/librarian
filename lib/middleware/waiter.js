const HTTP_SERVER_ERROR = 500

function buildPluginWaiter (readyPromise) {
  return function processRequest (req, res, next) {
    readyPromise
      .then(() => next())
      .catch(err => res.status(HTTP_SERVER_ERROR).end())
  }
}

module.exports = buildPluginWaiter
