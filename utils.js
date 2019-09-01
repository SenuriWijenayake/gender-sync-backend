/*This file contains the utilities required for the logic on code.js*/

//Importing the questions
exports.questions = require('./db/questions');

//Get quote for a given answer id, in a given position when given the question
exports.getQuote = function(question, answerId, positionId){
  for (var i = 0; i < question.scripts.length; i++){
    if (question.scripts[i].answerId == answerId){
      for (var j = 0; j < 4; j++){
        if (question.scripts[i].quotes[j].id == positionId){
          return (question.scripts[i].quotes[j].text);
        }
      }
    }
  }
};

//Get my answer from array
exports.getAnswerByOrderId = function(answers, order){
  for (var i = 0; i < answers.length; i++){
    if (answers[i].order == order){
      return (answers[i]);
    }
  }
};


//Function to randomize the distribution size values
exports.randValues = function(isMajority, sizeValues) {

  if (isMajority == 'True') {
    isMajority = true;
  }
  if (isMajority == 'False') {
    isMajority = false;
  }

  //Remove zeros
  var noZeros = [];
  var offset = Math.floor(Math.random() * 4) + 1;

  //Determine the offset
  if (this.areArraysEqual(sizeValues, [50, 40, 10, 0]) ||
    this.areArraysEqual(sizeValues, [40, 30, 30, 0]) ||
    this.areArraysEqual(sizeValues, [40, 50, 10, 0]) ||
    this.areArraysEqual(sizeValues, [5, 90, 5, 0]) ||
    this.areArraysEqual(sizeValues, [30, 40, 30, 0])) {

    offset = Math.floor(Math.random() * 2) + 1
  }

  for (var i = 0; i < sizeValues.length; i++) {
    if (sizeValues[i] != 0) {
      noZeros.push(sizeValues[i]);
    }
  }

  var arrayLength = noZeros.length;

  if (isMajority == true) {
    console.log("Inside majority");
    if (arrayLength == 1) {
      noZeros.push(0);
      noZeros.push(0);
      noZeros.push(0);
    }

    if (arrayLength == 2) {
      noZeros[0] = noZeros[0] - offset;
      noZeros[1] = noZeros[1] + offset;
      noZeros.push(0);
      noZeros.push(0);
    }

    if (arrayLength == 3) {
      noZeros[0] = noZeros[0] - offset * 2;
      noZeros[1] = noZeros[1] + offset;
      noZeros[2] = noZeros[2] + offset;
      noZeros.push(0);
    }
    noZeros.sort(function(a, b) {
      return b - a
    });
  } else {
    console.log("Inside minority");
    if (arrayLength == 2) {
      noZeros[0] = noZeros[0] + offset;
      noZeros[1] = noZeros[1] - offset;
      noZeros.push(0);
      noZeros.push(0);
    }

    if (arrayLength == 3) {
      noZeros[0] = noZeros[0] + offset;
      noZeros[1] = noZeros[1] - offset * 2;
      noZeros[2] = noZeros[2] + offset;
      noZeros.push(0);
    }
  }
  console.log(noZeros);
  return (noZeros);
};

//Function to get question by questionNumber
exports.getQuestionByNumber = function(number) {

  var questions = this.questions;

  for (var i = 0; i < questions.length; i++) {
    if (questions[i].questionNumber == number) {
      return (questions[i]);
    }
  }
};

//Returns the unselected answers in the ranked order
exports.getUnselectedAnswersOrdered = function(allAnswers, selectedId, order) {
  var others = [];

  for (var i = 0; i < allAnswers.length; i++) {
    if (allAnswers[i].id != selectedId) {
      others.push(allAnswers[i]);
    }
  }

  //Order based on correctness
  var final = [];
  for (var i = 0; i < order.length; i++) {
    if (order[i] != selectedId) {
      final.push(this.getAnswerById(others, order[i]));
    }
  }

  return (final);
};

//Returns the answer given the answer id
exports.getAnswerById = function(answers, id) {
  for (var i = 0; i < answers.length; i++) {
    if (answers[i].id == id) {
      return (answers[i]);
    }
  }
}

//Function to compare two arrays
exports.areArraysEqual = function(arr1, arr2) {
  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] != arr2[i]) {
      return (false);
    }
  }
  return (true);
}

exports.getChartDescription = function(data) {
  console.log(data);
  var text = "";

  if (data.mode == "control") {
    // You are in majority
    if (data.isMajority) {
      text = "A majority of " + data.selected.count.toString() + "  /7 participants agree with your answer \"" + data.selected.answer.toString() + "\".";
      text = text + " However, a minority of " + data.others[0].count.toString() + " /7 has voted for \"" + data.others[0].answer.toString() + "\" as the correct answer.";
    }
    // You are in the minority
    else if (!data.isMajority) {
      text = "Hmmm.. Looks like only a minority of " + data.selected.count.toString() + " /7 participants agree with your selection \"" + data.selected.answer.toString() + "\".";
      text = text + " A majority of " + data.others[0].count.toString() + " /7 has voted \"" + data.others[0].answer.toString() + "\" as the correct answer!";
    } else {
      text = "Oops! I can't seem to interprete this chart."
    }
  } else {
    // You are in majority
    if (data.isMajority) {
      if (data.seed == 1) {
        text = "A majority of " + data.selected.count[0].toString() + " females and " + data.selected.count[1].toString() + " males agree with your answer \"" + data.selected.answer.toString() + "\".";
        text = text + " However, a minority of " + data.others[0].count[0].toString() + " females and " + data.others[0].count[1].toString() + " males have voted for \"" + data.others[0].answer.toString() + "\" as the correct answer.";
      } else {
        text = "A majority of " + data.selected.count[0].toString() + " males and " + data.selected.count[1].toString() + " females agree with your answer \"" + data.selected.answer.toString() + "\".";
        text = text + " However, a minority of " + data.others[0].count[0].toString() + " males and " + data.others[0].count[1].toString() + " females have voted for \"" + data.others[0].answer.toString() + "\" as the correct answer.";
      }
    }
    // You are in the minority
    else if (!data.isMajority) {
      if (data.seed == 1) {
        text = "Hmmm.. Looks like only a minority of " + data.selected.count[0].toString() + " females and " + data.selected.count[1].toString() + " males agree with your selection \"" + data.selected.answer.toString() + "\".";
        text = text + " A majority of " + data.others[0].count[0].toString() + " females and " + data.others[0].count[1].toString() + " males have voted \"" + data.others[0].answer.toString() + "\" as the correct answer!";
      } else {
        text = "Hmmm.. Looks like only a minority of " + data.selected.count[0].toString() + " males and " + data.selected.count[1].toString() + " females agree with your selection \"" + data.selected.answer.toString() + "\".";
        text = text + " A majority of " + data.others[0].count[0].toString() + " males and " + data.others[0].count[1].toString() + " females have voted \"" + data.others[0].answer.toString() + "\" as the correct answer!";
      }
    } else {
      text = "Oops! I can't seem to interprete this chart."
    }
  }

  return ({
    name: "QuizBot",
    msg: text
  });
}
