//import the data from the database
var utils = require('./utils');
var bigVar = require('./db/bigFiveVariables');
var db = require('./db/database');
var shuffle = require('shuffle-array');

//Function to get feedback without cues
exports.getFeedbackWithoutCues = function(userAnswer) {

  var final = [];
  var question = utils.getQuestionByNumber(userAnswer.questionId);

  var answers = question.answers;
  var sizeValues = question.sizeValues;
  var selected = utils.getAnswerById(answers, userAnswer.answerId);

  //Add my answer
  var obj = {
    "avatar": "c.png",
    "answer": selected.answer,
    "explanation": userAnswer.explanation,
    "order": 1
  };
  final.push(obj);

  //Who are the others supporting me?
  var othersSupportMe;
  var others;
  if(question.isMajority){
    othersSupportMe = sizeValues.maj;
    others = sizeValues.min;
  } else {
    othersSupportMe = sizeValues.min;
    others = sizeValues.maj;
  }

  //Add their answers as well
  var count = shuffle([2,3,4,5]);
  if (othersSupportMe != []){
    for(i=0; i < othersSupportMe.length; i++){
      var obj = {
          "avatar": othersSupportMe[i].avatarNoCues,
          "answer": selected.answer,
          "explanation": this.getExplanation(othersSupportMe[i].id, question.questionNumber, selected.id),
          "order": count[i]
        };
      final.push(obj);
    }
  }

  //Add the second best ansers
  var nextAnswer = utils.getUnselectedAnswersOrdered(answers, userAnswer.answerId, question.correctOrder)[0];
  if (others != []){
    for(i=0; i < others.length; i++){
      var obj = {
          "avatar": others[i].avatarNoCues,
          "answer": nextAnswer.answer,
          "explanation": this.getExplanation(others[i].id, question.questionNumber, nextAnswer.id),
          "order": count[count.length - (i+1)]
        };
      final.push(obj);
    }
  }

  return(final);

};

//Function to get feedback with cues
exports.getFeedbackWithCues = function(userAnswer) {

  var final = [];
  var question = utils.getQuestionByNumber(userAnswer.questionId);

  var answers = question.answers;
  var sizeValues = question.sizeValues;

  //Need to get this from the database
  var username = "Amy";
  var myGender = "female";
  var selected = utils.getAnswerById(answers, userAnswer.answerId);

  //Add my answer
  var avatar = (myGender == "female") ? "female.png" : "male.png";
  var obj = {
    "avatar": avatar,
    "username": username,
    "answer": selected.answer,
    "explanation": userAnswer.explanation,
    "order": 1
  };
  final.push(obj);

  //Who are the others supporting me?
  var othersSupportMe;
  var others;
  if(question.isMajority){
    othersSupportMe = sizeValues.maj;
    others = sizeValues.min;
  } else {
    othersSupportMe = sizeValues.min;
    others = sizeValues.maj;
  }

  //Add their answers as well
  var count = shuffle([2,3,4,5]);
  if (othersSupportMe != []){
    for(i=0; i < othersSupportMe.length; i++){
      var obj = {
          "avatar": othersSupportMe[i].avatar,
          "username": othersSupportMe[i].username,
          "answer": selected.answer,
          "explanation": this.getExplanation(othersSupportMe[i].id, question.questionNumber, selected.id),
          "order": count[i]
        };
      final.push(obj);
    }
  }

  //Add the second best ansers
  var nextAnswer = utils.getUnselectedAnswersOrdered(answers, userAnswer.answerId, question.correctOrder)[0];
  if (others != []){
    for(i=0; i < others.length; i++){
      var obj = {
          "avatar": others[i].avatar,
          "username": others[i].username,
          "answer": nextAnswer.answer,
          "explanation": this.getExplanation(others[i].id, question.questionNumber, nextAnswer.id),
          "order": count[count.length - (i+1)]
        };
      final.push(obj);
    }
  }

  return(final);
};

// Function to get the relevenat explanation for a user, ofr a given question and answer
// To be implemented
exports.getExplanation = function (userId, qId, answerId){
  return ("This could be a potential explanation coming from a script");
};

exports.shuffleArray = function(array){
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
};

//Function to create the questions and answers
exports.getAllQuestions = function() {
  var questions = utils.questions;
  var response = [];

  for (var i = 0; i < questions.length; i++) {
    var ques = questions[i];

    var q = {};
    q.questionId = ques.questionNumber;
    q.questionText = ques.questionText;
    q.questionImg = ques.img ? ques.img : null;
    q.answers = ques.answers;

    response.push(q);
  }
  return (response);
};

//Function to get question by Id
exports.getQuestionByQId = function(id) {
  var questions = utils.questions;
  for (var i = 0; i < questions.length; i++) {
    if (questions[i].questionNumber == id) {
      return (questions[i]);
    }
  }
};

//Function to process the big five data
exports.processBigFive = function(result) {
  var userId = result.userId;
  delete result["userId"];
  var answers = result;

  //Save all to the database
  db.saveBigFiveRaw(userId, answers);

  var allScores = {};

  for (var i = 0; i < bigVar.length; i++) {
    var trait = bigVar[i].key;
    var indexes = bigVar[i].values;
    var score = 0;

    for (var j = 0; j < indexes.length; j++) {
      if (answers[indexes[j].id]) {
        var answer = parseInt(answers[indexes[j].id]);
        if (indexes[j].isReverse) {
          answer = (5 - answer) + 1;
        }
        score = score + answer;
      }
    }
    allScores[trait] = score;
  }
  db.saveBigFiveResults(userId, allScores);
};

//Function to get all big five questions
exports.getBigFiveQuestions = function() {
  var questions = db.getBigFiveQuestions();
  return (questions);
};

//Function to save user data
exports.saveUserData = function(user) {
  var qOrder = [-1];
  var q = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
  var newQ = shuffle(q);
  for (var i = 0; i < newQ.length ; i++){
    qOrder.push(newQ[i]);
  }
  user.qOrder = qOrder;
  return new Promise(function(resolve, reject) {
    db.saveUser(user).then(function(userId) {
      resolve({"id" : userId, "qOrder" : qOrder});
    });
  });
};

//Function to save the user chat
exports.saveUserChat = function(userId, chats) {
  return new Promise(function(resolve, reject) {
    db.saveRawChat(userId, chats).then(function(status) {
      resolve(status);
    });
  });
};

//Function to save an answer
exports.saveAnswer = function(ans) {

  var answer = {};
  answer.userId = ans.userId;
  answer.questionId = ans.questionId;
  answer.oldAnswerId = ans.answerId;
  answer.oldConfidence = ans.confidence;
  answer.oldExplanation = ans.explanation;
  answer.newAnswerId = ans.answerId;
  answer.newConfidence = ans.confidence;
  answer.newExplanation = ans.explanation;

  return new Promise(function(resolve, reject) {
    db.saveAnswer(answer).then(function(answerId) {
      resolve(answerId);
    });
  });
};

//Function to update an answer
exports.updateAnswer = function(answer) {
  return new Promise(function(resolve, reject) {
    db.updateAnswer(answer).then(function(answerId) {
      resolve(answerId);
    });
  });
};
