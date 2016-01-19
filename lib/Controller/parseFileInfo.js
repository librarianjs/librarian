const uuid = require('node-uuid')

module.exports = function (file) {
  var data = {
    id: uuid.v4(),
    mimeType: file.mimetype,
    name: file.originalname,
    size: file.size
  }
  return Promise.resolve(data)
}
