module.exports = function (req, res, next) {
  this.data.getAll()
    .then(data => res.json(data))
    .catch(next)
}
