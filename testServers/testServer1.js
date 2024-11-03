// Source: 
// [1]: https://expressjs.com/en/resources/middleware/serve-favicon.html

// vanilla http server

// my favicon came from
// https://creativecommons.org/licenses/by/4.0/


var http = require('http')
var favicon = require('serve-favicon')
var finalhandler = require('finalhandler')
var path = require('path')

var _favicon = favicon(path.join(__dirname, 'public', 'favicon.ico'))

var server = http.createServer(function onRequest (req, res) {
  var done = finalhandler(req, res)

  _favicon(req, res, function onNext (err) {
    if (err) return done(err)

    // continue to process the request here, etc.

    res.statusCode = 404
    res.end('BROO')
  })
})

server.listen(3000)
