var express = require("express");
var bodyParser = require("body-parser");
var routes = require("./routes/routes.js");

var app = express();
var server = require('http').Server(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
routes(app);

server.listen(8080);
