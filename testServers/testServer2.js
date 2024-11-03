// Source: 
// [1]: https://expressjs.com/en/resources/middleware/serve-favicon.html

// express

var express = require('express')
var favicon = require('serve-favicon')
var path = require('path')

var app = express()
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.get('/', (req, res)=>{
    res.send('Hello from the Express.js server of Conrad');
})

app.listen(3000)
