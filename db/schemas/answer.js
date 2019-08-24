var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var answerSchema = new Schema({
  userId : String,
  questionId: Number,
  oldAnswerId : Number,
  oldConfidence : Number,
  newAnswerId : Number,
  newConfidence : Number,
  submitTime : { type : Date, required: false, default: Date.now },
  editTime : { type : Date, required: false, default: Date.now },

  sawQuestion : { type : Date, required: false, default: null},
  selectedOption : { type : Date, required: false, default: null},
  selectedConf : { type : Date, required: false, default: null},
  clickedSubmit : { type : Date, required: false, default: null},
  sawFeedback : { type : Date, required: false, default: null},
  selectedYes : { type : Date, required: false, default: null},
  selectedNext : { type : Date, required: false, default: null},
  selectedNo : { type : Date, required: false, default: null},
  selectedUpdatedOption : { type : Date, required: false, default: null},
  selectedUpdatedConf : { type : Date, required: false, default: null},
  submittedUpdatedAnswer : { type : Date, required: false, default: null},
  sawUpdatedFeedback : { type : Date, required: false, default: null},

  feedback : { type : Array , required: false, default: null },
  updatedFeedback : { type : Array , required: false, default: null }
});

var Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
