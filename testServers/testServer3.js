// Source: 
// [1]: https://expressjs.com/en/resources/middleware/serve-favicon.html

// connect

var connect = require('connect')
var favicon = require('serve-favicon')
var path = require('path')

var app = connect()
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// Add your middleware here, etc.

app.listen(3000)
