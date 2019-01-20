/*This file contains the utilities required for the logic on code.js*/

//Importing the questions
exports.questions = require('./db/questions');
exports.questionsTwo = require('./db/questionsTwo');

//Function to randomize the distribution size values
exports.randValues = function(isMajority, sizeValues) {

  if (isMajority == 'True'){
    isMajority = true;
  }
  if (isMajority == 'False'){
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
exports.getQuestionByNumber = function(set, number) {
  var questions = (set == "1" ? this.questions : this.questionsTwo);
  for (var i = 0; i < questions.length; i++) {
    if (questions[i].questionNumber == number) {
      return (questions[i]);
    }
  }
};

//Returns the unselected answers in the ranked order
exports.getUnselectedAnswersOrdered = function(allAnswers, selectedId, order) {
  var others = [];
  console.log(allAnswers, selectedId, order);
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

  //Determine how many minorities are there
  var noZeroes = [];
  for (var i = 0; i < data.others.length; i++) {
    if (data.others[i].value != 0) {
      noZeroes.push(data.others[i]);
    }
  }
  var numOthers = noZeroes.length;

  if (data.isObjective) {
    //No minorities scenario
    if (data.isMajority & numOthers == 0) {
      text = "Looks like all the other students (100%) agree with your answer \"" + data.selected.answer.toString() + "\" as well!";
    }
    //One minority scenario
    else if (data.isMajority & numOthers == 1) {
      text = "A majority of " + data.selected.value.toString() + "% of participants agree with your answer \"" + data.selected.answer.toString() + "\".";
      text = text + " However, a minority of " + noZeroes[0].value.toString() + "% has voted for \"" + noZeroes[0].answer.toString() + "\" as the correct answer.";
    }
    //Two minorities scenario
    else if (data.isMajority & numOthers == 2) {
      text = "A majority of " + data.selected.value.toString() + "% of participants agree with your answer \"" + data.selected.answer.toString() + "\".";
      text = text + " However, a minority of " + noZeroes[0].value.toString() + "% has voted for \"" + noZeroes[0].answer.toString() + "\" and another " + noZeroes[1].value.toString() + "% has voted for \"" + noZeroes[1].answer.toString() + "\" as the correct answer.";
    }
    //One majority - One minority
    else if (!data.isMajority & numOthers == 1) {
      text = "Hmmm.. Looks like only a minority of " + data.selected.value.toString() + "% of participants agree with your selection \"" + data.selected.answer.toString() + "\".";
      text = text + " A majority of " + noZeroes[0].value.toString() + "% has voted \"" + noZeroes[0].answer.toString() + "\" as the correct answer!";
    }
    //One majority - Two minorities
    else if (!data.isMajority & numOthers == 2) {
      text = "Only a " + data.selected.value.toString() + "% minority agree with your selection \"" + data.selected.answer.toString() + "\".";
      text = text + " A majority of " + noZeroes[0].value.toString() + "% has voted for \"" + noZeroes[0].answer.toString() + "\" while another " + noZeroes[1].value.toString() + "% has voted for \"" + noZeroes[1].answer.toString() + "\".";
    } else {
      text = "Oops! I can't seem to interprete this chart."
    }

  } else {
    //For subjective questions
    //No minorities scenario
    if (data.isMajority & numOthers == 0) {
      text = "Looks like all the other students (100%)  with your decision to \"" + data.selected.answer.toString() + "\" with this statement.";
    }
    //One minority scenario
    else if (data.isMajority & numOthers == 1) {
      text = "A majority of " + data.selected.value.toString() + "% of participants concur with your decision to \"" + data.selected.answer.toString() + "\" with this statement, while a minority of ";
      text = text + noZeroes[0].value.toString() + "% \"" + noZeroes[0].answer.toString() + "\" with the statement.";
    }
    //Two minorities scenario
    else if (data.isMajority & numOthers == 2) {
      text = "A majority of " + data.selected.value.toString() + "% of participants concur with your decision to \"" + data.selected.answer.toString() + "\" with this statement.";
      text = text + " However, a minority of " + noZeroes[0].value.toString() + "% have opted to \"" + noZeroes[0].answer.toString() + "\" and another " + noZeroes[1].value.toString() + "% \"" + noZeroes[1].answer.toString() + "\" with this statement.";
    }
    //One majority - One minority
    else if (!data.isMajority & numOthers == 1) {
      text = "Hmmm.. Looks like only " + data.selected.value.toString() + "% of the participants concur with your decision to \"" + data.selected.answer.toString() + "\" with this statement.";
      text = text + " A majority of " + noZeroes[0].value.toString() + "% \"" + noZeroes[0].answer.toString() + "\" with this statement!";
    }
    //One majority - Two minorities
    else if (!data.isMajority & numOthers == 2) {
      text = "Only a " + data.selected.value.toString() + "% minority concur with your decision to \"" + data.selected.answer.toString() + "\" with this statement.";
      text = text + " A majority of " + noZeroes[0].value.toString() + "% \"" + noZeroes[0].answer.toString() + "\", while another " + noZeroes[1].value.toString() + "% \"" + noZeroes[1].answer.toString() + "\" with this statement.";
    } else {
      text = "Oops! I can't seem to interprete this chart."
    }

  }

  return ({
    name: "QuizBot",
    msg: text
  });
}
