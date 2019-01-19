var logic = require('../code');
var utils = require('../utils');

var appRouter = function(app) {
  app.post('/chartData', function(req, res) {
    console.log(req.body);
    console.log("Request received at chart data");
    var userAnswer = {};

    userAnswer.userId = req.body.userId;
    userAnswer.questionId = parseInt(req.body.questionId);
    userAnswer.answerId = parseInt(req.body.answerId);
    userAnswer.confidence = parseFloat(req.body.confidence);
    userAnswer.questionSet = req.body.questionSet;

    return new Promise(function(resolve, reject) {
      logic.saveAnswer(userAnswer).then(function(id) {
        data = logic.getDataForChart(userAnswer);
        result = JSON.stringify(data);
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
      message: "hellow world"
    });
    res.status(200).send(result);
  });

  //Endpoint to get a question by id
  app.post('/question', function(req, res) {
    data = logic.getQuestionBySetAndId(req.body.set, req.body.id);
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
      logic.saveUserData(req.body).then(function(id) {
        resolve(res.status(200).send(id));
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

};

module.exports = appRouter;
