/*
 * Imports
 */
var express = require('express')
var robinhood = require('robinhood')
var app = express()
var router = express.Router()
var Robinhood = robinhood()
var port = process.env.PORT || 8080
var mongoose = require('mongoose')
var User = require('./app/models/user')
var bodyParser = require('body-parser')
var path = require('path');
var cors = require('cors')
var authentication = require('./app/routes/authentication')(router)
var stocks = require('./app/routes/stocks')(router)

/*
 * Setup
 */
app.use(cors({ origin: 'http://localhost:4200' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/client/dist'))
app.use('/authentication', authentication)
app.use('/stocks', stocks)

/*
 * Mongoose setup
 */
mongoose.promise = global.promise;
//mongodb://<minagadallah>:<Monmon@2018>@ds145355.mlab.com:45355/invest
//'mongodb://localhost:27017/invest'
mongoose.connect('mongodb://admin:admin123@ds145355.mlab.com:45355/invest', { useNewUrlParser: true }, function (err, db) {
  if (err) {
    console.log('Cannot Connect to the Database ' + err)
  } else {
    console.log('Successfully connected to MongoDBs')
  }
});

/*
 * Routes
 */
// app.get('*', function (req, res, err) {
//   res.sendFile(path.join(__dirname + '/client/src/index.html'));
// });

app.get('/hello', function (req, res) {
  Robinhood.quote_data('GOOG', function (error, response, body) {
    if (error) {
      console.log(error)
      process.exit(1)
    }
    res.send(body)
  });
});

app.listen(port, function () {
  console.log("Runing the server on local Host Port " + port)
});
