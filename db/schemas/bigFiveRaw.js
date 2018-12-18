var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var bigFiveRawSchema = new Schema({
  userId : String,
  allAnswers : { type : Array , "default" : [] }
});

var BigFiveRaw = mongoose.model('BigFiveRaw', bigFiveRawSchema);

module.exports = BigFiveRaw;
