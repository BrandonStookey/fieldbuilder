'use strict';

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var app = module.exports = express();
app.use(morgan('tiny'));
app.use(bodyParser.json());

var routes = require('./routes');

app.use(express.static(__dirname + './../public/client'));

var port = process.env.PORT || 8080;

app.listen(port, function () {
  console.log('Listening on port ' + port);
});
