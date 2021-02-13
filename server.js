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
    res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, OPTIONS');

   
    next();
});

// connect MongoDB
const MongoClient = require('mongodb').MongoClient;
let db;
MongoClient.connect('mongodb+srv://Vishnu:vishnu001@cluster0.iv05o.mongodb.net/webstore?retryWrites=true&w=majority', (err, client) => {
     db = client.db('webstore')
});

// display a message for root path to show that API is working
app.get('/', (req, res, next) => {
    res.send('Select a collection, e.g., /collection/message')
});

app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    // console.log('collection name:', req.collection)
    return next()
});



/*app.listen(3000, () => {
    console.log('localhost:3000')
});*/