module.exports = function(req, res, next){
  var id = req.params.id

  Promise.all([
    this.data.get(id),
    this.storage.get(id),
  ]).then(values => {
    if (values[0] === null || values[1] === null) {
      return res.status(404).end()
    }

    this.outputFile(res, values[0], values[1])
  }).catch(next)
}
