var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  id: String,
  gender: String,
  age: Number,
  education: String,
  field : String,
  discussion : Boolean,
  cues: String,
  visibility: Boolean,
  genderSpecified : {type : String, required: false},
  qOrder : {type : Array}
});

var Result = mongoose.model('User', userSchema);

module.exports = Result;
