module.exports = function (req, res, next) {
  this.data.get(req.params.id)
    .then(data => res.json(data))
    .catch(next)
}
