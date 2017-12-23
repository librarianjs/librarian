const librarian = require('.')
librarian({debug: true}).listen(8888, () => console.log('listening on :8888'))
