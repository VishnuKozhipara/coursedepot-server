var express = require('express');                         // load Express.js
var app = express();
var path = require("path");
const port = process.env.PORT || 3000;
var publicPath = path.resolve(__dirname, "public");

app.use(express.json());                                  // parse the request parameters
app.use((req,res,next)=>{​​
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*')
  next();

}​​);
// connect MongoDB
const MongoClient = require('mongodb').MongoClient;
let db;
MongoClient.connect('mongodb+srv://Vishnu:vishnu001@cluster0.iv05o.mongodb.net/webstore?retryWrites=true&w=majority', (err, client) => {
     db = client.db('webstore')
});

// display a message for root path to show that API is working
// app.get('/', (req, res, next) => {
//     res.send('Select a collection, e.g., /collection/message')
// });

app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    // console.log('collection name:', req.collection)
    return next()
});




app.get('/collection/:collectionName', (req, res, next) => { 
    req.collection.find({}, {limit: 16, sort: [['price', -1]]}).toArray((e, results) => {
        if(e) return next(e)
        res.send(results)
    });
});


app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
        if (e) return next(e)
        res.send(results.ops);
    });
});

const ObjectID = require('mongodb').ObjectID;
app.get('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.findOne({ _id: new ObjectID(req.params.id)}, (e, result) => {
        if (e) return next(e)
        res.send(result)
    });
});

app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.update(
        {_id: new ObjectID(req.params.id)},
        {$set: req.body},
        {safe: true, multi: false},
        (e, result) => {
            if (e) return next(e)
            res.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
        }
    )
});


app.delete('/collection/:collectionName/:id', (req, res, next) =>{
    req.collection.deleteOne(
        {_id: ObjectID(req.params.id) }, (e, result) => {
            if (e) return next(e)
            res.send((result.result.n === 1) ?
            {msg: 'success'} : {msg: 'error'})
        });
});

app.use('/', express.static(publicPath))
app.use(function(request, response){
    response.status(404);
    response.send("File not Found");
});

app.listen(process.env.PORT || 3000, () => {
    console.log('localhost:3000')
});