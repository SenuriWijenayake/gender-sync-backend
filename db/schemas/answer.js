var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var answerSchema = new Schema({
  userId : String,
  questionId: Number,
  oldAnswerId : Number,
  oldConfidence : Number,
  oldExplanation : String,
  newAnswerId : Number,
  newConfidence : Number,
  newExplanation : String,
  submitTime : { type : Date, required: false, default: Date.now },
  editTime : { type : Date, required: false, default: Date.now }
});

var Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
