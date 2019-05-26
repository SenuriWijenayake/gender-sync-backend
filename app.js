var express = require("express");
var bodyParser = require("body-parser");
var routes = require("./routes/routes.js");

var app = express();
var server = require('http').Server(app);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
routes(app);

server.listen(process.env.PORT || 5000);

//Chat room code
const io = require("socket.io")(server);
var users = [];
io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('new_connection', (data) => {
    console.log("Connected user : " + socket.id, data.username);
    users.push({"id" : socket.id, "username" : data.username});
    console.log(users);

    io.sockets.emit('connected', {
      'message': data.username + " joined the chat. Waiting for " + (5 - users.length) + " others.",
      'username': "QuizBot"
    });
  });

  socket.on('welcome', (data) => {
    io.sockets.connected[socket.id].emit('new_message', {
      'message': "Hello " + data.username + "! Welcome to the quiz. You will be asked to answer 18 multilple-choice questions in this quiz, with four other participants.",
      'username': "QuizBot"
    });

    io.sockets.connected[socket.id].emit('new_message', {
      'message': "You will first answer each question individually. Next, you will see group answers. Then you may discuss the group's answers through this chat. Finally, you can make changes to your answer, confidence level or explanation." +
      " If the instructions are clear, type GO to start the quiz!",
      'username': "QuizBot"
    });
  });

  socket.on('new_message', (data) => {
    io.sockets.emit('new_message', {
      'message': data.message,
      'username': data.username
    });
  });
});
