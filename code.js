//import the data from the database
var utils = require('./utils');
var bigVar = require('./db/bigFiveVariables');
var db = require('./db/database');
var shuffle = require('shuffle-array');

//Function to get data for the charts
exports.getDataForChart = function(userAnswer) {

  var question = utils.getQuestionByNumber(userAnswer.questionSet, userAnswer.questionId);
  var answers = question.answers;
  var sizeValues = [];

  for (var i = 0; i <= 2; i = i + 2) {
    sizeValues.push(question.sizeValues[i] + question.sizeValues[i + 1]);
  }
  sizeValues.push(0);
  sizeValues.push(0);

  console.log(sizeValues);
  final = [];

  //Set the first answer
  var selected = utils.getAnswerById(answers, userAnswer.answerId);
  selected.value = sizeValues[0];
  final.push(selected);

  //Get other answers
  var others = utils.getUnselectedAnswersOrdered(answers, userAnswer.answerId, question.correctOrder);

  //Set values of the other answers
  for (var i = 0; i < others.length; i++) {
    others[i].value = sizeValues[i + 1];
    final.push(others[i]);
  }

  //Replace with ones for blocks
  for (var i = 0; i < final.length; i++) {
    var id = 0;
    var temp = [];
    if (final[i].value != 0) {
      for (var j = 0; j < final[i].value; j++) {
        temp.push({
          "id": ++id,
          "src": "grey-block.png"
        });
      }
    } else {
      temp = [{
        "id": 0,
        "src": "dash.png"
      }];
    }
    final[i].count = id;
    final[i].value = temp;
  }

  //Order for display
  final.sort(function(a, b) {
    return a.id - b.id
  });

  var chartDescriptionData = {};
  chartDescriptionData.isMajority = question.isMajority;
  chartDescriptionData.selected = selected;
  chartDescriptionData.others = others;
  chartDescriptionData.mode = userAnswer.mode;

  var res = {};
  res.answers = final;
  res.question = question.questionText;
  res.description = utils.getChartDescription(chartDescriptionData);

  console.log(res);
  return (res);
};

//Function to populate the value array with avatars
exports.populateValueArray = function(fCount, mCount, seed) {
  if (seed == 0){
    seed = Math.floor(Math.random() * 2) + 1;
  }
  console.log(seed, fCount, mCount);

  if (seed == 1) {
    //females first
    var value = [];
    var id = 1;

    for (var i = 0; i < fCount; i++) {
      var temp = {};
      temp.id = id;
      temp.src = 'female.png';
      value.push(temp);
      id++;
    }

    for (var i = 0; i < mCount; i++) {
      var temp = {};
      temp.id = id;
      temp.src = 'male.png';
      value.push(temp);
      id++;
    }
  } else {
    var value = [];
    var id = 1;

    for (var i = 0; i < mCount; i++) {
      var temp = {};
      temp.id = id;
      temp.src = 'male.png';
      value.push(temp);
      id++;
    }

    for (var i = 0; i < fCount; i++) {
      var temp = {};
      temp.id = id;
      temp.src = 'female.png';
      value.push(temp);
      id++;
    }
  }
  console.log(value, seed);
  return ({"value" : value, "seed" : seed});
};

//Function to get data for avatar feedback
exports.getAvatarFeedback = function(userAnswer) {
  var question = utils.getQuestionByNumber(userAnswer.questionSet, userAnswer.questionId);
  var answers = question.answers;
  var sizeValues = question.sizeValues;
  var seed = 0;

  var final = [];

  //Set my answer
  var selected = utils.getAnswerById(answers, userAnswer.answerId);
  var obj = this.populateValueArray(sizeValues[0], sizeValues[1], 0);
  selected.value = obj.value;
  seed = obj.seed;

  //set the female and male count
  if (seed == 1){
    selected.count = [sizeValues[0], sizeValues[1]];
  } else {
    selected.count = [sizeValues[1], sizeValues[0]];
  }
  final.push(selected);

  //For others
  var others = utils.getUnselectedAnswersOrdered(answers, userAnswer.answerId, question.correctOrder);
  for (var i = 0; i < others.length; i++) {
    if (i == 0) {
      var obj = this.populateValueArray(sizeValues[2], sizeValues[3], seed);
      others[i].value = obj.value;
      if (seed == 1){
        others[i].count = [sizeValues[2], sizeValues[3]];
      } else {
        others[i].count = [sizeValues[3], sizeValues[2]];
      }
    } else {
      others[i].value = [{
        "id": 1,
        "src": "dash.png"
      }];
      others[i].count = [0, 0];
    }
    final.push(others[i]);
  }

  //Order for display
  final.sort(function(a, b) {
    return a.id - b.id
  });

  var chartDescriptionData = {};
  chartDescriptionData.isMajority = question.isMajority;
  chartDescriptionData.selected = selected;
  chartDescriptionData.others = others;
  chartDescriptionData.mode = userAnswer.mode;
  chartDescriptionData.seed = seed;

  var res = {};
  res.answers = final;
  res.question = question.questionText;
  res.description = utils.getChartDescription(chartDescriptionData);

  console.log(res);
  return (res);

};

//Function to get data for names feedback
exports.getNamesFeedback = function(userAnswer){
  var question = utils.getQuestionByNumber(userAnswer.questionSet, userAnswer.questionId);
  var answers = question.answers;
  var sizeValues = question.sizeValues;
  var seed = 0;

  var final = [];

  //Set my answer
  var selected = utils.getAnswerById(answers, userAnswer.answerId);
  var obj = this.getArrayOfNames(sizeValues[0], sizeValues[1], 0, [], []);
  selected.value = obj.value;
  seed = obj.seed;
  females_used = obj.females_used;
  males_used = obj.males_used;

  //set the female and male count
  if (seed == 1){
    selected.count = [sizeValues[0], sizeValues[1]];
  } else {
    selected.count = [sizeValues[1], sizeValues[0]];
  }
  final.push(selected);

  //For others
  var others = utils.getUnselectedAnswersOrdered(answers, userAnswer.answerId, question.correctOrder);
  for (var i = 0; i < others.length; i++) {
    if (i == 0) {
      var obj = this.getArrayOfNames(sizeValues[2], sizeValues[3], seed, females_used, males_used);
      others[i].value = obj.value;
      if (seed == 1){
        others[i].count = [sizeValues[2], sizeValues[3]];
      } else {
        others[i].count = [sizeValues[3], sizeValues[2]];
      }
    } else {
      others[i].value = [{
        "id": 1,
        "src": "----"
      }];
      others[i].count = [0, 0];
    }
    final.push(others[i]);
  }

  //Order for display
  final.sort(function(a, b) {
    return a.id - b.id
  });

  var chartDescriptionData = {};
  chartDescriptionData.isMajority = question.isMajority;
  chartDescriptionData.selected = selected;
  chartDescriptionData.others = others;
  chartDescriptionData.mode = userAnswer.mode;
  chartDescriptionData.seed = seed;

  var res = {};
  res.answers = final;
  res.question = question.questionText;
  res.description = utils.getChartDescription(chartDescriptionData);

  console.log(res);
  return (res);
};

exports.shuffleArray = function(array){
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
};

exports.getArrayOfNames = function(fCount, mCount, seed, females_used, males_used) {
  console.log(fCount, mCount, seed, females_used, males_used);

  if (seed == 0){
    seed = Math.floor(Math.random() * 2) + 1;
  }
  var females = ['Emily', 'Sarah', 'Grace', 'Laura', 'Chloe', 'Megan', 'Kayla', 'Paige', 'Holly', 'Molly', 'Julia', 'Amber', 'Alice', 'Eliza', 'Casey'];
  var males = ['David', 'James', 'Aaron', 'Dylan', 'Jacob', 'Jason', 'Peter', 'Scott', 'Tyler', 'Blake', 'Ethan', 'Trent', 'Kevin', 'Shane', 'Lucas'];

  var females_unused = [];
  var males_unused = [];

  //Get the list of unused males and females
  for (var i = 0; i < 7; i++){
    if (females_used.indexOf(females[i]) == -1){
      females_unused.push(females[i]);
    }
    if (males_used.indexOf(males[i]) == -1){
      males_unused.push(males[i]);
    }
  }

  console.log(males_unused, females_unused);
  f_unused = shuffle(females_unused);
  m_unused = shuffle(males_unused);

  console.log(f_unused, m_unused);

  if (seed == 1) {
    //females first
    var value = [];
    var id = 1;

    for (var i = 0; i < fCount; i++) {
      var temp = {};
      temp.id = id;
      temp.src = f_unused[i];
      value.push(temp);
      females_used.push(f_unused[i]);
      id++;
    }

    for (var i = 0; i < mCount; i++) {
      var temp = {};
      temp.id = id;
      temp.src = m_unused[i];
      value.push(temp);
      males_used.push(m_unused[i]);
      id++;
    }
  } else {
    var value = [];
    var id = 1;

    for (var i = 0; i < mCount; i++) {
      var temp = {};
      temp.id = id;
      temp.src = m_unused[i];
      value.push(temp);
      males_used.push(m_unused[i]);
      id++;
    }

    for (var i = 0; i < fCount; i++) {
      var temp = {};
      temp.id = id;
      temp.src = f_unused[i];
      value.push(temp);
      females_used.push(f_unused[i]);
      id++;
    }
  }
  console.log(value, seed, females_used, males_used);
  return ({"value" : value, "seed" : seed, "females_used" : females_used, "males_used" : males_used});
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
exports.getQuestionBySetAndId = function(set, id) {
  var questions = [];
  if (set == "1") {
    questions = utils.questions;
  }
  if (set == "2") {
    questions = utils.questionsTwo;
  }
  if (set == "3") {
    questions = utils.questionsThree;
  }
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
  var q = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38];
  var newQ = shuffle(q);
  for (var i = 0; i < newQ.length ; i++){
    qOrder.push(newQ[i]);
  }

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
  answer.newAnswerId = ans.answerId;
  answer.newConfidence = ans.confidence;
  answer.questionSet = ans.questionSet;

  console.log(answer);

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
