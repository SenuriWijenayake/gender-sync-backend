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
  questionSet : String
});

var Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
