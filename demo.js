const librarian = require('.')
librarian({debug: true}).listen(8888,
  () => console.log('test server listening on :8888'))
