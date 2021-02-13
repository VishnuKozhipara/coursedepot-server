// Import dependency module:
var express = require("express");
// cont bodyParser = require('body-parser')

// create a Express.js instance
var app = express();

// config Express.js
app.use(express.json());
app.set('port', 3000)
app.use((req, res, next) => {
    // allow different IP address
    res.setHeader('Access-Control-Allow-Origin', '*');
    // allow different header field 
    res.header('Access-Control-Allow-Headers', '*');
  
   
    next();
});



/*app.listen(3000, () => {
    console.log('localhost:3000')
});*/