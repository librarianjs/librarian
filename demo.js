const librarian = require('.')

librarian({
  debug: true
}).listen(8888, function () {
  console.log('listening')
})
