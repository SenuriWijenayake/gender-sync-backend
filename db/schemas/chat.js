var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var chatSchema = new Schema({
  userId : String,
  chat : { type : Array , "default" : [] }
});

var Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
