var express = require("express");
var port = process.env.PORT || 8080;
var bodyParser = require("body-parser");
var routes = require("./routes/routes.js");

var app = express();
var server = require('http').Server(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
routes(app);

const port = normalizePort(process.env.PORT || "8080");
server.listen(port);
