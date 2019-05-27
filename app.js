var express = require("express");
var bodyParser = require("body-parser");
// var routes = require("./routes/routes.js");
var logic = require('./code');
var utils = require('./utils');

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
// routes(app);

server.listen(process.env.PORT || 5000);

//Chat room code
const io = require("socket.io")(server);
var users = [];
io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('new_connection', (data) => {
    console.log("Connected user : " + socket.id, data.username);
    users.push({
      "id": socket.id,
      "username": data.username
    });
    console.log(users);

    io.sockets.emit('connected', {
      'message': data.username + " joined the chat. Waiting for " + (5 - io.engine.clientsCount) + " others.",
      'username': "QuizBot"
    });
  });

  socket.on('new_message', (data) => {
    io.sockets.emit('new_message', {
      'message': data.message,
      'username': data.username
    });
  });

  socket.on('started', (data) => {
    io.sockets.emit('user_started', {
      'message': data.username + " started the quiz. You will be shown the question and the answers to prepare for discussion.",
      'question' : data.question,
      'username': "QuizBot"
    });
  });

});

//routes
app.post('/feedback', function(req, res) {

  console.log("Request received at feedback endpoint");
  var userAnswer = {};

  userAnswer.userId = req.body.userId;
  userAnswer.cues = req.body.cues;
  userAnswer.discussion = req.body.discussion;
  userAnswer.questionId = parseInt(req.body.questionId);
  userAnswer.answerId = parseInt(req.body.answerId);
  userAnswer.confidence = parseFloat(req.body.confidence);
  userAnswer.explanation = req.body.explanation;

  return new Promise(function(resolve, reject) {

    logic.saveAnswer(userAnswer).then(function(id) {
      if (userAnswer.cues != "Yes") {
        data = logic.getFeedbackWithoutCues(userAnswer);
      } else {
        data = logic.getFeedbackWithCues(userAnswer);
      }
      result = JSON.stringify(data);
      io.sockets.emit('feedback', {
        'info': result
      });
      resolve(res.status(200).send(result));
    });
  });
});

//Endpoint to get all the questions and answers
app.get('/questions', function(req, res) {
  data = logic.getAllQuestions();
  result = JSON.stringify(data);
  res.status(200).send(result);
});

//Endpoint to index
app.get('/', function(req, res) {
  result = JSON.stringify({
    message: "hello world"
  });
  res.status(200).send(result);
});

//Endpoint to get a question by id
app.post('/question', function(req, res) {
  console.log("Request received at question");
  data = logic.getQuestionByQId(req.body.id);
  result = JSON.stringify(data);
  res.status(200).send(result);
});

//Endpoint to get the big five questions
app.get('/bigFiveQuestions', function(req, res) {
  data = logic.getBigFiveQuestions();
  res.status(200).send(data);
});

//Endpoint to process the big five data
app.post('/bigFiveData', function(req, res) {
  console.log("Request received at big five");
  response = logic.processBigFive(req.body);
  res.status(200).send("<img src='http://blog.postable.com/wp-content/uploads/2017/07/TY_wedding_header.png' width='100%' height='100%'>");
});

//Endpoint to save user demographic data
app.post('/user', function(req, res) {
  console.log("Request received at user data");
  return new Promise(function(resolve, reject) {
    logic.saveUserData(req.body).then(function(obj) {
      resolve(res.status(200).send({
        "id": obj.id,
        "order": obj.qOrder
      }));
    });
  });
});

//Endpoint to save user chats
app.post('/saveChats', function(req, res) {
  console.log("Request received at user chat");
  return new Promise(function(resolve, reject) {
    var userId = req.body.userId;
    var chat = req.body.chats;

    logic.saveUserChat(userId, chat).then(function(status) {
      resolve(res.status(200).send(status));
    });
  });
});


//Endpoint to update answer
app.post('/updateAnswer', function(req, res) {
  console.log("Request received at update answer");
  var userAnswer = {};

  userAnswer.userId = req.body.userId;
  userAnswer.questionId = parseInt(req.body.questionId);
  userAnswer.newAnswerId = parseInt(req.body.answerId);
  userAnswer.newConfidence = parseFloat(req.body.confidence);
  userAnswer.newExplanation = req.body.explanation;

  return new Promise(function(resolve, reject) {
    logic.updateAnswer(userAnswer).then(function(id) {
      resolve(res.status(200).send(id));
    });
  });
});

app.post('/chat', function(req, res) {
  console.log(req.body);
  res.status(200).send("Response from Quiz Bot");
});

app.post('/randomValues', function(req, res) {
  var isMajority = req.body.isMajority;
  var values = [];
  for (var i = 0; i < req.body.values.length; i++) {
    values.push(parseInt(req.body.values[i]))
  }
  console.log(values);
  var result = utils.randValues(isMajority, values)
  res.status(200).send(result);
});
